<script setup>

const props = defineProps({
    content: {
        type: Object,
        default: () => ({}),
    },
});

</script>

<template>
    <div class="h-full">
        <CompTextEditor :content="content" class="h-full" />
     </div>
</template>