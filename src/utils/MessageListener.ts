import browser from 'webextension-polyfill'

// 定义消息的类型
type Message = {
  name: string
  data: any
}

// 定义发送者的类型
type Sender = {}

// 定义监听器的类型
type Listener = (data: any, sender: Sender) => any | Promise<any>

// 名称构建函数，用于生成消息名称
const nameBuilder = (prefix: string, name: string): string =>
  prefix ? `${prefix}--${name}` : name

// 消息监听器类
export class MessageListener {
  // 保存监听器函数的对象
  private listeners: Record<string, Listener>
  // 可选前缀，用于消息名称
  private prefix: string

  constructor(prefix = '') {
    this.listeners = {}
    this.prefix = prefix
  }

  // 添加消息监听器
  // 当消息名称与添加的监听器匹配时，该监听器会被触发
  public on(name: string, listener: Listener): this {
    // 检查是否已经添加了同名的监听器
    if (this.listeners.hasOwnProperty(name)) {
      console.error(`You already added ${name}`)
      return this
    }
    // 添加监听器
    this.listeners[nameBuilder(this.prefix, name)] = listener
    return this
  }

  // 获取监听函数，通常用于设置为浏览器消息监听函数
  public listener(): (message: Message, sender: Sender) => Promise<any> {
    return this.listen.bind(this)
  }

  // 内部的消息监听实现
  private async listen(message: Message, sender: Sender): Promise<any> {
    try {
      // 根据消息名称查找监听器
      const listener = this.listeners[message.name]

      // 如果没有匹配的监听器，返回resolved Promise
      if (!listener) return Promise.resolve()

      // 执行监听器并等待其完成
      const response = await listener.call(
        { message, sender },
        message.data,
        sender
      )
      return Promise.resolve(response)
    } catch (err) {
      // 处理任何未处理的错误
      return Promise.reject(new Error(`Unhandled Background Error: ${err}`))
    }
  }
}

// 发送消息的函数
export async function sendMessage(
  name = '',
  data = {},
  prefix = ''
): Promise<any> {
  // 构建消息对象
  let payload: Message = {
    name: nameBuilder(prefix, name),
    data,
  }

  // 发送消息
  try {
    return await browser.runtime.sendMessage(payload)
  } catch (error) {
    // 处理发送失败的情况
    console.error(`Failed to send message: ${error}`)
  }
}
