<template>
  <div class="bg-gray-100 pl-10 pr-10 pb-10 h-screen">
    <!-- Tabs -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <ul
        class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400"
      >
        <li class="mr-2">
          <a
            id="dashboard"
            href="#"
            class="inline-flex items-center justify-center p-4"
            aria-current="page"
          >
            <svg
              class="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path
                d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"
              />
            </svg>
            Dashboard
          </a>
        </li>
        <li class="mr-2">
          <a
            id="scheduling"
            href="#"
            class="inline-flex items-center justify-center p-4"
            aria-current="page"
          >
            <svg
              class="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z"
              />
            </svg>
            Scheduling Plan
          </a>
        </li>
      </ul>
    </div>

    <div id="schedulingTarget">
      <div class="mb-6">
        <div class="flex space-x-4">
          <input
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Search text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500"
          />

          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add Plan
          </button>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-grow"></div>
    </div>

    <div id="dashboardTarget">
      <!-- Search Area -->
      <div class="mb-6">
        <div class="flex space-x-4">
          <input
            type="date"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Search text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500"
          />

          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-grow"></div>

      <!-- Table Area -->
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          :style="{ height: tableHeight + 'px' }"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th
                scope="col"
                class="p-4"
              >
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="checkbox-all-search"
                    class="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Record ID
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Start Url
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Domain
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Review Code
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Create Time
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(record, index) in records"
              :key="index"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="w-4 p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="checkbox-table-search-1"
                    class="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div
                  :id="'tooltipIdTrigger-' + index"
                  type="button"
                  class="truncate w-[150px]"
                >
                  {{ record.id }}
                </div>
                <div
                  :id="'tooltipIdContent-' + index"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  {{ record.id }}
                  <div
                    class="tooltip-arrow"
                    data-popper-arrow
                  ></div>
                </div>
              </th>
              <td class="px-6 py-4">
                <div
                  :id="'tooltipUrlTrigger-' + index"
                  type="button"
                  class="truncate w-[150px]"
                >
                  {{ record.startUrl }}
                </div>
                <div
                  :id="'tooltipUrlContent-' + index"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  {{ record.startUrl }}
                  <div
                    class="tooltip-arrow"
                    data-popper-arrow
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4">{{ record.domain }}</td>
              <td class="px-6 py-4">
                <div
                  :id="'tooltipCodeTrigger-' + index"
                  type="button"
                  class="truncate w-[150px]"
                >
                  {{ record.code }}
                </div>
                <div
                  :id="'tooltipCodeContent-' + index"
                  role="tooltip"
                  class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                  {{ record.code }}
                  <div
                    class="tooltip-arrow"
                    data-popper-arrow
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4">{{ record.time }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    :class="`h-2.5 w-2.5 rounded-full ${
                      record.status ? 'bg-green-500' : 'bg-red-500'
                    } mr-2`"
                  ></div>
                  {{ record.status ? 'Finish' : 'In Progress...' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap py-1">
                  <a
                    href="#"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline w-1/2"
                    @click="reviewCode(record)"
                  >
                    View Code
                  </a>
                  <a
                    href="#"
                    class="font-medium text-red-600 dark:text-red-500 hover:underline w-1/2"
                    @click="showPopupModal(record)"
                  >
                    Delete
                  </a>
                </div>
                <div class="flex flex-wrap py-1">
                  <a
                    href="#"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline w-1/2"
                    @click="runCode(record)"
                  >
                    Run
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <nav
          class="flex items-center justify-between pt-4 pl-4"
          aria-label="Table navigation"
        >
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">
              1-10
            </span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">
              1000
            </span>
          </span>

          <!-- Pagination -->
          <ul class="inline-flex -space-x-px text-sm h-8 pr-2 mb-2">
            <li>
              <a
                href="#"
                class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
  <!-- Review Code Modal -->
  <div
    id="modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full"
  >
    <div
      class="relative w-full max-w-7xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700 p-6 space-y-6"
    >
      <CodeEditor
        :model-value="codeValue"
        lang="javascript"
        class="max-h-[calc(100vh-200px)] overflow-y-auto"
        readonly
      ></CodeEditor>
    </div>
  </div>

  <!-- Popup Modal -->

  <div
    id="popup-modal"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
          type="button"
          class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="popup-modal"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-6 text-center">
          <svg
            class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete it?
          </h3>
          <button
            data-modal-hide="popup-modal"
            type="button"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="removeRecord"
          >
            Yes, I'm sure
          </button>
          <button
            data-modal-hide="popup-modal"
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="popupModal.toggle()"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--  -->
</template>

<script setup lang="ts">
import {
  Modal,
  ModalInterface,
  TabItem,
  Tabs,
  TabsInterface,
  Tooltip,
} from 'flowbite'
import { RecordData, RecordDataType } from '~/utils/GlobalConstants'

const tabElements: TabItem[] = []

const tableHeight = ref(0)
const updateTableHeight = () => {
  tableHeight.value = window.innerHeight - 240
}
const codeValue = ref('')

let modal: ModalInterface
let popupModal: ModalInterface
let tabs: TabsInterface
let waitDeleteRecord: RecordDataType
const records = ref<RecordDataType[]>([])

const reviewCode = (record: RecordDataType) => {
  codeValue.value = record.code
  modal.toggle()
}

const showPopupModal = (record: RecordDataType) => {
  waitDeleteRecord = record
  popupModal.toggle()
}

const removeRecord = () => {
  if (!waitDeleteRecord) {
    return
  }

  chrome.storage.local.get(RecordData).then((result) => {
    const results = (result.RecordData as RecordDataType[]) || []
    const newResults = results.filter(
      (record) => record && record.id !== waitDeleteRecord.id
    )

    records.value = newResults
    chrome.storage.local.set({ RecordData: newResults })
    popupModal.toggle()
  })
}

const runCode = async (record: RecordDataType) => {
  chrome.tabs.create({ url: record.startUrl }, (tab: chrome.tabs.Tab) => {
    const newTabId = tab.id
    async function listener(
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo
    ) {
      if (tabId === newTabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener)
      }
    }
    chrome.tabs.onUpdated.addListener(listener)
  })
}

onBeforeMount(async () => {
  chrome.storage.local.get(RecordData).then((result) => {
    const results = (result.RecordData || []) as RecordDataType[]
    results.sort((a, b) => b.time.localeCompare(a.time))
    records.value = results
  })
})

const activeClasses: string[] = [
  'text-blue-600',
  'border-b-2',
  'border-blue-600',
  'rounded-t-lg',
  'active',
  'dark:text-blue-500',
  'dark:border-blue-500',
  'group',
]

const svgActiveClasses: string[] = ['text-blue-600', 'dark:text-blue-500']
const svgInactiveClasses: string[] = ['text-gray-600', 'dark:text-gray-500']

onMounted(() => {
  updateTableHeight()

  const $modalEl = document.querySelector('#modal') as HTMLElement
  modal = new Modal($modalEl, { closable: true })

  const $popupModalEl = document.querySelector('#popup-modal') as HTMLElement
  popupModal = new Modal($popupModalEl, { closable: true })

  tabElements.push({
    id: 'dashboard',
    triggerEl: document.querySelector('#dashboard') as HTMLElement,
    targetEl: document.querySelector('#dashboardTarget') as HTMLElement,
  })
  tabElements.push({
    id: 'scheduling',
    triggerEl: document.querySelector('#scheduling') as HTMLElement,
    targetEl: document.querySelector('#schedulingTarget') as HTMLElement,
  })

  tabs = new Tabs(tabElements)
  // 默认显示所有标签内容
  tabElements.forEach((tab) => {
    const { triggerEl } = tab

    triggerEl.classList.remove('hidden')

    if (triggerEl.id === 'dashboard') {
      triggerEl.classList.add(...activeClasses)
      triggerEl.querySelector('svg')?.classList.add(...svgActiveClasses)
    }

    triggerEl.addEventListener('click', (e: Event) => {
      e.preventDefault()
      const $element = e.target as HTMLElement
      tabElements
        .filter((_EL) => _EL.triggerEl.textContent !== $element.textContent)
        .forEach((_EL) => {
          _EL.triggerEl.classList.remove('hidden')
          _EL.triggerEl
            .querySelector('svg')
            ?.classList.remove(...svgActiveClasses)
          _EL.triggerEl
            .querySelector('svg')
            ?.classList.remove(...svgInactiveClasses)
        })

      $element.classList.add(...activeClasses)
      $element.querySelector('svg')?.classList.add(...svgActiveClasses)
    })
  })
  tabs.show('dashboard')

  window.addEventListener('resize', updateTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})

watch(records, () => {
  nextTick(() => {
    records.value.forEach((_, index) => {
      const $targetEl = document.getElementById(`tooltipCodeContent-${index}`)
      const $triggerEl = document.getElementById(`tooltipCodeTrigger-${index}`)
      new Tooltip($targetEl, $triggerEl, {
        triggerType: 'hover',
      })

      const $targetUrlEl = document.getElementById(`tooltipUrlContent-${index}`)
      const $triggerUrlEl = document.getElementById(
        `tooltipUrlTrigger-${index}`
      )
      new Tooltip($targetUrlEl, $triggerUrlEl, {
        triggerType: 'hover',
      })
      const $targetIdEl = document.getElementById(`tooltipIdContent-${index}`)
      const $triggerIdEl = document.getElementById(`tooltipIdTrigger-${index}`)
      new Tooltip($targetIdEl, $triggerIdEl, {
        triggerType: 'hover',
      })
    })
  })
})
</script>
