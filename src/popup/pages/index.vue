<template>
  <div class="flex justify-between space-x-4">
    <!-- Button -->
    <template v-for="button in buttons">
      <template v-if="!button.route">
        <button
          :key="button.label"
          :class="buttonClass"
          @click="button.handleClick"
        >
          {{ button.label }}
        </button>
      </template>
      <template v-else>
        <RouterLink
          :key="button.label"
          :to="button.route"
        >
          <button
            :key="button.label"
            :class="buttonClass"
          >
            {{ button.label }}
          </button>
        </RouterLink>
      </template>
    </template>

    <!-- Toggle -->
    <label
      class="relative inline-flex items-center cursor-pointer min-w-full py-2 px-4 flex-grow w-auto whitespace-nowrap"
    >
      <input
        v-model="checked"
        type="checkbox"
        value=""
        class="sr-only peer"
        @change="toggleSettingRecord"
      />
      <div
        class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:relative after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 flex items-center"
      ></div>
      <span class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {{ checkedText }}
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import browser from 'webextension-polyfill'
import {
  POPUP_OPEN_ELEMENT_SELECTOR,
  RecordState,
} from '~/utils/GlobalConstants'

const buttonClass = 'py-2 px-4 flex-grow underline w-auto whitespace-nowrap'

const openOptionsPage = async () => await browser.runtime.openOptionsPage()
const sendNotify = async () => {
  await browser.notifications.create('menus', {
    type: 'basic',
    title: '测试标题',
    message: '脚本执行完成啦',
    iconUrl: 'src/assets/logo.png',
  })
}

const startCodeGenerate = async () => {
  const newUrl = await browser.runtime.getURL(
    'src/content-script/record/index.html'
  )

  const tabs = await chrome.tabs.query({ url: `${newUrl}*` })
  if (tabs && tabs.length > 0) {
    return
  }

  const screenWidth = window.screen.availWidth
  const screenHeight = window.screen.availHeight
  const width = Math.round(screenWidth * 0.8)
  const height = Math.round(screenHeight * 0.8)
  const left = (screenWidth - width) / 2
  const top = (screenHeight - height) / 2

  const newWindow = await browser.windows.create({
    left: Math.round(left),
    top: Math.round(top),
    width: width,
    height: height,
    url: newUrl,
    type: 'popup',
    focused: true,
  })

  chrome.storage.local.set({
    RecordState: { windowId: newWindow.id, tabId: tabId },
  })

  await browser.action.setBadgeText({ text: ' 1 ' })
  await browser.action.setBadgeBackgroundColor({ color: '#E9AB17' })
}

const openDashboard = async () => {
  const newUrl = await browser.runtime.getURL('src/newtab/index.html')
  const screenWidth = window.screen.availWidth
  const screenHeight = window.screen.availHeight
  const width = Math.round(screenWidth * 0.8)
  const height = Math.round(screenHeight * 0.8)
  const left = (screenWidth - width) / 2
  const top = (screenHeight - height) / 2

  await browser.windows.create({
    left: Math.round(left),
    top: Math.round(top),
    width: width,
    height: height,
    url: newUrl,
    type: 'popup',
    focused: true,
  })
}

const buttons = ref([
  { label: 'Dashboard', handleClick: openDashboard },
  { label: '设置', handleClick: openOptionsPage },
  { label: '通知', handleClick: sendNotify },
  { label: '关于', route: '/about' },
])

let tabId: number
const checked = ref(false)
const checkedText = ref('开始录制')
const toggleSettingRecord = async () => {
  checkedText.value = '录制中'

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0]
    if (tab && tab.id) {
      tabId = tab.id
      chrome.tabs.sendMessage(tab.id, {
        type: POPUP_OPEN_ELEMENT_SELECTOR,
        data: tab.id,
        tab: tab.id,
      })
    }
  })

  startCodeGenerate()
}

onBeforeMount(() => {
  chrome.storage.local.get(RecordState, (result) => {
    if (result && result.RecordState) {
      checked.value = true
      if (checked.value) checkedText.value = '录制中'
    }
  })
})
</script>
