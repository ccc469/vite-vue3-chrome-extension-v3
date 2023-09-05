import CaptureUtil from '~/utils/CaptureUtil'
import { OPEN_ELEMENT_SELECTOR, START_SCREENSHOT } from '~/utils/CommandKeys'

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  const { type, data } = message
  if (type === OPEN_ELEMENT_SELECTOR) {
    sendResponse(false)
  } else if (type === START_SCREENSHOT) {
    CaptureUtil.addTimestampToDataUrl(data, window.location.href)
      .then((dataUrl) => {
        sendResponse(dataUrl)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  return true
})
;(async () => {})()
