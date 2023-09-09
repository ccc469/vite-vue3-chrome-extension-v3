export type EventType =
  | 'click'
  | 'input'
  | 'mousemove'
  | 'keydown'
  | 'focus'
  | 'blur'
  | 'change'
type HandlerObject = {
  selector: string
  callback: (event: Event, eventType: EventType) => void
}

function debounce(
  func: (event: Event, eventType: EventType) => void,
  wait: number
): (event: Event, eventType: EventType) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (event: Event, eventType: EventType) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(event, eventType)
    }, wait)
  }
}

class UniversalEventDelegator {
  private handlers: { [key in EventType]?: HandlerObject[] }
  private targetDocument: Document

  constructor(
    targetDocument: Document,
    customEventTypes: EventType[] = [
      'click',
      'input',
      'mousemove',
      'keydown',
      'focus',
      'blur',
      'change',
    ]
  ) {
    this.handlers = {}
    this.targetDocument = targetDocument
    this.init(customEventTypes)
  }

  private init(eventTypes: EventType[]): void {
    for (const eventType of eventTypes) {
      this.handlers[eventType] = []
      this.attachListener(eventType)
    }
  }

  private attachListener(eventType: EventType): void {
    this.targetDocument.addEventListener(eventType, (event) => {
      const target = event.target as Element
      this.handlers[eventType]?.forEach(({ selector, callback }) => {
        if (!selector || target.matches(selector)) {
          callback(event, eventType)
        }
      })
    })
  }

  public delegate(
    eventType: EventType,
    callback: (event: Event, eventType: EventType) => void,
    selector: string = '*'
  ): void {
    const handlerObj: HandlerObject = { selector, callback }
    if (this.handlers[eventType]) {
      this.handlers[eventType]?.push(handlerObj)
    } else {
      this.handlers[eventType] = [handlerObj]
      this.attachListener(eventType)
    }
  }

  public delegateWithDebounce(
    eventType: EventType,
    callback: (event: Event, eventType: EventType) => void,
    debounceTime: number = 500
  ): void {
    const debouncedCallback = debounce(callback, debounceTime)

    this.delegate(eventType, (event, eventType) => {
      debouncedCallback(event, eventType)
    })
  }
}

export default UniversalEventDelegator
