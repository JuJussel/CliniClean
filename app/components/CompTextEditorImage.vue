<script setup>
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  node: Object,
  updateAttributes: Function,
  selected: Boolean
})

const imgRef = ref(null)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

const width = computed(() => {
  const w = props.node.attrs.width
  return w ? `${w}px` : 'auto'
})

function startResize(e) {
  e.preventDefault()
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = imgRef.value?.offsetWidth ?? 300
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopResize)
}

function onMouseMove(e) {
  if (!isResizing.value) return
  const newWidth = Math.max(80, startWidth.value + (e.clientX - startX.value))
  props.updateAttributes({ width: Math.round(newWidth) })
}

function stopResize() {
  isResizing.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopResize)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<template>
  <NodeViewWrapper
    class="relative inline-block leading-none"
    :class="{ 'ring-2 ring-primary ring-offset-1 rounded-sm': selected }"
  >
    <img
      ref="imgRef"
      :src="node.attrs.src"
      :alt="node.attrs.alt ?? ''"
      :style="{ width }"
      class="block max-w-full"
      draggable="false"
    />

    <!-- Width label shown while resizing -->
    <div
      v-if="isResizing"
      class="absolute top-2 left-2 text-xs bg-inverted text-inverted px-1.5 py-0.5 rounded font-mono select-none"
    >
      {{ node.attrs.width }}px
    </div>

    <!-- Resize handle — bottom right -->
    <div
      v-if="selected || isResizing"
      class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary rounded-tl cursor-se-resize"
      @mousedown.stop="startResize"
    />
  </NodeViewWrapper>
</template>