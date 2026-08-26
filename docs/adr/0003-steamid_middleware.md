
# SteamID por petición: middleware dedicado vs resolución repetida en cada método

> Decisión: resolver el `steamId` del usuario autenticado una sola vez, en un middleware dedicado (`getSteamId`), en vez de que cada método que lo necesite lo resuelva por su cuenta. Fecha: 2026-08-13


## Contexto

SteamID se necesita para pedir la biblioteca de juegos así comos los logros de los mismos. Por lo que es un dato que consideré pedirlo solo una vez y tenerlo siempre disponible en cada llamada a la API de Steam.

## Opciones consideradas

### Opción A: Cada método resuelve su propio `steamID`cuando lo necesita

**Ventajas:**

- No hace falta tocar el objeto `Request` ni crear un middleware nuevo.

**Desventajas:**

- `gameAchievements` se llama una vez por cada juego encontrado. Si le tocara resolver el steamID, repetiría la misma consulta `AuthMethod` para el mismo usuario varias veces dentro la misma petición.


### Opción B: middleware dedicado, se resuelve UNA vez por petición

**Ventajas:**

- Una sola consulta a `AuthMethod` por petición, sin implortar cuántos métodos internos necesiten el steamId después.
- El controller queda más simple ya que lee directamente de `req.steamID` en vez de tener que instanciarlo a través de `UserService`

**Desventajas:**

- El middleware tiene que montarse en cada ruta que lo necesite

# Razonamiento

La finalidad era evitar repetir la misma consulta `AuthMethod`varias veces dentro de una misma petición. Esto es debido al funcionamiento de `gameAchievements`, este lanza una consulta por cada juego encontrado, de modo que, resolver el `steamID` dentro de ese método habría supuesto tantas consultas a Mongo como juegos devolviese la búsqueda, pidiendo siempre el mismo dato.

# Decisión

** Elegida: Opción B middlware dedicado getSteamID **

```ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

const userService = new UserService();


export const getSteamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.steamId = await userService.getSteamId(req.user)
    return next();
  } catch (error) {
    next(error);
  }
}
```

Este middleware se ejecutará tras `ensureAuthenticated` donde se necesite el `steamID`

```ts
router.get(
  `/search`,
  ensureAuthenticated,
  getSteamId,
  gamesController.searchGame.bind(gamesController),
);
```


# Cuándo revisar esta decisión

Cuando:

- Aparecen más datos derivados del usuario que varios controllers necesiten resolver de forma parecida, en ese caso, se llevaría a investigar algún patrón de diseño o arquitectura en vez de crear un middleware nuevo por cada dato

- El número de rutas protegidas crece demasiado, lo que tocaría plantear agrupar middlewares por defecto.
