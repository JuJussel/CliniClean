<template>
  <node-view-wrapper style="display: inline"
      draggable="true"
      data-drag-handle
  >
    <span class="cc-image-tag-content" @click="show">
      画像{{ node.attrs.index }}
    </span>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

export default {
  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  methods: {
    show() {
      window.open(this.node.attrs.url, '_blank', "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10")
    }
  },
}
</script>

<style>
  .cc-image-tag-content {
    background: var(--cui-gray-5);
    padding: 4px;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
  }
</style>