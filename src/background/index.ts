import browser from 'webextension-polyfill'

import BackgroundEventsListeners from './BackgroundEventsListeners'

browser.commands.onCommand.addListener(BackgroundEventsListeners.onCommand)

// const message = new MessageListener('background')
// message.on('hello', (data) => {
//   console.log('Received hello:', data)
//   return 'Hello to you too!'
// })
// browser.runtime.onMessage.addListener(message.listener())
