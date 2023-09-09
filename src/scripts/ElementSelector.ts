import { throttle } from 'throttle-debounce'

import { finder } from '@medv/finder'
import { OPEN_ELEMENT_SELECTOR } from '~/utils/GlobalConstants'
import { MessageTypes, sendMessage } from '~/utils/MessageListener'
import UniversalEventDelegator from '~/utils/UniversalEventDelegator'

export const Element_Selector_ID = OPEN_ELEMENT_SELECTOR

// Default: 2147483647
const getMaxZIndex = () => {
  const testDiv = document.createElement('div')
  testDiv.style.position = 'absolute'
  testDiv.style.zIndex = '9999999999999999'
  document.body.appendChild(testDiv)
  const computedZIndex = parseInt(window.getComputedStyle(testDiv).zIndex, 10)
  document.body.removeChild(testDiv)
  return computedZIndex
}

const maxZIndex = getMaxZIndex()
const initTooltip = () => {
  const tooltip = document.createElement('div')
  tooltip.id = Element_Selector_ID
  tooltip.style.cssText = `
position: absolute;
background: white;
padding: 5px 20px;
display: none;
font-weight: bold;
line-height: 1.6;
color: #954535;
font-size: 18px;
background-color: #D1D0CE;
z-index: ${maxZIndex};
`
  document.body.appendChild(tooltip)
  return tooltip
}

export function hasInstance(): boolean {
  const rootElementExist = document.querySelector(
    `#${OPEN_ELEMENT_SELECTOR}`
  ) as HTMLDivElement

  if (rootElementExist) {
    rootElementExist.style.display = 'block'
    return true
  }

  return false
}

let currentSelectElement: HTMLElement | null = null
let delegator: UniversalEventDelegator | null = null
let fillValue: unknown | null = null

const _handleClick = () => {
  if (!currentSelectElement) {
    return
  }

  sendMessage(
    MessageTypes.RECORD.CHANGE_CODE,
    `
    // Click "${finder(currentSelectElement)}"
    document.querySelector('${finder(currentSelectElement)}').click();`,
    MessageTypes.RECORD.PREFIX
  )
}

const _handleChange = () => {
  if (!currentSelectElement) {
    return
  }

  const inputEl = currentSelectElement as HTMLInputElement
  if (inputEl.value === undefined) {
    return
  }

  if (`${fillValue}` === `${inputEl.value}`) {
    return
  }

  fillValue = `${inputEl.value}`
  if (isNaN(Number(fillValue))) {
    fillValue = `'${inputEl.value}'`
  }

  if (`${fillValue}`.length == 0) {
    return
  }

  sendMessage(
    MessageTypes.RECORD.CHANGE_CODE,
    `
    // Fill "${finder(currentSelectElement)}"
    document.querySelector('${finder(
      currentSelectElement
    )}').fill(${fillValue});`,
    MessageTypes.RECORD.PREFIX
  )
}

;(async () => {
  try {
    const isMainFrame = window.self === window.top
    if (hasInstance() || !isMainFrame) {
      return
    }

    const isAppExists = hasInstance()
    if (isAppExists) return

    const tooltip = initTooltip()
    const showTooltip = throttle(50, (event) => {
      const element = event.target as HTMLElement
      if (currentSelectElement) {
        if (finder(currentSelectElement) === finder(element)) {
          return
        }

        currentSelectElement.style.outline = ''
      }

      element.style.outline = '2px solid red'
      currentSelectElement = element

      // 计算偏移量
      const rect = element.getBoundingClientRect()
      const { scrollX, scrollY } = window
      let top: number
      const left: number = rect.left + scrollX - 2
      const limit = 46
      if (rect.top < limit) {
        top = rect.bottom + scrollY + 10
      } else {
        top = rect.top + scrollY - limit
      }
      tooltip.style.top = `${top}px`
      tooltip.style.left = `${left}px`
      tooltip.innerHTML = `${finder(element)}`
      tooltip.style.display = 'block'
    })

    const closeTooltip = throttle(50, (event) => {
      const element = event.target as HTMLElement
      element.style.outline = ''
      tooltip.style.display = 'none'
    })

    window.addEventListener('mousemove', showTooltip)
    window.addEventListener('mouseout', closeTooltip)

    delegator = new UniversalEventDelegator(document)
    delegator.delegate('click', _handleClick)
    delegator.delegateWithDebounce('keydown', _handleChange)

    chrome.storage.local.set({ InjectElementSelector: true })
  } catch (error) {
    console.error(error)
  }
})()
