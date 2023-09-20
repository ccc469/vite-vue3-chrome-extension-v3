import CaptureUtil from '~/utils/CaptureUtil'
import {
  OPEN_ELEMENT_SELECTOR,
  POPUP_OPEN_ELEMENT_SELECTOR,
  RecordState,
  START_SCREENSHOT,
} from '~/utils/GlobalConstants'
import { MessageTypes, sendMessage } from '~/utils/MessageListener'
import initControl from './control'

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  const { type, data, tab } = message
  console.log(
    '🚀 ~ file: index.ts:13 ~ chrome.runtime.onMessage.addListener ~ message:',
    type,
    data,
    tab
  )

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
  } else if (type === POPUP_OPEN_ELEMENT_SELECTOR) {
    setTimeout(() => {
      sendMessage(
        MessageTypes.BACKGROUND.PREFIX,
        MessageTypes.BACKGROUND.OPEN_ELEMENT_SELECTOR,
        data
      )
    }, 1000)
  }

  return true
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initApp = () => {
  const rootElement = document.createElement('div')
  rootElement.setAttribute('id', 'crx-app-container')
  const shadowDOM = rootElement.attachShadow({ mode: 'open' })

  const tailwindCss = chrome.runtime.getURL('src/assets/tailwind.css')
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', tailwindCss)

  const tailwindJs = chrome.runtime.getURL('src/assets/tailwind.js')
  const scriptEl = document.createElement('script')
  scriptEl.setAttribute('src', tailwindJs)
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(scriptEl)

  initControl(rootElement)
  document.documentElement.appendChild(rootElement)
}

const autoOpenElementSelector = async () => {
  const result = await chrome.storage.local.get(RecordState)
  if (result && result.RecordState) {
    sendMessage(
      MessageTypes.BACKGROUND.PREFIX,
      MessageTypes.BACKGROUND.AUTO_OPEN_ELEMENT_IN_CONTENT
    )
  }
}
const initSandbox = () => {
  const src = chrome.runtime.getURL('src/sandbox/index.html')
  const iframe = new DOMParser().parseFromString(
    `<iframe src="${src}" id="sandbox" style="display: none;"></iframe>`,
    'text/html'
  ).body.firstElementChild

  if (iframe) {
    document.body?.append(iframe)
  }
}
;(async () => {
  // initApp()
  initSandbox()
  autoOpenElementSelector()

  setTimeout(() => {
    const sandbox = document.getElementById('sandbox') as HTMLIFrameElement
    console.log('🚀 ~ file: index.ts:80 ~ setTimeout ~ sandbox:', sandbox)
  }, 5000)
})()
