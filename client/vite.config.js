import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoBase = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
  : process.env.VITE_BASE || "/";

export default defineConfig({
  base: repoBase,
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
