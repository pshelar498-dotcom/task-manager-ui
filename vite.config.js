import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Must match the origin allowed by CORS in the API (task-manager-api/src/app.js)
    port: 5173,
    strictPort: true,
  },
});
