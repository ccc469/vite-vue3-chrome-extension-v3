<template>
  <div
    ref="containerEl"
    :class="{ 'hide-gutters': !lineNumbers }"
    class="codemirror relative overflow-auto rounded-lg w-full"
  >
    <div
      v-if="!hideLang"
      class="absolute bottom-0 left-0 z-10 flex h-6 w-full items-center px-2 text-xs text-gray-300"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { indentWithTab } from '@codemirror/commands'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'

// import { githubLight, githubLightInit, githubDark, githubDarkInit } from '@uiw/codemirror-theme-github';
// import { githubLight } from '@uiw/codemirror-theme-github'
import { oneDark } from '@codemirror/theme-one-dark'

const props = defineProps({
  lang: {
    type: String,
    default: 'javascript',
  },
  modelValue: {
    type: String,
    default: '',
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  lineNumbers: {
    type: Boolean,
    default: true,
  },
  extensions: {
    type: [Object, Array],
    default: () => [],
  },
  hideLang: Boolean,
})
const emit = defineEmits(['change', 'update:modelValue'])

let view: EditorView
const langs = { json, javascript, html, css }

const containerEl = ref(null)

const updateListener = EditorView.updateListener.of((event) => {
  if (event.docChanged) {
    event.state.sliceDoc(0, 20)

    const newValue = event.state.doc.toString()

    emit('change', newValue)
    emit('update:modelValue', newValue)
  }
})

const customExtension = Array.isArray(props.extensions)
  ? props.extensions
  : [props.extensions]

const state = EditorState.create({
  doc: props.modelValue,
  extensions: [
    oneDark,
    basicSetup,
    updateListener,
    langs[props.lang as keyof typeof langs]?.(),
    EditorState.tabSize.of(2),
    keymap.of([indentWithTab]),
    EditorState.readOnly.of(props.readonly),
    ...customExtension,
  ],
})

watch(
  () => props.modelValue,
  (value) => {
    if (value === view.state.doc.toString()) return

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
    })
  }
)

onMounted(() => {
  if (containerEl.value) {
    view = new EditorView({
      state,
      parent: containerEl.value,
    })
  } else {
    console.error('Container element is not available')
  }
})
onBeforeUnmount(() => {
  view?.destroy()
})
</script>
