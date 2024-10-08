<template>
    <div class="cui-editor-menu-bar-bar">
        <div v-for="(item, index) in items" :key="index">
            <div class="cui-editor-menu-bar-divider" v-if="item.type === 'divider'" />
            <menu-item v-else v-bind="item" />
        </div>
        <div v-for="(item, index) in customMenuItems" :key="index">
            <div class="cui-editor-menu-bar-divider" v-if="item.type === 'divider'" />
            <menu-item v-else v-bind="item" />
        </div>

    </div>
</template>

<script>
import MenuItem from './cui-editor-menu-item.vue'
export default {
    components: {
        MenuItem,
    },
    props: {
        editor: {
            type: Object,
            required: true,
        },
        customMenuItems: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            items: [
                {
                    icon: 'fas fa-bold',
                    title: 'Bold',
                    action: () => this.editor.chain().focus().toggleBold().run(),
                    isActive: () => this.editor.isActive('bold'),
                },
                {
                    icon: 'fas fa-italic',
                    title: 'Italic',
                    action: () => this.editor.chain().focus().toggleItalic().run(),
                    isActive: () => this.editor.isActive('italic'),
                },
                {
                    icon: 'fas fa-pen-alt',
                    title: 'Highlight',
                    action: () => this.editor.chain().focus().toggleHighlight().run(),
                    isActive: () => this.editor.isActive('highlight'),
                },
                {
                    type: 'divider',
                },
                {
                    icon: 'fas fa-heading',
                    title: 'Heading 1',
                    action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
                    isActive: () => this.editor.isActive('heading', { level: 1 }),
                },
                {
                    icon: 'fas fa-paragraph',
                    title: 'Paragraph',
                    action: () => this.editor.chain().focus().setParagraph().run(),
                    isActive: () => this.editor.isActive('paragraph'),
                },
                {
                    icon: 'fas fa-list-ul',
                    title: 'Bullet List',
                    action: () => this.editor.chain().focus().toggleBulletList().run(),
                    isActive: () => this.editor.isActive('bulletList'),
                },
                {
                    icon: 'fas fa-list-ol',
                    title: 'Ordered List',
                    action: () => this.editor.chain().focus().toggleOrderedList().run(),
                    isActive: () => this.editor.isActive('orderedList'),
                },
                {
                    icon: 'fas fa-tasks',
                    title: 'Task List',
                    action: () => this.editor.chain().focus().toggleTaskList().run(),
                    isActive: () => this.editor.isActive('taskList'),
                },
                {
                    type: 'divider',
                },
                {
                    icon: 'fas fa-undo-alt',
                    title: 'Undo',
                    action: () => this.editor.chain().focus().undo().run(),
                },
                {
                    icon: 'fas fa-redo-alt',
                    title: 'Redo',
                    action: () => this.editor.chain().focus().redo().run(),
                }
            ],
        }
    },
}
</script>

<style scoped>
.cui-editor-menu-bar-bar {
    display: flex;
    align-items: center;
    border-bottom: solid 1px var(--cui-dark);
    padding: 5px;
    flex-wrap: wrap
}

.cui-editor-menu-bar-divider {
    width: 2px;
    height: 1.25rem;
    background-color: var(--cui-dark);
    margin-left: 0.5rem;
    margin-right: 0.75rem;
}
</style>
