import { Image } from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ResizableImageView from '~/components/CompTextEditorImage.vue'

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: el => el.getAttribute('width') ? parseInt(el.getAttribute('width')) : null,
        renderHTML: attrs => attrs.width ? { width: attrs.width, style: `width: ${attrs.width}px` } : {}
      }
    }
  },

  addNodeView() {
    return VueNodeViewRenderer(ResizableImageView)
  }
})