function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement('textarea')
  textArea.value = text

  // Avoid scrolling to bottom
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }

  document.body.removeChild(textArea)
}
export function copyTextToClipboard(text: string) {
  return new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text)
      resolve(true)
      return
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function sleep(timeout = 500) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

/**
 * 将字符串转换为驼峰式。
 *
 * @param {string} value - 需要转换的字符串。
 * @param {Object} options - 可选的配置对象。
 * @param {boolean} options.capitalize - 如果为true，首字母将被大写。
 * @param {boolean} options.addHyphen - 如果为true，驼峰式的位置会转换为带“-”的形式。
 * @returns {string} 转换后的字符串。
 */
export function toCamelCase(
  value: string,
  { capitalize = false, addHyphen = false } = {}
) {
  const result = value
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 && !capitalize
        ? letter.toLowerCase()
        : letter.toUpperCase()
    })
    .replace(/\s+|[-]/g, '')

  return addHyphen ? result.replace(/[A-Z]/g, '-$&').toLowerCase() : result
}

export function getUUID(withHyphens: boolean = true): string {
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  if (!withHyphens) {
    uuid = uuid.replace(/-/g, '')
  }

  return uuid.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getDomainFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname
  } catch (error) {
    return null
  }
}
