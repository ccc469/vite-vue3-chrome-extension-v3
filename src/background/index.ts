import browser from 'webextension-polyfill'
import BackgroundEventsListeners from './backgroundEventsListeners'

browser.commands.onCommand.addListener(BackgroundEventsListeners.onCommand)
