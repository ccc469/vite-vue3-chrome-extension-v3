<template>
  <div class="bg-gray-100 p-10 h-screen">
    <!-- Search Area -->
    <div class="mb-6">
      <h1 class="text-2xl mb-4">Search Area</h1>
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
              Domain
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
            v-for="(record, index) in tableData"
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
              {{ record.id }}
            </th>
            <td class="px-6 py-4">{{ record.domain }}</td>
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
              <div class="flex flex-wrap">
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
          <span class="font-semibold text-gray-900 dark:text-white">1-10</span>
          of
          <span class="font-semibold text-gray-900 dark:text-white">1000</span>
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
      <CodeGenEditor
        :model-value="codeValue"
        lang="javascript"
        class="max-h-[calc(100vh-200px)] overflow-y-auto"
        readonly
      ></CodeGenEditor>
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

  <!-- Other -->
</template>

<script setup lang="ts">
import {
  Modal,
  ModalInterface,
} from 'flowbite';
import { RecordDataType } from '~/utils/GlobalConstants';

const tableHeight = ref(0)
const updateTableHeight = () => {
  tableHeight.value = window.innerHeight - 240
}
const tableData = ref<RecordDataType[]>([])
const codeValue = ref('')

let modal: ModalInterface
let popupModal: ModalInterface
let waitDeleteRecord: RecordDataType

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

  chrome.storage.local.get().then((result) => {
    const results = (result.RecordData as RecordDataType[]) || []
    const newResults = results.filter(
      (record) => record && record.id !== waitDeleteRecord.id
    )

    tableData.value = newResults
    chrome.storage.local.set({ RecordData: newResults })
    popupModal.toggle()
  })
}

onMounted(() => {
  updateTableHeight()

  modal = new Modal(document.querySelector('#modal') as HTMLElement, {
    closable: true,
  })
  popupModal = new Modal(
    document.querySelector('#popup-modal') as HTMLElement,
    {
      closable: true,
    }
  )

  window.addEventListener('resize', updateTableHeight)
})

onBeforeMount(() => {
  chrome.storage.local.get().then((result) => {
    tableData.value = result.RecordData || []
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight)
})
</script>
