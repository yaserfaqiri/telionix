import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:4300",
      "/uploads": "http://127.0.0.1:4300",
    },
  },
  resolve: {
    alias: {
      vue: resolve("node_modules/vue/dist/vue.esm-bundler.js"),
    },
  },
});
