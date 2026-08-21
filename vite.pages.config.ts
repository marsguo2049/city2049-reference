import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "city2049-reference";

export default defineConfig({
  root: "github-pages",
  publicDir: "../public",
  base: `/${repositoryName}/`,
  plugins: [react()],
  build: {
    outDir: "../dist/pages",
    emptyOutDir: true,
  },
});
