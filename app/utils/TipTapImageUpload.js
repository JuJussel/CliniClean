import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function insertImageFromFile(editor, file) {
  fileToBase64(file).then((dataUrl) => {
    editor.chain().focus().setImage({ src: dataUrl }).run()
  })
}

export const ImagePasteDropExtension = Extension.create({
  name: 'imagePasteDrop',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imagePasteDrop'),
        props: {
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items ?? [])
            const imageItem = items.find(i => i.type.startsWith('image/'))
            if (!imageItem) return false

            event.preventDefault()
            const file = imageItem.getAsFile()
            if (!file) return false

            fileToBase64(file).then((dataUrl) => {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: dataUrl })
              const tr = view.state.tr.replaceSelectionWith(node)
              view.dispatch(tr)
            })
            return true
          },

          handleDrop(view, event) {
            const file = event.dataTransfer?.files?.[0]
            if (!file?.type.startsWith('image/')) return false

            event.preventDefault()
            const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
            if (!coords) return false

            fileToBase64(file).then((dataUrl) => {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: dataUrl })
              const tr = view.state.tr.insert(coords.pos, node)
              view.dispatch(tr)
            })
            return true
          }
        }
      })
    ]
  }
})