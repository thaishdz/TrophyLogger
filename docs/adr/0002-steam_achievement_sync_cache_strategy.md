# Sincronización de logros de Steam: propiedad de la API key y estrategia de caché

> **Decisión**: Usar solo la API key propia de la aplicación (nunca la del usuario) para sincronizar logros de perfiles públicos, con caché server-side y un cooldown de 5 minutos por `(usuario, juego)`.
> **Fecha**: 2026-08-07
> **Estado**: Activo

## Contexto

TrophyLogger permite al usuario elegir qué juegos quiere trackear para ver sus logros. El único dato necesario es lo que ya es público en el perfil de Steam del usuario, sus juegos y el estado de desbloqueo de logros. No hace falta actuar en nombre del usuario más allá de leer ese dato público.

La Web API de Steam tiene un límite aproximado de 100.000 peticiones/día, compartido entre **toda la aplicación** (por API key), no por usuario. Este presupuesto tiene que cubrir la actividad de sincronización de todos los usuarios combinada, así que la estrategia de sincronización tiene implicaciones directas en cuántos usuarios/juegos puede soportar la app antes del límite impuesto.

El diseño original del schema había asumido que la app necesitaría guardar la propia API key de Steam de cada usuario (cifrada), lo que planteaba un problema secundario, el de almacenarla como un secret de terceros (las API keys de Steam son personales y no deberían gestionarse a la ligera) para cada usuario, exigiendo un esquema de cifrado con una clave maestra guardada por separado.

## Opciones consideradas

### Opción A: Guardar la propia API key de Steam de cada usuario (cifrada)

**Ventajas:**
- Encaja conceptualmente con "la clave es del usuario, que la aporte él"

**Desventajas:**
- Los endpoints `GetOwnedGames` / `GetPlayerAchievements` de Steam funcionan con la **key propia de la aplicación** para cualquier perfil público. Una key aportada por el usuario no añade nada para este caso de uso, ya que la app nunca necesita leer datos *privados* de nadie
- Introduce una responsabilidad de seguridad, cifrado de una clave maestra que debe vivir fuera de la base de datos
- No resuelve el problema del *rate limit*, ya que un patrón de sincronización intensivo en lecturas seguiría sin cachear

---

### Opción B: API key propia de la app, sincronización en tiempo real (sin caché)

**Ventajas:**
- Siempre actualizado, sin desfase
- Sencillo de implementar, no hace falta lógica de cooldown

**Desventajas:**
- Cada actualización de perfil consume una petición de 100k/día; un número reducido de usuarios activos refrescando con frecuencia podría agotarlo

---

### Opción C: API key propia de la app, caché server-side con cooldown

**Ventajas:**
- Los logros tienen la particularidad de que se miran según acabe una sesión de juego o se consulta en un determinado momento, no cada x segundos.

- El cooldown se aplica en el servidor, así que no se puede saltar llamando al endpoint directamente.

**Desventajas:**
- Ligero desfase (hasta la duración del cooldown) tras un desbloqueo de logro real
- Requiere un campo `lastSyncedAt` y una comprobación de guarda en cada petición de sincronización


## Razonamiento

Se resolvieron dos preguntas distintas a la vez:

1. **¿La key de quién?** La propia [documentación de Steam](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29) confirma que `GetOwnedGames` y `GetPlayerAchievements` funcionan con la key de la app para cualquier perfil visible públicamente, el caso de uso donde la key del usuario haría falta sería para leer *sus datos privados*, algo que no se necesita. Al comprobar esto, dejó de tener sentido guardar, cifrar o gestionar ninguna key de usuario.

2. **¿Con qué frecuencia sincronizar?** Como el *rate limit* se comparte entre todos los usuarios de la app, sincronizar en tiempo real sin caché significa que no controlo cuántas peticiones se gastan, dependería de cuánta gente use la app y con qué frecuencia. Con una caché server-side y un cooldown por `(usuario, juego)`, sé cuánto puedo llegar a gastar como mucho.

El valor del cooldown (5 minutos) se eligió en base al número actual de usuarios del proyecto (solo yo). Ampliarlo implica que la base de usuarios crezca.


## Decisión

**Elegida: Opción C — API key propia de la app + caché server-side, cooldown de 5 minutos por `(usuario, juego)`**

```typescript
const SYNC_COOLDOWN_MINUTES = 5;

async function syncGameProgress(userId: string, appId: number, steamId64: string) {
  const existing = await GameProgress.findOne({ userId, appId });

  if (existing) {
    const minutesSinceSync = (Date.now() - existing.lastSyncedAt.getTime()) / 60000;
    if (minutesSinceSync < SYNC_COOLDOWN_MINUTES) {
      return existing; // sirve la copia cacheada, sin llamar a Steam
    }
  }

  const achievements = await fetchAchievementsFromSteam(appId, steamId64); // key propia de la app

  return GameProgress.findOneAndUpdate(
    { userId, appId },
    { achievements, lastSyncedAt: new Date() },
    { upsert: true, new: true }
  );
}
```

No se pide, guarda ni cifra ninguna API key de Steam de ningún usuario en ningún punto del sistema.


## Cuándo revisar esta decisión

Cuando:
- `usuarios_activos × juegos_trackeados × (24×60 / cooldown_minutos)` se acerca al límite de 100k/día, habría que recalcular el cooldown antes de que Steam empiece a dar errores

- Steam cambia su política de *rate limit*


## Para saber más

- [Steam Web API — GetOwnedGames (v0001)](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29) — este endpoint funciona con la key de la app, siempre que el perfil sea público
- [Steam Web API Terms of Use](https://steamcommunity.com/dev/apiterms) — el límite oficial de 100.000 peticiones diarias por API key hasta ahora (2026)


