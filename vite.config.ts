import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  console.log('mode', loadEnv(mode, process.cwd()));
  return defineConfig({
    base: '/',
    plugins: [
      vue(),
      vueJsx(),
      // element-plus自动导入
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver()],
        // 自动导入eslint配置
        eslintrc: {
          enabled: false, // eslint检查 已存在文件设置默认false，需要更新时再打开，防止每次更新都重新生成
          filepath: './.eslintrc-auto-import.json',  // 生成的文件需要在.eslintrc extends中添加
          globalsPropValue: true,
        },
      }),
      // element-plus自动导入
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // 对使用到的组件样式进行按需导入
      ElementPlus({}),
      // 打包时生成gz文件
      {
        ...viteCompression(),
        apply: 'build',
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      // 开发环境启动的端口
      port: 3000,
      // 支持ip访问
      host: true,
      // 自动打开浏览器
      // open: true,
      https: false,
      // 跨域代理
      //   proxy: {
      //     '/api': {
      //       target: "http://localhost:3333",
      //       rewrite: (path) => path.replace(/^\/api/, '')
      //     }
      //   }
    },
    css: {
      // 配置全局sass变量
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";',
        },
      },
    },
    build: {
      // 打包配置项
      outDir: 'dist',
      assetsDir: 'static',
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: true, // css拆分
      sourcemap: false, // 不生成sourcemap
      minify: 'esbuild', // 是否禁用最小化混淆 esbuild(打包速度最快)  terser(打包体积最小)
      assetsInlineLimit: 4000, // 小于该值图片将打包成base64,
      rollupOptions: {
        output: {
          // 第三方插件分包
          manualChunks: {
            vue: ['vue', 'pinia', 'vue-router'],
            // elementIcons: ['@element-plus/icons-vue'],
          },
          // 拆分css和js
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    // 配置esbuild
    esbuild: {
      // 构建时移除代码中的 console.log和debugger
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  });
};
