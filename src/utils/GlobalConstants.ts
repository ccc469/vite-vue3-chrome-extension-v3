// Commands
export const OPEN_ELEMENT_SELECTOR = 'open-element-selector'
export const START_SCREENSHOT = 'screenshot'

// Storage
export const RecordState = 'RecordState'
export const InjectElementSelector = 'InjectElementSelector'
export const RecordData = 'RecordData'

export type RecordDataType = {
  id: string
  time: string
  code: string
  domain: string
  status: number
}
