<template>
    <div class="editor-menu-bar-bar">
        <div v-for="(item, index) in items" :key="index">
            <div class="editor-menu-bar-divider" v-if="item.type === 'divider'" />
            <menu-item v-else v-bind="item" />
        </div>
        <div v-for="(item, index) in customMenuItems" :key="index">
            <div class="editor-menu-bar-divider" v-if="item.type === 'divider'" />
            <menu-item v-else v-bind="item" />
        </div>

    </div>
</template>

<script setup>
import MenuItem from './menu_item.vue'

const props = defineProps({
    editor: {
        type: Object,
        required: true,
    },
    customMenuItems: {
        type: Array,
        default: []
    }
})

const items = ref([
    {
        icon: 'fas fa-bold',
        title: 'Bold',
        action: () => props.editor.chain().focus().toggleBold().run(),
        isActive: () => props.editor.isActive('bold'),
    },
    {
        icon: 'fas fa-italic',
        title: 'Italic',
        action: () => props.editor.chain().focus().toggleItalic().run(),
        isActive: () => props.editor.isActive('italic'),
    },
    {
        icon: 'fas fa-pen-alt',
        title: 'Highlight',
        action: () => props.editor.chain().focus().toggleHighlight().run(),
        isActive: () => props.editor.isActive('highlight'),
    },
    {
        type: 'divider',
    },
    {
        icon: 'fas fa-heading',
        title: 'Heading 1',
        action: () => props.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => props.editor.isActive('heading', { level: 1 }),
    },
    {
        icon: 'fas fa-paragraph',
        title: 'Paragraph',
        action: () => props.editor.chain().focus().setParagraph().run(),
        isActive: () => props.editor.isActive('paragraph'),
    },
    {
        icon: 'fas fa-list-ul',
        title: 'Bullet List',
        action: () => props.editor.chain().focus().toggleBulletList().run(),
        isActive: () => props.editor.isActive('bulletList'),
    },
    {
        icon: 'fas fa-list-ol',
        title: 'Ordered List',
        action: () => props.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => props.editor.isActive('orderedList'),
    },
    {
        icon: 'fas fa-tasks',
        title: 'Task List',
        action: () => props.editor.chain().focus().toggleTaskList().run(),
        isActive: () => props.editor.isActive('taskList'),
    },
    {
        type: 'divider',
    },
    {
        icon: 'fas fa-undo-alt',
        title: 'Undo',
        action: () => props.editor.chain().focus().undo().run(),
    },
    {
        icon: 'fas fa-redo-alt',
        title: 'Redo',
        action: () => props.editor.chain().focus().redo().run(),
    }
])

</script>

<style scoped>
.editor-menu-bar-bar {
    display: flex;
    align-items: center;
    border-bottom: solid 1px #e2e8f0;
    padding: 5px;
    flex-wrap: wrap
}

.editor-menu-bar-divider {
    width: 20px;
}
</style>
