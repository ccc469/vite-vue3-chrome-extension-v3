import { throttle } from 'throttle-debounce'

import { finder } from '@medv/finder'
import { isClickable } from '~/utils/Helper'
import { Open_Element_Selector } from '~/utils/MessageKeys'

export const Element_Selector_ID = Open_Element_Selector

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

;(async () => {
  try {
    const isMainFrame = window.self === window.top
    if (isMainFrame) {
      const isAppExists = hasInstance()
      if (isAppExists) return

      const tooltip = initTooltip()
      let currentSelectElement: HTMLElement | null = null
      const showTooltip = throttle(100, (event) => {
        // 移除旧元素的 outline
        if (currentSelectElement) {
          currentSelectElement.style.outline = ''
        }

        const element = event.target as HTMLElement
        element.style.outline = '2px solid red'
        currentSelectElement = element
        const limit = 46
        const rect = element.getBoundingClientRect()
        if (rect.top < limit) {
          tooltip.style.top = rect.bottom + 10 + 'px'
        } else {
          tooltip.style.top = rect.top - limit + 'px'
        }

        tooltip.style.left = rect.left - 2 + 'px'
        tooltip.innerHTML = `${finder(element)}`
        tooltip.style.display = 'block'
      })

      const closeTooltip = throttle(100, (event) => {
        const element = event.target as HTMLElement
        element.style.outline = ''
        tooltip.style.display = 'none'
      })

      window.addEventListener('mousemove', showTooltip)
      window.addEventListener('mouseout', closeTooltip)
      window.addEventListener('click', () => {
        if (!currentSelectElement) {
          return
        }

        alert(isClickable(currentSelectElement))
      })
    }
  } catch (error) {
    console.error(error)
  }
})()

export function hasInstance(): boolean {
  const rootElementExist = document.querySelector(
    `#${Open_Element_Selector}`
  ) as HTMLDivElement

  if (rootElementExist) {
    rootElementExist.style.display = 'block'
    return true
  }

  return false
}
