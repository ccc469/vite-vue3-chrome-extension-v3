import CaptureUtil from '~/utils/CaptureUtil'
import { Open_Element_Selector, Start_Screenshot } from '~/utils/MessageKeys'

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  const { type, data } = message
  if (type === Open_Element_Selector) {
    sendResponse(false)
  } else if (type === Start_Screenshot) {
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
