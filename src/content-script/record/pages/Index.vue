<template>
  <div class="relative overflow-auto">
    <CodeGenEditor
    :model-value="codeValue"
    :class="editorClass"
    class="rounded-t-none h-screen"
    lang="javascript"
    readonly
  ></CodeGenEditor>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import {
  RecordData,
  RecordDataType,
} from '~/utils/GlobalConstants';
import { getUUID } from '~/utils/Helper';
import {
  MessageListener,
  MessageTypes,
  sendMessage,
} from '~/utils/MessageListener';

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

const prefixCode: string[] = ['(async ()=> {']
const suffixCode: string[] = ['})()']
const middleCode: string[] = []
const codeValue = ref('')

let message: MessageListener
let domain: string
let recordData: RecordDataType = {
  id: getUUID(),
  time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  code: '',
  domain: '',
  status: 0,
}

const updateCodeValue = () => {
  codeValue.value = [...prefixCode, ...middleCode, ...suffixCode].join('\n')
  recordData.code = codeValue.value

  chrome.storage.local.get(RecordData, (result) => {
    const results: RecordDataType[] = result.RecordData || []
    const updatedResults = results.map((item) => {
      if (item && item.id === recordData.id) {
        return { ...item, code: recordData.code, domain: domain }
      }
      return item
    })

    if (!updatedResults.some((item) => item && item.id === recordData.id)) {
      recordData.domain = domain
      updatedResults.push(recordData)
    }
    chrome.storage.local.set({ RecordData: updatedResults })
  })
}

onMounted(async () => {
  const result = await sendMessage(
    MessageTypes.BACKGROUND.GET_CURRENT_DOMAIN,
    {},
    MessageTypes.BACKGROUND.PREFIX
  )

  domain = result as string
  updateCodeValue()
})

onBeforeMount(() => {
  message = new MessageListener(MessageTypes.RECORD.PREFIX)
  message.on(MessageTypes.RECORD.CHANGE_CODE, (data) => {
    middleCode.push(`  ${data}`)
    updateCodeValue()
  })
  chrome.runtime.onMessage.addListener(message.listener())
})
</script>
