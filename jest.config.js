module.exports = {
  preset: 'ts-jest', // usa ts-jest para compilar archivos .ts
  testMatch: [ // ubicación de los tests
    "<rootDir>/src/**/*.{test,spec}.ts"
  ],
  // Para que jest también busque en subcarpetas dentro de /src
  roots: ["<rootDir>/src"]
}