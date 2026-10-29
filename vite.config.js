import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  // Usar base relativa './' permite que funcione tanto en GitHub Pages (en cualquier subdirectorio /ultraseco-recetas/) como en dominios raíz
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
