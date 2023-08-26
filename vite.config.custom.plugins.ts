import { rm, stat } from 'fs/promises'

import globPkg from 'glob'
import { dirname, relative, resolve } from 'path'
const { glob } = globPkg

// 清除content-script目录下多余文件
export function clearContentScriptFilesPlugin() {
  return {
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
            if (fileName !== undefined && excludedFiles.includes(fileName)) {
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
