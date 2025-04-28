import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from './cc_tiptap_imageTag.vue'

export default Node.create({
  name: 'imageTag',
  draggable: true,

  group: 'inline',

  inline: true,

  atom: true,

  selectable: true,


  addAttributes() {
    return {
      index: {
        default: 0
      },
      url: {
        default: ''
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'imageTag',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['imageTag', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})