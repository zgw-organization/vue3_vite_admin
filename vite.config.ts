import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 跨域代理
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: "http://localhost:3333",
  //       rewrite: (path) => path.replace(/^\/api/, '') 
  //     }
  //   }
  // },
  build: {
    // 打包配置项
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,                      // css拆分
    sourcemap: false,                        // 不生成sourcemap
    minify: 'terser',                           // 是否禁用最小化混淆 esbuild(打包速度最快)  terser(打包体积最小)
    assetsInlineLimit: 4000                  // 小于该值图片将打包成base64
  }
})
