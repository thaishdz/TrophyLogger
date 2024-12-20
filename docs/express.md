
# Express

## `app.use()`

*Se utiliza para registrar middlewares 👮.*

> Un middleware es una función que se ejecuta durante el ciclo de vida de una solicitud HTTP antes de que llegue a la ruta que corresponde.

### `app.use([path], middleware)`

- `path (opcional)`: Especifica una ruta o prefijo de ruta.

        Si no se especifica, el middleware se aplica a todas las rutas.

    > Esto significa que cualquier solicitud que llegue al servidor pasará por este middleware, lo que le permitirá a Express procesar los datos del `body` y convertirlos en un objeto JavaScript accesible desde `req.body`.

- `middleware`: Es la función que se ejecuta para procesar la solicitud. Puede ser un middleware estándar (como `express.json()` o `express.static()`) o una función personalizada.

### Registro de middlewares para rutas específicas

```ts
app.use('/api', express.json());  // Middleware solo para rutas que empiecen con '/api'
```

En este caso, express.json() solo se ejecutará para las rutas que comiencen con:

- `/api`
- `/api/login`
- `/api/user`, etc.

### Middleware personalizado

Para realizar tareas específicas, como validación, autenticación, registro de logs, etc.

```ts
app.use((req, res, next) => {
  console.log('Middleware personalizado');
  next(); // Llama a 'next' para pasar al siguiente middleware o ruta
});
```

### ¿Cuándo usar `app.use()`?

- Procesar datos: Si necesitas analizar el cuerpo de la solicitud, como cuando usas express.json() para procesar solicitudes JSON.
- Autenticación y autorización: Si necesitas verificar la autenticidad de la solicitud antes de permitir que acceda a rutas específicas.
- Registro de logs: Si deseas registrar información sobre las solicitudes que llegan a tu servidor.
- Manejo de errores: Puedes usar app.use() para manejar errores globalmente en tu aplicación Express.

## `app.use(express.json())`

Es un middleware que analiza (parsea) el cuerpo de las solicitudes HTTP entrantes que tengan el encabezado `Content-Type: application/json`.

Este middleware convierte el `body` en un objeto JavaScript, accesible en `req.body`, para que puedas manipular los datos de forma sencilla en el server.

### ¿Cómo funka?

Cuando un cliente (como un navegador o una aplicación) hace una solicitud `HTTP POST` o `PUT` (u otros métodos que incluyan un cuerpo de solicitud), puede enviar datos en formato JSON. Por ejemplo, si un cliente envía algo como:

```json
{
  "username": "thais",
  "password": "12345"
}
```

El servidor necesita interpretar este `body` para poder trabajar con los datos.

Al usar `express.json()`, Express automáticamente analiza el JSON y lo convierte en un objeto JavaScript que puedes acceder a través de `req.body`.

### Resumen

- **Facilita el manejo de datos JSON**: Muchas aplicaciones web modernas usan JSON para enviar y recibir datos. Este middleware hace que trabajar con esos datos sea mucho más fácil.

- **Evita tener que escribir código adicional**: Sin este middleware, tendrías que analizar el cuerpo de la solicitud manualmente (lo cual sería tedioso y propenso a errores).

- **Simplicidad y seguridad**: Express se encarga de la conversión y de los posibles errores relacionados con el parsing de JSON, lo que mejora la seguridad y confiabilidad del servidor.
