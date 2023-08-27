import browser from 'webextension-polyfill'
import { sendMessage } from '~/utils/MessageListener'

import { onMessage } from './HandlerMessage'

browser.runtime.onMessage.addListener(onMessage)
;(async () => {
  try {
    const response = await sendMessage(
      'hello',
      { text: 'Hi there!' },
      'background'
    )
    console.log('Received response:', response)
  } catch (error) {
    console.log('Failed to send message:', error)
  }
})()
