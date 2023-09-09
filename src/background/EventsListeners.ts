import browser from 'webextension-polyfill'
import { initElementSelector } from '~/background/ElementSelector'
import { getActiveTab } from '~/utils/BrowserHelper'
import { getDomainFromUrl } from '~/utils/Helper'
import { MessageListener, MessageTypes } from '~/utils/MessageListener'
import { startScreenshot } from './Screenshot'

class EventsListeners {
  static async onCommand(command: string) {
    console.log(
      '🚀 ~ file: backgroundEventsListeners.ts:8 ~ BackgroundEventsListeners ~ onCommand ~ command:',
      command
    )

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
      if (data) initElementSelector()
      return Promise.resolve(null)
    })

    message.on(MessageTypes.BACKGROUND.GET_CURRENT_DOMAIN, async () => {
      const activeTab: browser.Tabs.Tab | null = await getActiveTab()

      if (
        activeTab &&
        activeTab.id !== undefined &&
        activeTab.windowId !== undefined
      ) {
        return Promise.resolve(getDomainFromUrl(activeTab.url!))
      }
    })
  }
}

export default EventsListeners
