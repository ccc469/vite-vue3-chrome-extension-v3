import { finder } from '@medv/finder'
import { throttle } from 'throttle-debounce'
import { copyTextToClipboard } from '~/lib/utils/helper'
import './index.scss'

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
  window.addEventListener('mouseover', function (event) {
    const element = event.target as HTMLElement
    showTooltip(element)
  })

  window.addEventListener('mouseout', function (event) {
    const element = event.target as HTMLElement
    element.style.outline = 'none'
  })

  window.addEventListener('click', async function (event) {
    const element = event.target as HTMLElement
    const selector = `document.querySelector('${finder(element)}')`
    copyTextToClipboard(selector)
  })
})()
