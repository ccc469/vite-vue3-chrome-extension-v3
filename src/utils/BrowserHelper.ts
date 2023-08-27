import browser from 'webextension-polyfill'

export async function getActiveTab() {
  try {
    let windowId = null
    const tabsQuery: {
      active: boolean
      url: string
      windowId?: number
      lastFocusedWindow?: boolean
    } = {
      active: true,
      url: '*://*/*',
    }

    const extURL = browser.runtime.getURL('')
    const windows = await browser.windows.getAll({ populate: true })
    for (const browserWindow of windows) {
      if (browserWindow.tabs && browserWindow.tabs.length === 1) {
        const [tab] = browserWindow.tabs
        const isDashboard = tab.url?.includes(extURL)
        if (isDashboard) {
          if (typeof browserWindow.id === 'number') {
            await browser.windows.update(browserWindow.id, {
              focused: false,
              state: 'minimized',
            })
          }
        } else if (browserWindow.focused) {
          windowId = browserWindow.id
        }
      }
    }

    if (windowId) tabsQuery.windowId = windowId
    else if (windows.length > 2) tabsQuery.lastFocusedWindow = true
    const [tab] = await browser.tabs.query(tabsQuery)
    return tab
  } catch (error) {
    console.error(error)
    return null
  }
}
