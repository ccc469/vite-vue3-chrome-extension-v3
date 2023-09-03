import fs from 'fs'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'

export const file = (...args: string[]) => resolve(__dirname, '.', ...args)
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${file('src')}/`,
    },
  },
  plugins: [Vue(), updateManifest()],
  build: {
    outDir: 'dist/scripts',
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        elementSelector: 'src/scripts/ElementSelector.ts',
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name]/index.js',
        chunkFileNames: '[name].js',
        extend: true,
        format: 'iife',
      },
    },
  },
})

function updateManifest() {
  return {
    name: 'update-manifest',
    writeBundle() {
      const manifestPath = path.resolve(__dirname, 'dist/manifest.json')
      if (fs.existsSync(manifestPath)) {
        const manifestJSON = fs.readFileSync(manifestPath, 'utf8')
        const manifest = JSON.parse(manifestJSON)

        // 修改 web_accessible_resources 字段
        manifest.web_accessible_resources.push({
          matches: ['*://*/*'],
          resources: ['scripts/elementSelector/index.js'],
          use_dynamic_url: true,
        })

        fs.writeFileSync(
          manifestPath,
          JSON.stringify(manifest, null, 2),
          'utf8'
        )
        console.log('Manifest updated.')
      }
    },
  }
}
