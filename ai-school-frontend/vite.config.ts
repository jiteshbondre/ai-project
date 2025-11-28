import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Use environment variable for API URL in Docker, fallback to localhost for local dev
  const apiUrl = process.env.VITE_API_URL || "http://localhost:8080";
  
  return {
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
