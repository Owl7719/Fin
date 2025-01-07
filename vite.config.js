import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath, URL } from "node:url";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    base: "/",
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      vueDevTools(),
      splitVendorChunkPlugin(),
      Vuetify({
        autoImport: true,
        styles: {
          configFile: "src/styles/variables.scss",
        },
      }),
      Components(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "crm",
          short_name: "crm",
          icons: [
            {
              src: "/img/icons/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/img/icons/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          start_url: "/dashboard",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#2f4050",
        },
        workbox: {
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
          globPatterns: ["**/*.{js,css}"],
          navigateFallback: null,
        },
      }),
    ],
    server: {
      proxy: env.VITE_API_DOMAIN,
      port: 8080,
    },
    resolve: {
      extensions: [".mjs", ".js", ".ts", "jsx", ".tsx", ".json", ".vue"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      outDir: "../public",
      chunkSizeWarningLimit: 2 * 1024 * 1024, // 2 MB
    },
  });
};
