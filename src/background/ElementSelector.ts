import browser from 'webextension-polyfill'

import { Open_Element_Selector } from '~/utils/MessageKeys'
import { getActiveTab } from '../utils/BrowserHelper'

export async function initElementSelector({
  tab = null,
}: { tab?: browser.Tabs.Tab | null } = {}) {
  let activeTab: browser.Tabs.Tab | null = tab

  if (!tab) {
    activeTab = await getActiveTab()
  }

  if (
    activeTab &&
    activeTab.id !== undefined &&
    activeTab.windowId !== undefined
  ) {
    const activeTabId = activeTab.id
    chrome.tabs.sendMessage(
      activeTabId,
      {
        type: Open_Element_Selector,
      },
      async (response) => {
        if (!response) {
          await browser.scripting.executeScript({
            target: {
              allFrames: true,
              tabId: activeTabId,
            },
            files: ['scripts/elementSelector/index.js'],
          })
          await browser.tabs.update(activeTabId, { active: true })
          await browser.windows.update(activeTabId, { focused: true })
        }
      }
    )
  } else {
    console.error('No active tab found.')
  }
}
