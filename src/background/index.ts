import browser from 'webextension-polyfill'

import { RecordState } from '~/utils/GlobalConstants'
import BackgroundEventsListeners from './EventsListeners'

// Event Listener
browser.commands.onCommand.addListener(BackgroundEventsListeners.onCommand)
browser.windows.onRemoved.addListener(BackgroundEventsListeners.onWindow)
BackgroundEventsListeners.initMessageListener()

// Storage
browser.storage.local.remove(RecordState)
