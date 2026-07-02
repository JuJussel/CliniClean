<script setup>
import { Underline } from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

const props = defineProps({
    modelValue: {
        type: [String, Object],
        default: () => ({ type: "doc", content: [{ type: "paragraph" }] }),
    },
    disabled: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(["update:modelValue", "save"]);

const content = ref(props.modelValue);
const colorInputRef = ref(null);
const selectedColor = ref("#000000");
const isSaving = ref(false);
const editorInstance = useTemplateRef("editorRef");

const extensions = [
    Underline,
    TextStyle,
    Color,
    ImagePasteDropExtension,
    ResizableImage,
];

watch(
    () => props.modelValue,
    (val) => {
        content.value = val;
    },
);
watch(content, (val) => emit("update:modelValue", val));

const items = [
    [
        { kind: "undo", icon: "i-lucide-undo-2", tooltip: { text: "Undo" } },
        { kind: "redo", icon: "i-lucide-redo-2", tooltip: { text: "Redo" } },
    ],
    [
        {
            kind: "mark",
            mark: "bold",
            icon: "i-lucide-bold",
            tooltip: { text: "Bold" },
        },
        {
            kind: "mark",
            mark: "italic",
            icon: "i-lucide-italic",
            tooltip: { text: "Italic" },
        },
        {
            kind: "mark",
            mark: "underline",
            icon: "i-lucide-underline",
            tooltip: { text: "Underline" },
        },
        {
            kind: "mark",
            mark: "strike",
            icon: "i-lucide-strikethrough",
            tooltip: { text: "Strikethrough" },
        },
    ],
    [
        { slot: "color" },
        { kind: "link", icon: "i-lucide-link", tooltip: { text: "Link" } },
        {
            icon: "i-lucide-image",
            tooltip: { text: "Insert image" },
            onClick: () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = () => {
                    const file = input.files?.[0];
                    if (file)
                        insertImageFromFile(editorInstance.value.editor, file);
                };
                input.click();
            },
        },
    ],
];

function onColorInput(event) {
    selectedColor.value = event.target.value;
    editorInstance.value.editor
        .chain()
        .focus()
        .setColor(selectedColor.value)
        .run();
}

async function save() {
    isSaving.value = true;
    try {
        const processed = await processContentImages(content.value);
        emit("save", processed);
    } finally {
        isSaving.value = false;
    }
}

defineExpose({ save });
</script>

<template>
    <div class="h-full flex flex-col min-h-0">
        <UEditor
            v-slot="{ editor }"
            ref="editorRef"
            v-model="content"
            content-type="json"
            :image="false"
            :extensions="extensions"
            :editable="!disabled"
            :ui="{
                root: 'h-full flex flex-col min-h-0',
                content: 'flex-1 overflow-y-auto min-h-0'
            }"
            class="h-full flex-1 min-h-0"
            :placeholder="$t('startWriting')"
        >
            <UEditorToolbar
                v-if="!disabled"
                :editor="editor"
                :items="items"
                class="border-b border-muted sticky top-0 inset-x-0 py-2 z-50 overflow-x-auto"
            >
                <!-- Custom slot for the color picker -->
                <template #color>
                    <UTooltip text="Text color">
                        <UButton
                            icon="i-lucide-baseline"
                            variant="ghost"
                            color="neutral"
                            size="sm"
                            @click="colorInputRef?.click()"
                        >
                            <template #trailing>
                                <span
                                    class="w-3 h-1 rounded-sm block"
                                    :style="{ backgroundColor: selectedColor }"
                                />
                            </template>
                        </UButton>
                    </UTooltip>
                    <input
                        ref="colorInputRef"
                        type="color"
                        :value="selectedColor"
                        class="sr-only"
                        @input="onColorInput"
                    >
                </template>
            </UEditorToolbar>
        </UEditor>
    </div>
</template>
