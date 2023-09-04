declare module '~/lib/query-selector-shadow-dom' {
  export function querySelectorDeep(selector: string): HTMLElement | null
  export function querySelectorAllDeep(selector: string): HTMLElement[]
  export function collectAllElementsDeep(
    selector: null,
    root: Document
  ): HTMLHtmlElement
}
