import browser from 'webextension-polyfill'
import {
  Global_Element_Selector_ID,
  hasInstance,
} from '~/utils/ElementSelector'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
browser.runtime.onMessage.addListener((message: any): Promise<any> => {
  if (message.type === Global_Element_Selector_ID) {
    return Promise.resolve(hasInstance())
  }
  return Promise.resolve(null)
})
;(async () => {})()
