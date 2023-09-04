class CaptureUtil {
  static saveBlob(blob: Blob, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = function () {
        const base64data = reader.result as string
        chrome.downloads.download(
          {
            url: base64data,
            filename: filename,
          },
          () => {
            if (chrome.runtime.lastError) {
              return reject(chrome.runtime.lastError)
            }
            resolve()
          }
        )
      }
      reader.readAsDataURL(blob)
    })
  }

  static saveFile(dataUrl: string, filename: string): void {
    const url = URL.createObjectURL(this.dataUrlToBlob(dataUrl))
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }

  static dataUrlToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const byteCharacters = atob(parts[1])
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: contentType })
  }

  static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = function () {
        const dataUrl = reader.result as string
        resolve(dataUrl)
      }
      reader.onerror = function (error) {
        reject(error)
      }
      reader.readAsDataURL(blob)
    })
  }

  static captureScreen(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError)
        }

        const tab = tabs[0]
        if (tab && tab.id !== undefined) {
          chrome.tabs.update(tab.id, { active: true }, () => {
            if (chrome.runtime.lastError) {
              return reject(chrome.runtime.lastError)
            }

            chrome.tabs.captureVisibleTab(
              tab.windowId,
              { format: 'png' },
              (dataUrl) => {
                if (chrome.runtime.lastError) {
                  return reject(chrome.runtime.lastError)
                }
                resolve(dataUrl as string)
              }
            )
          })
        } else {
          reject(new Error('No active tab found.'))
        }
      })
    })
  }

  static addTimestampToDataUrl(
    dataUrl: string,
    currentUrl: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = dataUrl

      img.onload = () => {
        const dpr = window.devicePixelRatio || 1
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        canvas.width = img.width * dpr // 考虑设备像素比
        canvas.height = img.height * dpr

        if (ctx) {
          ctx.scale(dpr, dpr)
        }

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, img.width, img.height)

        // Add timestamp
        const timestamp = new Date().toLocaleString()
        ctx.font = '50px Arial'
        ctx.fillStyle = 'red'

        const textMetrics = ctx.measureText(timestamp)
        const textWidth = textMetrics ? textMetrics.width : 0

        // Position it to the bottom right corner
        ctx.fillText(timestamp, img.width - textWidth - 10, img.height - 10)

        // Add URL
        ctx.font = '30px Arial'
        ctx.fillStyle = 'blue'

        const urlMetrics = ctx.measureText(currentUrl)
        const urlWidth = urlMetrics ? urlMetrics.width : 0

        // 位置调整到时间戳上方
        ctx.fillText(currentUrl, img.width - urlWidth - 10, img.height - 60)

        // Convert canvas to DataURL
        const newDataUrl = canvas.toDataURL('image/png')
        resolve(newDataUrl)
      }

      img.onerror = (e) => {
        reject(e)
      }
    })
  }
}

export default CaptureUtil
