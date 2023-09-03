<template>
  <div class="flex justify-between space-x-4">
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
  </div>
</template>

<script setup lang="ts">
import browser from 'webextension-polyfill';

const buttonClass = 'py-2 px-4 flex-grow underline w-auto whitespace-nowrap'

const openOptionsPage = async () => await browser.runtime.openOptionsPage()
const sendNotify = async () => {
  // export type TemplateType = "basic" | "image" | "list" | "progress";
  await browser.notifications.create('menus', {
    type: 'progress',
    title: '测试标题',
    message: `测试内容`,
    iconUrl: '../assets/logo.png',
  })
}

const startCodeGenerate = async () => {
  const newUrl = await browser.runtime.getURL(
    'src/content-script/iframe/index.html'
  )
  // type CreateType = "normal" | "popup" | "panel";
  await browser.windows.create({
    top: 0,
    left: 0,
    width: 715,
    height: 715,
    url: newUrl,
    type: 'popup',
    focused: false,
  })
}

const buttons = ref([
  { label: '设置', handleClick: openOptionsPage },
  { label: '脚本录制', handleClick: startCodeGenerate },
  { label: '通知', handleClick: sendNotify },
  { label: '关于', route: '/about' },
])
</script>
