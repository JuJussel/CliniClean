<template>
    <div class="layout-columns w-full" :style="{ height }">
        <div class="grid h-full w-full gap-4" :class="`grid-cols-${columns}`">
            <div v-for="idx in columns" :key="idx" class="h-full w-full">
                <Card class="h-full w-full">
                    <template #title>
                        <slot :name="'column-' + idx + '-title'" :index="idx" />
                    </template>
                    <template #content>
                        <div :class="noPadding ? 'm-[-20px]' : ''">
                            <slot
                                :name="'column-' + idx + '-content'"
                                :index="idx"
                            />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";
import Card from "primevue/card";

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
    noPadding: {
        type: Boolean,
        default: false,
        required: false,
    },
});
</script>
