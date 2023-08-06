import { defineConfig, type PluginOption } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer';
import UnoCSS from 'unocss/vite';
import presetUno from '@unocss/preset-uno';
import presetAttributify from '@unocss/preset-attributify';

import viteCompression from 'vite-plugin-compression'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// import viteImagemin from 'vite-plugin-imagemin'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // rollup 配置
    cssCodeSplit: true,
    rollupOptions: {
       //启用/禁用 CSS 代码拆分
      output: {
          // key自定义 value[] 插件同步package.json名称 或 src/相对路径下的指定文件 （自己可以看manualChunks ts类型）
          manualChunks: {
          }
      }
    }
  },
  esbuild:{
    drop: ['console','debugger'], // 删除 所有的console 和 debugger
  },
  plugins: [
    vue(),
    viteCompression(),
    UnoCSS({
        presets: [presetUno(), presetAttributify()]
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
      // 设置为在'src/'目录下生成解决ts报错，默认是当前目录('./'，即根目录)
      dts: 'src/auto-import.d.ts',
      // 自动生成'eslintrc-auto-import.json'文件，在'.eslintrc.cjs'的'extends'中引入解决报错
      // 'vue-global-api'这个插件仅仅解决vue3 hook报错
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      resolvers: [ElementPlusResolver(),AntDesignVueResolver({
        importStyle: false, // css in js
      })],
      // 指定组件位置，默认是src/components
      dirs: ['src/components'],
      // ui库解析器
      // resolvers: [ElementPlusResolver()],
      extensions: ['vue'],
      // 配置文件生成位置
      dts: 'src/components.d.ts'
    }),
    // viteImagemin({
    //   gifsicle: {
    //     optimizationLevel: 5,
    //     interlaced: false
    //   },
    //   optipng: {
    //     optimizationLevel: 7
    //   },
    //   mozjpeg: {
    //     quality: 20
    //   },
    //   pngquant: {
    //     quality: [0.8, 0.9],
    //     speed: 4
    //   }
    // }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false
    })
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src/assets/images'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  base: './',
  server: {
    host: '0.0.0.0',
    // open: false,
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://miaoapi.pansi.com', // 凡是遇到 /api 路径的请求，都映射到 target 属性
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
      }
    }
  }
})
