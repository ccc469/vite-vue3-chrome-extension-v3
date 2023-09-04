import browser from 'webextension-polyfill'

import CaptureUtil from '~/utils/CaptureUtil'
import { getDomainFromUrl, getUUID } from '~/utils/Helper'
import { Start_Screenshot } from '~/utils/MessageKeys'
import { getActiveTab } from '../utils/BrowserHelper'

export async function startScreenshot({
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
    const folder = getDomainFromUrl(activeTab.url!)
    const tabId = activeTab.id
    CaptureUtil.captureScreen()
      .then((dataUrl) => {
        chrome.tabs.sendMessage(
          tabId,
          {
            type: Start_Screenshot,
            data: dataUrl,
          },
          (response) => {
            chrome.downloads.download(
              {
                url: response,
                filename: `${folder}/${getUUID()}.png`,
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError)
                }
              }
            )
          }
        )
      })
      .catch((err) => {
        console.error('发生错误：', err)
      })
  } else {
    console.error('No active tab found.')
  }
}