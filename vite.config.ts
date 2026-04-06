import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  optimizeDeps: {
    // Pre-bundle these packages to avoid slow barrel file imports
    // lucide-react has 1,583 modules, @hugeicons has similar scale
    // This provides 15-70% faster dev boot, 28% faster builds, 40% faster cold starts
    include: [
      "lucide-react",
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
    ],
  },
  server: {
    host: true, // 允許外部連接
    allowedHosts: [
      "aaa.local",
      "localhost",
      "127.0.0.1",
      ".local", // 允許所有 .local 域名
      ".localcan.dev", // 允許 localcan.dev 域名
      ".trycloudflare.com", // 允許 cloudflared quick tunnel
    ],
  },
});
