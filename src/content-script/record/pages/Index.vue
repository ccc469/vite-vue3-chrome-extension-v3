<template>
  <div class="relative overflow-auto">
    <CodeEditor
      :model-value="codeValue"
      :class="editorClass"
      class="rounded-t-none h-screen"
      lang="javascript"
      readonly
    ></CodeEditor>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import {
  GetDomainType,
  RecordData,
  RecordDataType,
  RecordState,
} from '~/utils/GlobalConstants'
import { getUUID } from '~/utils/Helper'
import {
  MessageListener,
  MessageTypes,
  sendMessage,
} from '~/utils/MessageListener'

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
const changeRecordId = ref<boolean>(false)

let message: MessageListener
let currDomain: string
let currUrl: string
let recordData: RecordDataType = {
  id: '',
  time: '',
  code: '',
  domain: '',
  status: 0,
  startUrl: '',
}

const updateCodeValue = () => {
  codeValue.value = [...prefixCode, ...middleCode, ...suffixCode].join('\n')
  recordData.code = codeValue.value

  chrome.storage.local.get(RecordData, (result) => {
    const results: RecordDataType[] = result.RecordData || []
    const updatedResults = results.map((item) => {
      if (item && item.id === recordData.id) {
        return { ...item, code: recordData.code, domain: currDomain }
      }
      return item
    })

    if (!updatedResults.some((item) => item && item.id === recordData.id)) {
      recordData.domain = currDomain
      updatedResults.push(recordData)
    }
    chrome.storage.local.set({ RecordData: updatedResults })
  })
}

onMounted(async () => {
  const result = await sendMessage(
    MessageTypes.BACKGROUND.PREFIX,
    MessageTypes.BACKGROUND.GET_CURRENT_DOMAIN
  )

  const { domain, url } = result as GetDomainType
  currDomain = domain
  currUrl = url
  recordData.domain = domain
  recordData.startUrl = currUrl
  updateCodeValue()
})

onBeforeMount(() => {
  recordData.id = getUUID()
  recordData.time = dayjs().format('YYYY-MM-DD HH:mm:ss')

  if (!changeRecordId.value) {
    chrome.storage.local.get(RecordState).then((result) => {
      result.RecordState['recordId'] = recordData.id
      chrome.storage.local.set({ RecordState: result.RecordState })
    })
    changeRecordId.value = true
  }

  message = new MessageListener(MessageTypes.RECORD.PREFIX)
  message.on(MessageTypes.RECORD.CHANGE_CODE, (data) => {
    middleCode.push(`  ${data}`)
    updateCodeValue()
  })
  chrome.runtime.onMessage.addListener(message.listener())
})
</script>
