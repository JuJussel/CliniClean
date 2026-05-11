<script setup>

const props = defineProps({
    content: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['update:content']);

const contentLocal = ref(props.content);
watch(contentLocal, (val) => emit('update:content', val))

</script>

<template>
    <div class="h-full">
        <CompTextEditor v-model="contentLocal" class="h-full" />
     </div>
</template>