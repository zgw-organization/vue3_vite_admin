import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // 开发环境启动的端口
    port: 3000,
    // 支持ip访问
    host: true,
    // 自动打开浏览器
    open: true,
    // 跨域代理
    //   proxy: {
    //     '/api': {
    //       target: "http://localhost:3333",
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
  },
  build: {
    // 打包配置项
    outDir: "dist",
    assetsDir: "static",
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true, // css拆分
    sourcemap: false, // 不生成sourcemap
    minify: "esbuild", // 是否禁用最小化混淆 esbuild(打包速度最快)  terser(打包体积最小)
    assetsInlineLimit: 4000, // 小于该值图片将打包成base64
  },
});
