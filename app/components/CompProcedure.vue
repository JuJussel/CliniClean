<script setup>
const systemStore = useSystemStore();

const props = defineProps({
    procedures: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['delete', 'order', 'billing']);

const hasData = (item) => {
    return item.varData?.length > 0 || item.varData?.type || item.varData?.location;
};

const openOrder = (event, index) => {
    event.stopPropagation();
    emit('order', { event, index });
};

const openBilling = (event, index) => {
    event.stopPropagation();
    emit('billing', { event, index });
};

const deleteProcedure = (event, index) => {
    event.stopPropagation();
    emit('delete', { event, index });
};

// Dynamic part components - uncomment and import when part files are created
// import Exam from "./parts/procedure_exam.vue";
// import Perscription from "./parts/procedures_perscription.vue";
// import Shot from "./parts/procedures_shot.vue";
//
// const parts = {
//     exam: Exam,
//     perscription: Perscription,
//     shot: Shot,
//     prevVac: Shot
// };
</script>

<template>
    <div class="border border-[var(--ui-border)] rounded-md h-full">
        <UAccordion
            :items="procedures"
            multiple
        >
            <template #default="{ item, index }">
                <div class="flex justify-between items-center w-full pr-2">
                    <div class="flex items-center gap-3">
                        <UTooltip v-if="hasData(item)" :text="$t('hasData')">
                            <UIcon
                                :name="systemStore?.icons?.[item.cat?.label] || 'material-symbols:description'"
                                class="text-[var(--ui-primary)] size-5"
                            />
                        </UTooltip>
                        <UIcon
                            v-else
                            :name="systemStore?.icons?.[item.cat?.label] || 'material-symbols:description'"
                            class="size-5"
                        />
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <UButton
                            v-if="item.cat?.code !== 25"
                            @click="openOrder($event, index)"
                            icon="material-symbols:shopping-cart"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                        />
                        <UButton
                            @click="openBilling($event, index)"
                            icon="material-symbols:currency-yen"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                        />
                        <UButton
                            @click="deleteProcedure($event, index)"
                            icon="material-symbols:delete"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                        />
                    </div>
                </div>
            </template>
            <template #content="{ item }">
                <div class="p-3 space-y-3">
                    <!-- Dynamic part components - uncomment when part files are created -->
                    <!-- <component :is="parts[item.cat?.label]" :item /> -->

                    <div>
                        <label class="block text-sm font-medium mb-1">{{ $t('note') }}</label>
                        <UTextarea v-model="item.note" :rows="1" />
                    </div>
                </div>
            </template>
        </UAccordion>
    </div>
</template>
