import browser from 'webextension-polyfill'

import { getActiveTab } from './BrowserHelper'

export const Open_Element_Selector = 'open-element-selector'
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
    const result = await browser.tabs.sendMessage(activeTab.id, {
      type: Open_Element_Selector,
    })

    if (!result) {
      await browser.scripting.executeScript({
        target: {
          allFrames: true,
          tabId: activeTab.id,
        },
        files: ['scripts/elementSelector/index.js'],
      })
    }

    await browser.tabs.update(activeTab.id, { active: true })
    await browser.windows.update(activeTab.windowId, { focused: true })
  } else {
    console.error('No active tab found.')
  }
}

export function hasInstance() {
  const rootElementExist = document.querySelector(
    `#${Open_Element_Selector}`
  ) as HTMLElement
  if (rootElementExist) {
    rootElementExist.style.display = 'block'
    return true
  }
  return false
}
