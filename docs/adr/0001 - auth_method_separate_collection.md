# Almacenamiento de métodos de autenticación: colección separada vs. array embebido

> **Decisión**: Guardar los métodos de autenticación (Steam, email) en una colección `AuthMethod` separada, referenciando a `User` mediante `userId`, en vez de un array embebido dentro del documento `User`.
> **Fecha**: 2026-08-07
> **Estado**: Activo

---

## Contexto

TrophyLogger soporta varios métodos de autenticación por usuario (Steam OpenID e email/contraseña más adelante). El schema original embebía los métodos de auth como un array dentro del documento `User`:

```typescript
authMethods: {
  type: [authMethodSchema] // steamId, email, passwordHash por entrada
}
```

El login por Steam requiere poder buscar "qué usuario tiene este **steamId**" sin saber de antemano quién es, este es el patrón de acceso principal que el schema tiene que soportar y garantizar que un `steamId` o `email` dado nunca pueda pertenecer a dos usuarios diferentes.

Aunque de momento sea mi proyecto personal (el tráfico lo genero solo yo), la decisión importa porque toca **identidad/autenticación** y me interesa diseñarlo bien ahora ya que evita tener que migrar un modelo ya en producción si el proyecto escala a tener usuarios reales.


## Opciones consideradas

### Opción A: Array embebido en `User`

**Ventajas:**
- Sin queries ni joins extra, todo lo del usuario está en un solo documento
- Sencillo leer el perfil completo de golpe

**Desventajas:**
- El `unique: true` de Mongoose sobre un campo dentro de un subdocumento de array **no** crea una garantía de unicidad a nivel de colección, tan solo evita duplicados *dentro del mismo array*, no entre distintos documentos `User`

- Garantizar unicidad real (que ningún `steamId` se repita entre usuarios) requeriría comprobaciones manuales en el código que son vulnerables a "race condition" (dos registros concurrentes con el mismo `steamId`)

---

### Opción B: Colección separada `AuthMethod` (referencia por `userId`)

**Ventajas:**
- Índice único a nivel de base de datos, sobre `steamId` / `email` en toda la colección siendo la base de datos y no el código, quien garantiza que no haya identidades duplicadas.

- Encaja con *"buscar el usuario por este steamId"* que pasa a ser una consulta indexada sobre `AuthMethod` y no una búsqueda dentro de un campo anidado en un array

**Desventajas:**
- Una query extra (o un `populate`) para ir de `AuthMethod` a `User`
- Crear un usuario por primera vez implica hacerlo en dos colecciones


## Razonamiento

El factor decisivo fue **dónde vive la garantía de unicidad**. Embeber los métodos de autenticación mantiene las lecturas cómodas, pero traslada la responsabilidad de comprobar las identidades duplicadas al código, que tiene que acordarse de comprobarlo en cada petición de persistencia a base de datos, incluso bajo peticiones concurrentes.

Una colección separada con un índice único mueve esa garantía a la base de datos, que la aplica siempre, sin depender de que el código lo compruebe bien en cada caso.


## Decisión

**Elegida: Opción B — Colección separada `AuthMethod`**

```typescript
const authMethodSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['steam', 'email'], required: true },
  steamId: { type: String, sparse: true },
  email: { type: String, sparse: true },
  passwordHash: String
});

authMethodSchema.index({ steamId: 1 }, { unique: true, sparse: true });
authMethodSchema.index({ email: 1 }, { unique: true, sparse: true });
```

## Cuándo revisar esta decisión

Cuando:
- La query extra se convierte en un cuello de botella que afecta al rendimiento (poco probable en la escala actual, pero a tener en cuenta con muchos usuarios concurrentes)

- Se añaden más proveedores de autenticación y el schema `AuthMethod` se queda corto para representarlos, habría que rediseñarlo


## Para saber más

- [Multikey Indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/) — cómo MongoDB indexa campos array y las reglas de unicidad sobre ellos
- [Create an Index on an Array Field](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-multikey/create-multikey-index-basic/) — cómo crear un índice multikey paso a paso
- [Mongoose Unique values in nested array of objects](https://codemia.io/knowledge-hub/path/mongoose_unique_values_in_nested_array_of_objects) — por qué `unique: true` en un subdocumento de array no basta y hace falta validación manual
- [mongoose-unique-validator (ladjs fork)](https://github.com/ladjs/mongoose-unique-validator) — plugin para convertir errores E11000 de MongoDB en errores de validación de Mongoose
