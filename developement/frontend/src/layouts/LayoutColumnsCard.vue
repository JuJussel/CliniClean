<template>
    <div class="layout-columns w-full" :style="{ height }">
        <div class="grid h-full w-full gap-4" :class="`grid-cols-${columns}`">
            <div
                v-for="idx in columns"
                :key="idx"
                class="h-full w-full overflow-hidden min-h-0 flex flex-col gap-2"
            >
                <!-- Header Card for this column -->
                <template v-if="$slots[`column-${idx}-header`]">
                    <Card class="w-full" style="height: 80px; flex-shrink: 0">
                        <template #content>
                            <div>
                                <slot
                                    :name="`column-${idx}-header`"
                                    :index="idx"
                                />
                            </div>
                        </template>
                    </Card>
                </template>
                <!-- Content Card for this column -->
                <Card
                    class="w-full flex-1 min-h-0"
                    :style="{
                        height: getContentHeight(idx),
                        minHeight: 0,
                        overflow: 'auto',
                    }"
                >
                    <template #content>
                        <slot :name="`column-${idx}-content`" :index="idx" />
                    </template>
                </Card>
                <!-- Footer Card for this column -->
                <template v-if="$slots[`column-${idx}-footer`]">
                    <Card class="w-full" style="height: 150px; flex-shrink: 0">
                        <template #content>
                            <slot :name="`column-${idx}-footer`" :index="idx" />
                        </template>
                    </Card>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, useSlots } from "vue";
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
});

const slots = useSlots();

function getContentHeight(idx) {
    const headerExists = !!slots[`column-${idx}-header`];
    const footerExists = !!slots[`column-${idx}-footer`];
    if (headerExists && footerExists) return "calc(100vh - 300px)";
    if (headerExists || footerExists) return "calc(100vh - 150px)";
    return "100vh";
}
</script>
