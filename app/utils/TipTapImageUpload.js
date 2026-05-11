import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await $fetch('/api/upload', { method: 'POST', body: formData })
  return res.url
}

export const ImageUpload = Extension.create({
  name: 'imageUpload',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handlePaste: (view, event) => {
            const items = Array.from(event.clipboardData?.items ?? [])
            const imageItem = items.find(i => i.type.startsWith('image/'))
            if (!imageItem) return false

            event.preventDefault()
            const file = imageItem.getAsFile()
            if (!file) return false

            uploadImage(file).then((url) => {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: url })
              const transaction = view.state.tr.replaceSelectionWith(node)
              view.dispatch(transaction)
            })
            return true
          },
          handleDrop: (view, event) => {
            const file = event.dataTransfer?.files?.[0]
            if (!file?.type.startsWith('image/')) return false

            event.preventDefault()
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
            if (!coordinates) return false

            uploadImage(file).then((url) => {
              const { schema } = view.state
              const node = schema.nodes.image.create({ src: url })
              const transaction = view.state.tr.insert(coordinates.pos, node)
              view.dispatch(transaction)
            })
            return true
          }
        }
      })
    ]
  }
})