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
        data: {},
        type: OPEN_ELEMENT_SELECTOR,
        tab: activeTab.id,
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

export async function openElementSelectorWithTabId(tabId: number) {
  chrome.tabs.get(tabId, async (tab) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
      return
    }

    await browser.scripting.executeScript({
      target: {
        allFrames: true,
        tabId: tab.id!,
      },
      files: ['scripts/elementSelector/index.js'],
    })
  })
}
