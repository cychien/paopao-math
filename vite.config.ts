import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: true, // 允許外部連接
    allowedHosts: [
      "aaa.local",
      "localhost",
      "127.0.0.1",
      ".local", // 允許所有 .local 域名
      ".localcan.dev", // 允許 localcan.dev 域名
    ],
  },
});
