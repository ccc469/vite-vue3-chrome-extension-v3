<template>
  <SharedCodemirror
    :model-value="codeValue"
    :class="editorClass"
    class="rounded-t-none"
    lang="javascript"
  ></SharedCodemirror>
</template>

<script setup lang="ts">
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
  return ``
})
</script>
