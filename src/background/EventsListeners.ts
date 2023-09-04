import { initElementSelector } from '~/background/ElementSelector'
import { startScreenshot } from './Screenshot'

class EventsListeners {
  static async onCommand(command: string) {
    console.log(
      '🚀 ~ file: backgroundEventsListeners.ts:8 ~ BackgroundEventsListeners ~ onCommand ~ command:',
      command
    )

    if (command === 'elementSelector') {
      initElementSelector()
    } else if (command === 'screenshot') {
      startScreenshot()
    }
  }
}

export default EventsListeners
