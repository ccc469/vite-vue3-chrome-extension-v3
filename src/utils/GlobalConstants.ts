// Commands
export const OPEN_ELEMENT_SELECTOR = 'open-element-selector'
export const START_SCREENSHOT = 'screenshot'
export const POPUP_OPEN_ELEMENT_SELECTOR = 'popup-open-element-selector'

// Storage
export const RecordData = 'RecordData'
export const RecordState = 'RecordState'

export type RecordDataType = {
  id: string
  time: string
  code: string
  domain: string
  status: number
  startUrl: string
}

export type GetDomainType = {
  domain: string
  url: string
}

export type ExecuteScriptType = {
  tab: number
  code: string
}

type ColorArray = [number, number, number, number]
type ColorValue = string | ColorArray | null

export type SetBadgeType = {
  text: string
  textColor: ColorValue
  backgroundColor: ColorValue
}
