import browser from 'webextension-polyfill'
import {
  initElementSelector,
  openElementSelectorWithTabId,
} from '~/background/ElementSelector'
import { getActiveTab } from '~/utils/BrowserHelper'
import {
  RecordData,
  RecordDataType,
  RecordState,
  SetBadgeType,
} from '~/utils/GlobalConstants'
import { getDomainProtocolFromUrl } from '~/utils/Helper'
import { MessageListener, MessageTypes } from '~/utils/MessageListener'
import { startScreenshot } from './Screenshot'

class EventsListeners {
  static async onCommand(command: string) {
    if (command === 'elementSelector') {
      await initElementSelector()
    } else if (command === 'screenshot') {
      await startScreenshot()
    }
  }

  static async initMessageListener() {
    const message = new MessageListener(MessageTypes.BACKGROUND.PREFIX)
    browser.runtime.onMessage.addListener(message.listener())

    message.on(MessageTypes.BACKGROUND.OPEN_ELEMENT_SELECTOR, (data) => {
      if (data) {
        openElementSelectorWithTabId(data as number)
      }
      return Promise.resolve(null)
    })

    message.on(MessageTypes.BACKGROUND.GET_CURRENT_DOMAIN, async () => {
      const activeTab: browser.Tabs.Tab | null = await getActiveTab()

      if (
        activeTab &&
        activeTab.id !== undefined &&
        activeTab.windowId !== undefined
      ) {
        return Promise.resolve({
          domain: getDomainProtocolFromUrl(activeTab.url!),
          url: activeTab.url,
        })
      }
    })

    message.on(MessageTypes.BACKGROUND.SET_BADGE, (data) => {
      if (data) {
        const { text, textColor, backgroundColor } = data as SetBadgeType
        browser.action.setBadgeText({ text: text })
        browser.action.setBadgeTextColor({ color: textColor })
        browser.action.setBadgeBackgroundColor({ color: backgroundColor })
      }
    })

    message.on(MessageTypes.BACKGROUND.GET_CURRENT_TAB, async () => {
      const activeTab: browser.Tabs.Tab | null = await getActiveTab()

      if (
        activeTab &&
        activeTab.id !== undefined &&
        activeTab.windowId !== undefined
      ) {
        return Promise.resolve(activeTab.id)
      }
    })

    message.on(
      MessageTypes.BACKGROUND.AUTO_OPEN_ELEMENT_IN_CONTENT,
      async () => {
        const activeTab: browser.Tabs.Tab | null = await getActiveTab()

        if (
          activeTab &&
          activeTab.id !== undefined &&
          activeTab.windowId !== undefined
        ) {
          openElementSelectorWithTabId(activeTab.id)
        }
      }
    )

    // End...
    console.log(
      '🚀 ~ file: EventsListeners.ts:82 ~ EventsListeners ~ initMessageListener:',
      'finished'
    )
  }

  static async onWindow(removedWindowId: number) {
    console.log(
      '🚀 ~ file: EventsListeners.ts:50 ~ EventsListeners ~ removedWindowId:',
      removedWindowId
    )

    chrome.storage.local.get(RecordState).then(async (result) => {
      if (result && result.RecordState) {
        const { tabId, recordId } = result.RecordState
        console.log(
          '🚀 ~ file: EventsListeners.ts:63 ~ EventsListeners ~ chrome.storage.local.get ~ RecordState:',
          result.RecordState
        )

        chrome.action.setBadgeText({ text: '' })
        chrome.action.setBadgeBackgroundColor({ color: '' })

        chrome.storage.local.get(RecordData).then((result) => {
          const records = (result.RecordData || []) as RecordDataType[]
          const current = records.filter((item) => item && item.id === recordId)
          const others = records.filter((item) => item && item.id !== recordId)
          current
            .filter((item) => item && item.id === recordId)
            .forEach((item) => {
              item.status = 1
            })

          chrome.storage.local.set({ RecordData: [...others, ...current] })
        })
        chrome.storage.local.remove(RecordState)
        chrome.tabs.reload(tabId)

        chrome.tabs
          .query({ url: `${chrome.runtime.getURL('src/options/index.html')}*` })
          .then((tabs) => {
            if (tabs && tabs.length) {
              chrome.tabs.reload(tabs[0].id!)
            }
          })
      }
    })
  }
}

export default EventsListeners
