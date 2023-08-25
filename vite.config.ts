import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { dirname, join, relative, resolve, sep } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'

import manifest from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '~': resolve(join(__dirname, 'src')),
      src: resolve(join(__dirname, 'src')),
    },
  },
  plugins: [
    crx({ manifest }),

    vue(),

    Pages({
      dirs: [
        {
          dir: 'src/pages',
          baseRoute: '',
        },
        {
          dir: 'src/options/pages',
          baseRoute: 'options',
        },
        {
          dir: 'src/popup/pages',
          baseRoute: 'popup',
        },
        // {
        //   dir: 'src/content-script/iframe/pages',
        //   baseRoute: 'iframe',
        // },
        // {
        //   dir: 'src/content-script/element-selector/pages',
        //   baseRoute: 'element-selector',
        // },
      ],
    }),

    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables/'],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: ['src/components'],
      // generate `components.d.ts` for ts support with Volar
      dts: 'src/components.d.ts',
      resolvers: [
        // auto import icons
        IconsResolver({
          prefix: 'i',
          enabledCollections: ['mdi'],
        }),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
      compiler: 'vue3',
    }),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`
        )
      },
    },
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // input: {
      //   'service-worker': './src/background/index.ts',
      // },
      output: {
        manualChunks: (id) => {
          if (id.indexOf('node_modules') > -1) {
            return 'vendor'
          }
        },

        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split(sep)
            : []

          let folder = facadeModuleId[facadeModuleId.length - 2] || '[name]'
          console.log(
            '🚀 ~ file: vite.config.ts:111 ~ folder:',
            facadeModuleId[facadeModuleId.length - 2],
            chunkInfo
          )
          let filename =
            chunkInfo.facadeModuleId == null ? '[name]-bundle' : '[name]'

          // Components组件
          if (
            chunkInfo.moduleIds.filter(
              (moduleId) => moduleId.indexOf('components') > -1
            ).length > 0
          ) {
            folder = 'components'
            filename = chunkInfo.name.split('.vue')[0]
            return `js${sep}${folder}${sep}${filename}${sep}${filename}.js`
          }

          // 带有扩展名的JavaScript处理
          const regx = /\.(html|ts)/g
          if (regx.test(filename)) {
            filename = filename.replace(regx, '')
          } else if (regx.test(chunkInfo.name)) {
            filename = chunkInfo.name.replace(regx, '')
          }

          // 其他TypeScript、JavaScript文件
          return `js${sep}${folder}${sep}${filename}.js`
        },

        // 静态资源处理
        assetFileNames: `[ext]${sep}[name].[ext]`,
      },
    },
  },

  server: {
    port: 8888,
    strictPort: true,
    hmr: {
      port: 8889,
      overlay: true,
    },
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['vue-demi'],
  },
})
