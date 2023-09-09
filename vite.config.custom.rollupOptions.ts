import { sep } from 'path'

import { toCamelCase } from './src/utils/Helper'
import { clearContentScriptFilesPlugin } from './vite.config.custom.plugins'

/**
 * development、production
 */

const customChunkFileNames = (chunkInfo) => {
  const facadeModuleId = chunkInfo.facadeModuleId
    ? chunkInfo.facadeModuleId.split(sep)
    : []

  const folder = facadeModuleId[facadeModuleId.length - 2] || '[name]'
  let filename = chunkInfo.facadeModuleId == null ? '[name]-bundle' : '[name]'

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
}

const customEntryFileNames = (chunkInfo) => {
  const facadeModuleId = chunkInfo.facadeModuleId
    ? chunkInfo.facadeModuleId.split(sep)
    : []

  let folder = facadeModuleId[facadeModuleId.length - 2] || '[name]'
  let filename = chunkInfo.facadeModuleId == null ? '[name]-bundle' : '[name]'

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
}

const customAssetFileNames = (chunkInfo) => {
  let filename = `${chunkInfo.name}`
  if (chunkInfo.name === 'logo.png') {
    return `src${sep}assets${sep}${filename}`
  } else if (chunkInfo.name === 'content-script-loader.index.js') {
    filename = 'content-loader.js'
    return `js${sep}content-script${sep}${filename}`
  }

  return `[ext]${sep}[name]-[hash].[ext]`
}

const customManualChunks = (id) => {
  if (id.indexOf('node_modules') > -1) {
    return 'vendor'
  } else if (id.indexOf(`src${sep}utils`) > -1) {
    return 'utils'
  }
}

export function developmentRollupOptions() {
  return {
    input: {
      record: 'src/content-script/record/index.html',
    },
  }
}

export function productionRollupOptions() {
  return {
    plugins: [clearContentScriptFilesPlugin()],
    input: {
      record: 'src/content-script/record/index.html',
    },
    output: {
      manualChunks: customManualChunks,
      entryFileNames: customEntryFileNames,
      chunkFileNames: customChunkFileNames,
      assetFileNames: customAssetFileNames,
    },
  }
}
