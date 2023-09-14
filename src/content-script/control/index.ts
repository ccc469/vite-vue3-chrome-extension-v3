import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'

export default function (rootElement: HTMLElement) {
  const appRoot = document.createElement('div')
  appRoot.setAttribute('id', 'app')
  rootElement.shadowRoot?.appendChild(appRoot)
  createApp(App).mount(appRoot)
}
