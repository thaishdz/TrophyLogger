import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
      interval: 1000
    },
    hmr: {
      host: 'localhost',  // ← Importante para dev containers
      port: 3000,
      clientPort: 3000    // ← Esto le dice al browser qué puerto usar
    }
  }
})