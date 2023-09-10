import fg from 'fast-glob'
import { mkdir, stat, unlink, writeFile } from 'fs/promises'
import { dirname, join, relative, resolve, sep } from 'path'

// 清除contentScript目录下多余文件
export function clearContentScriptFilesPlugin() {
  return {
    name: 'delete-files-except-specified',
    async writeBundle() {
      const excludedFiles = ['index.html']

      try {
        const files = await fg(
          `dist${sep}src${sep}content-script${sep}**${sep}*`
        )

        await Promise.all(
          files.map(async (file) => {
            const filePath = resolve(file)
            const fileStats = await stat(filePath)
            const fileName = file.split(sep).pop()

            if (fileName !== undefined && excludedFiles.includes(fileName)) {
              return Promise.resolve()
            }

            if (!fileStats.isDirectory()) {
              return unlink(filePath)
            }
          })
        )

        console.log('Specified files deleted')
      } catch (err) {
        console.error('Failed to delete files:', err)
      }
    },
  }
}

// rewrite assets to use relative path
export function assetsRewritePlugin() {
  return {
    name: 'assets-rewrite',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, { path }) {
      return html.replace(
        /"\/assets\//g,
        `"${relative(dirname(path), '/assets')}/`
      )
    },
  }
}

export async function createEmptyElementSelectorFile() {
  return {
    name: 'create-empty-file', // 插件名称
    async buildStart() {
      const directoryPath = 'dist/scripts/elementSelector'
      const filePath = join(directoryPath, 'index.js')

      // 使用 fast-glob 检查目录是否存在
      const existingDirs = await fg(directoryPath)

      // 如果目录不存在，创建它
      if (existingDirs.length === 0) {
        await mkdir(directoryPath, { recursive: true })
      }

      // 使用 fs/promises 创建一个空的 index.js 文件
      await writeFile(filePath, '', 'utf8')
    },
  }
}
