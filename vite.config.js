import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

const REQUIRED_BUILD_ENVS = ["VITE_API_BASE_URL", "VITE_ADMIN_API_BASE_URL"];

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (command === "build") {
    const hasBaseUrl = Boolean(String(env.VITE_API_BASE_URL || "").trim())
      || Boolean(String(env.VITE_ADMIN_API_BASE_URL || "").trim())

    if (!hasBaseUrl) {
      throw new Error("Missing required env for build: set VITE_API_BASE_URL (recommended) or VITE_ADMIN_API_BASE_URL.")
    }
  }

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      host: "127.0.0.1",
      port: 5173,
    },
  };
});
