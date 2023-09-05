<template>
  <SharedCodemirror
    :model-value="codeValue"
    :class="editorClass"
    class="rounded-t-none"
    lang="javascript"
  ></SharedCodemirror>
</template>

<script setup lang="ts">
import { MessageListener, MessageTypes } from '~/utils/MessageListener'

defineProps({
  log: {
    type: Object,
    default: () => ({}),
  },
  editorClass: {
    type: String,
    default: '',
  },
})

const codeValue = computed(() => {
  return `(async ()=>{
   console.log(122);
})
`
})

let message: MessageListener
onMounted(() => {
  message = new MessageListener(MessageTypes.CODEGEN.PREFIX)
  message.on(MessageTypes.CODEGEN.CHANGE_CODE, (data) => {
    console.log('🚀 ~ file: index.vue:36 ~ message.on ~ data:', data)
  })
  chrome.runtime.onMessage.addListener(message.listener())
})
</script>
~/utils/MessageTypes
