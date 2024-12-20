
# Declaración de tipos con variables de entorno

## 1. Crea un nuevo fichero para extender la interfaz

```ts
// src/types/env.d.ts 📍
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string;
        API_KEY: string;
        PORT?: number;
      }
    }
}
```

### ¿Por qué usamos una interfaz?

Porque le da a TypeScript la capacidad de verificar que estás accediendo correctamente a las variables de entorno y que tienen los tipos correctos. Sin la interfaz, `process.env` es de tipo `Record<string, string | undefined>`, lo que significa que las variables de entorno pueden ser de tipo `string` o `undefined`. Al usar la interfaz, le estamos diciendo a TypeScript qué variables específicas esperamos y qué tipo tienen.

De lo contrario, se estaría quejando constantemente y nos diría
> "oye ponle algo así `process.env.MONGO_URI!` para yo asegurarme que siempre tendrá un valor".

Pero no queremos eso.

#### 2. Añadir el fichero creado al `tsconfig.ts`

```ts
{
  [...]
  },
  "include": [
    "src/**/*.ts", 
    "src/types/env.d.ts" <------ aquí
  ],
  "exclude": ["node_modules"]
}
```
