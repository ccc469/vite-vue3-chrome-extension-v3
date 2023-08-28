import fg from 'fast-glob'
import { stat, unlink } from 'fs/promises'
import { dirname, relative, resolve, sep } from 'path'

// 清除content-script目录下多余文件
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
