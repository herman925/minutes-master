import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

// Spark plugins removed – local shims will be used instead
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  base: '/minutes-master/',
  plugins: [
    react(),
    tailwindcss(),
    // Spark plugins removed
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
});
