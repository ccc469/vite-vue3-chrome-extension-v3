import browser from 'webextension-polyfill'

// 定义消息的类型
type Message = {
  name: string
  data: unknown // 使用 'unknown' 替代 'any'
}

// 定义发送者的类型
type Sender = unknown // 使用 'Record<string, unknown>' 表示一个空对象

// 定义监听器的类型
type Listener = (data: unknown, sender: Sender) => unknown | Promise<unknown> // 使用 'unknown' 替代 'any'

// 名称构建函数，用于生成消息名称
const nameBuilder = (prefix: string, name: string): string =>
  prefix ? `${prefix}--${name}` : name

// 消息监听器类
export class MessageListener {
  // 保存监听器函数的对象
  private listeners: Record<string, Listener> = {} // 初始化为空对象
  // 可选前缀，用于消息名称
  private prefix: string

  constructor(prefix = '') {
    this.prefix = prefix
  }

  // 添加消息监听器
  public on(name: string, listener: Listener): this {
    // 使用 Object.prototype.hasOwnProperty 的更安全的方式
    if (Object.prototype.hasOwnProperty.call(this.listeners, name)) {
      console.error(`You already added ${name}`)
      return this
    }

    // 添加监听器
    this.listeners[nameBuilder(this.prefix, name)] = listener
    return this
  }

  // 获取监听函数
  public listener(): (message: Message, sender: Sender) => Promise<unknown> {
    return this.listen.bind(this)
  }

  // 内部的消息监听实现
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

// 发送消息的函数
export async function sendMessage(
  name = '',
  data: unknown = {}, // 使用 'unknown' 替代 'any'
  prefix = ''
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
