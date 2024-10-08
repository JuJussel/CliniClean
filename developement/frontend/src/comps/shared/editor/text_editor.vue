<template>
    <div v-if="editor">
        <menu-bar :editor="editor" :customMenuItems="customMenuItems"></menu-bar>
        <editor-content :editor="editor" style="height: calc(100% - 70px)" />
    </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./cui-editor-menu-bar.vue"

export default {
    components: {
        EditorContent,
        MenuBar
    },
    emits: [
        'update'
    ],
    props: {
        content: {
            default: null
        },
        customExtensions: {
            type: Array,
            default: []
        },
        customMenuItems: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            editor: null,
            timeout: null,
            options: {
                content: this.content,
                extensions: [
                    StarterKit
                ],
                onUpdate: function ({ editor }) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(function () {
                        this.$emit('update', {
                            html: editor.getHTML(),
                            json: editor.getJSON()
                        })
                    }.bind(this), 2000)
                }.bind(this)
            },
        };
    },
    methods: {
        setContent(content) {
            this.editor.commands.setContent(content)
        }
    },
    mounted() {
        this.options.extensions = this.options.extensions.concat(this.customExtensions);
        this.editor = new Editor(this.options)
        if (this.content) this.setContent(this.content)
    },

    beforeUnmount() {
        this.editor.destroy()
    },
};
</script>

<style>
.ProseMirror {
    outline: none !important;
    height: 100%;
    overflow: auto;
    padding: 10px
}
</style>