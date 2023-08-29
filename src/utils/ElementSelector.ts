import browser from 'webextension-polyfill'

import { getActiveTab } from './BrowserHelper'

export const Global_Element_Selector_ID = 'open-element-selector'
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
      type: Global_Element_Selector_ID,
    })

    if (!result) {
      await browser.scripting.executeScript({
        target: {
          allFrames: true,
          tabId: activeTab.id,
        },
        files: [
          process.env.NODE_ENV === 'development'
            ? 'src/content-script/element-selector/index.ts'
            : 'js/content-script/element-selector/element-selector-bundle.js',
        ],
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
    Global_Element_Selector_ID
  ) as HTMLElement
  if (rootElementExist) {
    rootElementExist.style.display = 'block'
    return true
  }
  return false
}
