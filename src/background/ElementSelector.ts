import browser from 'webextension-polyfill'

import { OPEN_ELEMENT_SELECTOR } from '~/utils/GlobalConstants'
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
        type: OPEN_ELEMENT_SELECTOR,
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
        }
      }
    )
  } else {
    console.error('No active tab found.')
  }
}
