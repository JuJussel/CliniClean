<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 flex flex-col items-center">
    <div class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[80vh]">
      
      <!-- Toolbar -->
      <div v-if="editor" class="p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-1 bg-gray-50/50 dark:bg-gray-800/50">
        <!-- History -->
        <UButtonGroup size="sm">
          <UTooltip text="Undo">
            <UButton
              icon="i-heroicons-arrow-uturn-left"
              color="gray"
              variant="ghost"
              @click="editor.chain().focus().undo().run()"
              :disabled="!editor.can().undo()"
            />
          </UTooltip>
          <UTooltip text="Redo">
            <UButton
              icon="i-heroicons-arrow-uturn-right"
              color="gray"
              variant="ghost"
              @click="editor.chain().focus().redo().run()"
              :disabled="!editor.can().redo()"
            />
          </UTooltip>
        </UButtonGroup>

        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <!-- Formatting -->
        <UButtonGroup size="sm">
          <UButton
            icon="i-heroicons-bold"
            :color="editor.isActive('bold') ? 'primary' : 'gray'"
            variant="ghost"
            @click="editor.chain().focus().toggleBold().run()"
          />
          <UButton
            icon="i-heroicons-italic"
            :color="editor.isActive('italic') ? 'primary' : 'gray'"
            variant="ghost"
            @click="editor.chain().focus().toggleItalic().run()"
          />
          <UButton
            icon="i-heroicons-underline"
            :color="editor.isActive('underline') ? 'primary' : 'gray'"
            variant="ghost"
            @click="editor.chain().focus().toggleUnderline().run()"
          />
          <UButton
            icon="i-heroicons-strikethrough"
            :color="editor.isActive('strike') ? 'primary' : 'gray'"
            variant="ghost"
            @click="editor.chain().focus().toggleStrike().run()"
          />
        </UButtonGroup>

        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <!-- Color Picker -->
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-swatch"
            color="gray"
            variant="ghost"
            size="sm"
            :style="{ color: editor.getAttributes('textStyle').color }"
          />
          <template #panel>
            <div class="p-2 grid grid-cols-5 gap-1">
              <button
                v-for="color in colors"
                :key="color"
                class="w-6 h-6 rounded-full border border-gray-200"
                :style="{ backgroundColor: color }"
                @click="editor.chain().focus().setColor(color).run()"
              />
              <UButton
                icon="i-heroicons-x-mark"
                size="2xs"
                color="red"
                variant="soft"
                @click="editor.chain().focus().unsetColor().run()"
              />
            </div>
          </template>
        </UPopover>

        <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

        <!-- Links & Images -->
        <UButtonGroup size="sm">
          <UButton
            icon="i-heroicons-link"
            :color="editor.isActive('link') ? 'primary' : 'gray'"
            variant="ghost"
            @click="setLink"
          />
          <UButton
            icon="i-heroicons-photo"
            color="gray"
            variant="ghost"
            @click="triggerImageUpload"
          />
        </UButtonGroup>

        <div class="flex-1" />

        <!-- Save Button -->
        <UButton
          label="Save Content"
          color="black"
          :loading="saving"
          @click="saveContent"
        />
      </div>

      <!-- Editor Canvas -->
      <div class="flex-1 overflow-y-auto p-6 prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none">
        <editor-content :editor="editor" />
      </div>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      />

      <!-- Footer Info -->
      <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500">
        <span>Tip: Drag & drop images or paste them directly.</span>
        <span>{{ wordCount }} words</span>
      </div>
    </div>

    <!-- Success Notification -->
    <UNotifications />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { useEditor, EditorContent, Extension } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

// --- CUSTOM UTILS / EXTENSIONS ---

/**
 * Custom Extension to handle Image Drops and Pastes
 */
const FileHandler = Extension.create({
  name: 'fileHandler',
  addProseMirrorPlugins() {
    return [
      {
        props: {
          handleDrop(view, event) {
            const hasFiles = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length
            if (!hasFiles) return false

            const images = Array.from(event.dataTransfer.files).filter(f => /image/i.test(f.type))
            if (images.length === 0) return false

            event.preventDefault()
            images.forEach(file => {
              insertTemporaryImage(view, file)
            })
            return true
          },
          handlePaste(view, event) {
            const hasFiles = event.clipboardData && event.clipboardData.files && event.clipboardData.files.length
            if (!hasFiles) return false

            const images = Array.from(event.clipboardData.files).filter(f => /image/i.test(f.type))
            if (images.length === 0) return false

            images.forEach(file => {
              insertTemporaryImage(view, file)
            })
            return true
          }
        }
      }
    ]
  }
})

/**
 * Utility to convert file to local blob URL and insert into editor
 */
function insertTemporaryImage(view, file) {
  const reader = new FileReader()
  reader.onload = (readerEvent) => {
    const node = view.state.schema.nodes.image.create({
      src: readerEvent.target.result,
      'data-pending': 'true' // Mark as pending upload
    })
    const transaction = view.state.tr.replaceSelectionWith(node)
    view.dispatch(transaction)
  }
  reader.readAsDataURL(file)
}

// --- COMPONENT LOGIC ---

const fileInput = ref(null)
const saving = ref(false)
const toast = useToast()

const colors = [
  '#000000', '#ef4444', '#f97316', '#f59e0b', '#10b981', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#64748b'
]

const editor = useEditor({
  content: `
    <h1>Nuxt UI + Tiptap Editor</h1>
    <p>Try <strong>bolding</strong> text, changing <em>colors</em>, or dropping an image here!</p>
  `,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    Underline,
    Image.configure({
      inline: true,
      HTMLAttributes: {
        class: 'rounded-lg shadow-md max-w-full'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary-500 underline cursor-pointer'
      }
    }),
    FileHandler
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none'
    }
  }
})

const wordCount = computed(() => {
  if (!editor.value) return 0
  const text = editor.value.getText()
  return text.split(/\s+/).filter(s => s.length > 0).length
})

const setLink = () => {
  const previousUrl = editor.value.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  // cancelled
  if (url === null) return

  // empty
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // update link
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const triggerImageUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = (e) => {
  const files = e.target.files
  if (!files.length) return
  
  Array.from(files).forEach(file => {
    if (editor.value) {
      insertTemporaryImage(editor.value.view, file)
    }
  })
  
  // Reset input
  e.target.value = ''
}

/**
 * Dummy upload function
 */
async function uploadImage(base64Data) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  // In a real app, you'd POST to your server and get back a permanent URL
  // Here we just return a "confirmed" version of the data URL or a placeholder
  console.log("Uploading file to server...")
  return base64Data // Returning same for demo, but normally this is 'https://cdn.com/image.png'
}

/**
 * Save process: 
 * 1. Find all images with data-pending
 * 2. Upload them
 * 3. Replace sources
 * 4. Get final HTML
 */
const saveContent = async () => {
  if (!editor.value) return
  saving.value = true

  try {
    const json = editor.value.getJSON()
    
    // Deep search for images in JSON to simulate background uploading
    const processNodes = async (nodes) => {
      for (let node of nodes) {
        if (node.type === 'image' && node.attrs.src.startsWith('data:')) {
          const permanentUrl = await uploadImage(node.attrs.src)
          node.attrs.src = permanentUrl
          delete node.attrs['data-pending']
        }
        if (node.content) {
          await processNodes(node.content)
        }
      }
    }

    if (json.content) {
      await processNodes(json.content)
    }

    // Set editor content to the "cleaned" version
    editor.value.commands.setContent(json)
    
    const finalHtml = editor.value.getHTML()
    console.log("Final Saved HTML:", finalHtml)

    toast.add({
      title: 'Content Saved!',
      description: 'All temporary images were processed and saved.',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  } catch (err) {
    toast.add({
      title: 'Save Failed',
      description: err.message,
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

onBeforeUnmount(() => {
  editor.value.destroy()
})
</script>

<style>
/* Tiptap specific styling for better UX */
.ProseMirror {
  min-height: 200px;
}
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
.ProseMirror img {
  display: block;
  margin: 1rem auto;
  max-width: 100%;
}
.ProseMirror img.ProseMirror-selectednode {
  outline: 3px solid rgb(var(--color-primary-500));
}
</style>