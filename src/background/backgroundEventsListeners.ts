import { initElementSelector } from '~/utils/ElementSelector';

class BackgroundEventsListeners {
  static async onCommand(command: string) {
    if (command === 'element-selector') {
      initElementSelector()
    }
  }
}
export default BackgroundEventsListeners
