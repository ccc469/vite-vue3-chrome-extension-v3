import browser from 'webextension-polyfill'

type Message = {
  name: string
  data: unknown
}

type Sender = unknown

type Listener = (data: unknown, sender: Sender) => unknown | Promise<unknown>

const nameBuilder = (prefix: string, name: string): string =>
  prefix ? `${prefix}--${name}` : name

export class MessageListener {
  private listeners: Record<string, Listener> = {}
  private prefix: string

  constructor(prefix = '') {
    this.prefix = prefix
  }

  public on(name: string, listener: Listener): this {
    if (Object.prototype.hasOwnProperty.call(this.listeners, name)) {
      console.error(`You already added ${name}`)
      return this
    }

    this.listeners[nameBuilder(this.prefix, name)] = listener
    return this
  }

  public listener(): (message: Message, sender: Sender) => Promise<unknown> {
    return this.listen.bind(this)
  }

  private async listen(message: Message, sender: Sender): Promise<unknown> {
    try {
      const listener = this.listeners[message.name]

      if (!listener) return Promise.resolve()

      const response = await listener.call(
        { message, sender },
        message.data,
        sender
      )
      return Promise.resolve(response)
    } catch (err) {
      return Promise.reject(new Error(`Unhandled Background Error: ${err}`))
    }
  }
}

export async function sendMessage(
  prefix: string,
  name: string,
  data: unknown = {}
): Promise<unknown> {
  const payload: Message = {
    name: nameBuilder(prefix, name),
    data,
  }

  try {
    return await browser.runtime.sendMessage(payload)
  } catch (error) {
    console.error(`Failed to send message: ${error}`)
  }
}

export const MessageTypes = {
  RECORD: {
    PREFIX: 'record',
    CHANGE_CODE: 'change-code',
    GET_RECORD_ID: 'get-record-id',
  },
  BACKGROUND: {
    PREFIX: 'background',
    OPEN_ELEMENT_SELECTOR: 'open-element-selector',
    AUTO_OPEN_ELEMENT_IN_CONTENT: 'auto-open-element-selector',
    GET_CURRENT_DOMAIN: 'get-current-domain',
    GET_CURRENT_TAB: 'get-current-tab',
    SET_BADGE: 'set-badge',
    EXECUTE_SCRIPT: 'execute-script',
  },
}
