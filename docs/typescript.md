
## ¿Qué es un tipo genérico `<T>` en TypeScript?

Es como una “plantilla” que se llena con el tipo que tú elijas cuando uses la función o clase.

En lugar de definir un tipo fijo, como `string` o `number`, puedes usar un tipo genérico que puede representar cualquier tipo.

# Ejemplo
> Estamos usando los tipos definidos en `src/types/env.d.ts` 📍
```ts
function getEnv<T extends keyof NodeJS.ProcessEnv>(key: T, defaultValue?: NodeJS.ProcessEnv[T]): NodeJS.ProcessEnv[T] {
  const value = process.env[key];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value as NodeJS.ProcessEnv[T]; // Devolvemos el valor (ya validado como tipo T)
}
```

- Cuando llamas a `getEnv<string>('DATABASE_URL')`, le estás diciendo a TypeScript que el tipo de valor que esperas para la variable de entorno `DATABASE_URL` es una string. En este caso, `<T>` será reemplazado por `string`.


- Si llamas a `getEnv<number>('PORT', 5000)`, le estás diciendo que el valor de `PORT` debe ser un `number`, entonces `<T>` será reemplazado por `number`.

> Los beneficios de usar tipos genéricos son una mayor flexibilidad sin perder la seguridad de tipos en tiempo de compilación.