import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

const REQUIRED_BUILD_ENVS = ["VITE_API_BASE_URL"];

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (command === "build") {
    const missingEnvs = REQUIRED_BUILD_ENVS.filter((key) => !String(env[key] || "").trim());

    if (missingEnvs.length > 0) {
      throw new Error(
        `Missing required env for build: ${missingEnvs.join(", ")}. Check your .env file.`,
      );
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
