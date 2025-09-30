<template>
    <div class="layout-columns w-full" :style="{ height }">
        <div class="grid h-full w-full gap-4" :class="`grid-cols-${columns}`">
            <div v-for="idx in columns" :key="idx" class="h-full w-full">
                <div class="h-full w-full">
                    <slot :name="'column-' + idx + '--content'" :index="idx" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    columns: {
        type: Number,
        required: true,
    },
    height: {
        type: String,
        default: "100%",
        required: false,
    },
});
</script>
