class BackgroundEventsListeners {
  static async onCommand(command: string) {
    if (command === 'element-selector') {
      console.log(
        '🚀 ~ file: backgroundEventsListeners.ts:4 ~ BackgroundEventsListeners ~ onCommand ~ command:',
        command
      )
    }
  }
}
export default BackgroundEventsListeners
