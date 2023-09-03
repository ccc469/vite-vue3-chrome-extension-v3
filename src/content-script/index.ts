import browser from 'webextension-polyfill'
import { hasInstance, Open_Element_Selector } from '~/utils/ElementSelector'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
browser.runtime.onMessage.addListener((message: any): Promise<any> => {
  const instance = hasInstance()
  if (message.type === Open_Element_Selector) {
    return Promise.resolve(instance)
  }
  return Promise.resolve(null)
})
;(async () => {})()
