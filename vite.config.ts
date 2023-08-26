import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { rm, stat } from 'fs/promises'

import globPkg from 'glob'
import { dirname, join, relative, resolve, sep } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import manifest from './manifest.config'
import { toCamelCase } from './src/lib/utils/helper'
const { glob } = globPkg

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
        {
          dir: 'src/content-script/iframe/pages',
          baseRoute: 'iframe',
        },
        {
          dir: 'src/content-script/element-selector/pages',
          baseRoute: 'element-selector',
        },
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
      plugins: [
        // 清除content-script多余文件
        {
          name: 'delete-files-except-specified',
          writeBundle() {
            const excludedFiles = ['index.html']

            glob('dist/src/content-script/**/*', (err, files) => {
              if (err) {
                console.error('Failed to find files:', err)
                return
              }

              Promise.all(
                files.map(async (file) => {
                  const filePath = resolve(file)
                  const fileStats = await stat(filePath)
                  const fileName = file.split('/').pop()
                  if (
                    fileName !== undefined &&
                    excludedFiles.includes(fileName)
                  ) {
                    return Promise.resolve()
                  }

                  if (!fileStats.isDirectory()) {
                    return rm(resolve(file))
                  }
                })
              )
                .then(() => console.log('Specified files deleted'))
                .catch((err) => console.error('Failed to delete files:', err))
            })
          },
        },
      ],
      input: {
        iframe: 'src/content-script/iframe/index.html',
        'element-selector': 'src/content-script/element-selector/index.html',
        SharedCodemirror: 'src/components/SharedCodemirror.vue',
      },
      output: {
        manualChunks: (id) => {
          if (id.indexOf('node_modules') > -1) {
            return 'vendor'
          }
        },

        entryFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split(sep)
            : []

          let folder = facadeModuleId[facadeModuleId.length - 2] || '[name]'
          let filename =
            chunkInfo.facadeModuleId == null ? '[name]-bundle' : '[name]'

          // content-script目录下
          if (
            chunkInfo.moduleIds.filter(
              (moduleId) => moduleId.indexOf('content-script') > -1
            ).length > 0
          ) {
            folder = 'content-script'
            return `js${sep}${folder}${sep}${filename}${sep}[name]-bundle.js`
          }

          // 带有扩展名的JavaScript处理
          const regx = /\.(html|ts)/g
          if (regx.test(filename)) {
            filename = filename.replace(regx, '')
          }

          // 其他TypeScript、JavaScript文件
          return `js${sep}${folder}${sep}${filename}.js`
        },

        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split(sep)
            : []

          let folder = facadeModuleId[facadeModuleId.length - 2] || '[name]'
          let filename =
            chunkInfo.facadeModuleId == null ? '[name]-bundle' : '[name]'

          // Components组件
          if (
            chunkInfo.moduleIds.filter(
              (moduleId) => moduleId.indexOf('components') > -1
            ).length > 0
          ) {
            
            folder = 'components'
            console.log("🚀 ~ file: vite.config.ts:192 ~ folder:", folder)
            const childFolder = toCamelCase(chunkInfo.name.split('.vue')[0], {
              addHyphen: true,
            })
            filename = toCamelCase(chunkInfo.name.split('.vue')[0], {
              capitalize: true,
            })
            return `js${sep}${folder}${sep}${childFolder}${sep}${filename}.js`
          }

          // Pages目录下文件处理
          if (folder === 'pages' && chunkInfo.facadeModuleId) {
            const srcSuffix = chunkInfo.facadeModuleId.substring(
              chunkInfo.facadeModuleId.lastIndexOf('src') + 3,
              chunkInfo.facadeModuleId.length
            )

            let filename = srcSuffix.substring(
              srcSuffix.lastIndexOf('/'),
              srcSuffix.length
            )

            const childFolder = srcSuffix.split('pages')[0]
            const pagesRegx = /\.(html|ts|vue)/g
            if (pagesRegx.test(filename)) {
              filename = toCamelCase(filename.replace(pagesRegx, ''), {
                capitalize: true,
              })
            }
            return `js${sep}${folder}${childFolder}${filename}.js`
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
        assetFileNames: `[ext]${sep}[name]-[hash].[ext]`,
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
