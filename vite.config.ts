import {
  join,
  resolve,
} from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';

import { crx } from '@crxjs/vite-plugin';
import vue from '@vitejs/plugin-vue';

import developmentManifest from './manifest.config.development';
import productionManifest from './manifest.config.production';
import { assetsRewritePlugin } from './vite.config.custom.plugins';
import {
  developmentRollupOptions,
  productionRollupOptions,
} from './vite.config.custom.rollupOptions';

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
    crx({
      manifest:
        process.env.NODE_ENV === 'development'
          ? developmentManifest
          : productionManifest,
    }),
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
          dir: 'src/content-script/record/pages',
          baseRoute: 'record',
        },
        {
          dir: 'src/content-script/pages',
          baseRoute: 'control',
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
    assetsRewritePlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions:
      process.env.NODE_ENV === 'development'
        ? developmentRollupOptions()
        : productionRollupOptions(),
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
