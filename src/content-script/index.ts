import browser from 'webextension-polyfill'

import CaptureUtil from '~/utils/CaptureUtil'
import {
  OPEN_ELEMENT_SELECTOR,
  RecordState,
  START_SCREENSHOT,
} from '~/utils/GlobalConstants'
import { MessageTypes, sendMessage } from '~/utils/MessageListener'

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
;(async () => {
  browser.storage.local.get(RecordState).then((result) => {
    if (result.RecordState) {
      sendMessage(
        MessageTypes.BACKGROUND.OPEN_ELEMENT_SELECTOR,
        true,
        MessageTypes.BACKGROUND.PREFIX
      )
    }
  })
})()
