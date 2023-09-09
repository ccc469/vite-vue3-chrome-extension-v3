import browser from 'webextension-polyfill'

import BackgroundEventsListeners from './EventsListeners'
browser.commands.onCommand.addListener(BackgroundEventsListeners.onCommand)
BackgroundEventsListeners.initMessageListener()
