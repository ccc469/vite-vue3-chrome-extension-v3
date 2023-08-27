import './index.scss'

import { throttle } from 'throttle-debounce'
import { hasInstance } from '~/utils/ElementSelector'

import { finder } from '@medv/finder'

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

const tooltip = initTooltip()

const showTooltip = throttle(200, (element) => {
  element.style.outline = '2px solid red'
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

;(async () => {
  try {
    const isMainFrame = window.self === window.top

    if (isMainFrame) {
      if (hasInstance()) return

      const rootElement = document.createElement('div')
      rootElement.setAttribute('id', 'element-selector-container')
      rootElement.classList.add()
      rootElement.attachShadow({ mode: 'open' })

      document.documentElement.appendChild(rootElement)
    } else {
      const style = document.createElement('style')
      style.textContent = '[automa-el-list] {outline: 2px dashed #6366f1;}'
      document.body.appendChild(style)
    }
  } catch (error) {
    console.error(error)
  }
})()
