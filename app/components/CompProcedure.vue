<script setup>
const systemStore = useSystemStore();

const props = defineProps({
    procedures: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['delete', 'order', 'billing']);

// ── Helpers ──────────────────────────────────────────────────────
const hasData = (item) => {
    return item.varData?.length > 0 || item.varData?.type || item.varData?.location;
};
const examsLoading = ref(false)

// ── Event handlers ───────────────────────────────────────────────
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

// ── Prescription computed ────────────────────────────────────────
const perscriptionTypes = computed(() => {
    const rawTypes = systemStore?.system?.ui.perscriptionTypes || [];
    return rawTypes.map(t => ({
        label: t.name,
        value: t
    }));
});

const perscriptionTimings = computed(() => {
    return systemStore?.system?.ui.perscriptionTimings || [];
});

const filteredTimings = (item) => {
    const typeCode = item.varData?.type?.code;
    if (typeCode) {
        return perscriptionTimings.value
            .filter(t => t.typeCode === typeCode)
            .map(t => ({
                label: t.name,
                value: t
            }));
    }
    return [];
};

// ── Shot computed ────────────────────────────────────────────────
const shotLocations = computed(() => {
    return systemStore?.system?.ui.shotLocations || [];
});

// ── Exam data ────────────────────────────────────────────────────
// Cache exam results per srycd so we don't re-fetch on every toggle
const examResultsCache = reactive({});

// TODO: The old version used a separate API (useApi.get('procedures/' + srycd))
// that returned exam result items with { result.shared.name, result.single.name, unit, value }.
// A dedicated endpoint (e.g. /api/procedure/results) needs to be created to match that data shape.
const loadExamResults = async (item) => {
    if (!item.srycd || examResultsCache[item.srycd]) return;
    examsLoading.value = true

    try {
        const res = await $fetch(`/api/procedure/exam?srycd=${item.srycd}`);
        let resultsList = (res.data || []).map((r) => {
            r.resultName = r.result?.shared?.name || r.name;
            if (r.resultName === '分析物固有結果コード') {
                r.resultName = r.result?.single?.name || r.name;
            }
            return r;
        });
        // De-duplicate by resultName
        resultsList = resultsList.filter((value, index, self) =>
            index === self.findIndex((t) => t.resultName === value.resultName)
        );
        examResultsCache[item.srycd] = resultsList;
    } catch (error) {
        console.error('[CompProcedure] Failed to load exam results:', error.message);
        examResultsCache[item.srycd] = [];
    } finally {
        examsLoading.value = false
    }
};

const examResultColumns = [
    { accessorKey: 'resultName', header: $t('resultName') },
    { accessorKey: 'value', header: $t('value') },
];
</script>

<template>
    <div class="border border-[var(--ui-border)] rounded-md h-full">
        <UAccordion
            :items="procedures"
            multiple
        >
            <template #default="{ item, index }">
                <div class="flex justify-between items-center w-full px-4">
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

                    <!-- ═══ Shot / PrevVac ═══ -->
                    <div v-if="item.cat?.label === 'shot' || item.cat?.label === 'prevVac'" class="flex gap-4 flex-wrap">
                        <div>
                            <label class="block text-sm font-medium mb-1">{{ $t('shotLocation') }}</label>
                            <USelect
                                v-model="item.varData.location"
                                :items="shotLocations"
                                :placeholder="$t('shotLocation')"
                                class="w-40"
                            />
                        </div>
                        <div class="w-24">
                            <label class="block text-sm font-medium mb-1">{{ $t('shotAmount') }}</label>
                            <div class="flex items-center gap-1">
                                <UInput
                                    type="number"
                                    v-model="item.varData.amount"
                                    :disabled="!item.varData.location"
                                    class="flex-1"
                                />
                                <span v-if="item.taniname" class="text-sm text-muted">{{ $t('vial') }}</span>
                            </div>
                        </div>
                        <div class="w-24">
                            <label class="block text-sm font-medium mb-1">{{ $t('shotLot') }}</label>
                            <UInput
                                type="number"
                                v-model="item.varData.lot"
                                :disabled="!item.varData.location"
                            />
                        </div>
                    </div>

                    <!-- ═══ Prescription ═══ -->
                    <div v-else-if="item.cat?.label === 'perscription'" class="flex gap-4 flex-wrap">
                        <div>
                            <label class="block text-sm font-medium mb-1">{{ $t('perscriptionType') }}</label>
                            <USelect
                                v-model="item.varData.type"
                                :items="perscriptionTypes"
                                :placeholder="$t('perscriptionType')"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">{{ $t('perscriptionTiming') }}</label>
                            <USelect
                                v-model="item.varData.timing"
                                :items="filteredTimings(item)"
                                :disabled="!item.varData.type"
                                :placeholder="$t('perscriptionTiming')"
                                class="w-40"
                            />
                        </div>
                        <div class="w-24">
                            <label class="block text-sm font-medium mb-1">{{ $t('perscriptionAmount') }}</label>
                            <div class="flex items-center gap-1">
                                <UInput
                                    type="number"
                                    v-model="item.varData.amount"
                                    :disabled="!item.varData.type"
                                    class="flex-1"
                                />
                                <span v-if="item.taniname" class="text-sm text-muted">{{ item.taniname }}</span>
                            </div>
                        </div>
                        <div class="w-24">
                            <label class="block text-sm font-medium mb-1">{{ $t('perscriptionDuration') }}</label>
                            <div class="flex items-center gap-1">
                                <UInput
                                    type="number"
                                    v-model="item.varData.duration"
                                    :disabled="!item.varData.type"
                                    class="flex-1"
                                />
                                <span v-if="item.varData.timing?.unit" class="text-sm text-muted">{{ item.varData.timing?.unit }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- ═══ Exam ═══ -->
                    <div v-else-if="item.cat?.label === 'exam'">
                        <USelectMenu
                            v-model="item.varData"
                            :items="examResultsCache[item.srycd] || []"
                            labelKey="resultName"
                            multiple
                            :loading="examsLoading"
                            searchable
                            :placeholder="$t('exam') + $t('add')"
                            class="w-full mb-2"
                            @update:open="loadExamResults(item)"
                        />
                        <UTable
                            v-if="item.varData?.length > 0"
                            :data="item.varData"
                            :columns="examResultColumns"
                            class="w-full border border-[var(--ui-border)] rounded-lg"
                        >
                            <template #value-cell="{ row }">
                                <div v-if="row.original.order?.done"></div>
                                <div v-else class="flex items-center gap-1 w-[120px]">
                                    <UInput type="text" v-model="row.original.value" class="flex-1" />
                                    <span
                                        v-if="row.original.unit?.name && row.original.unit?.name !== '＊未設定'"
                                        class="text-sm text-muted"
                                    >
                                        {{ row.original.unit.name }}
                                    </span>
                                </div>
                            </template>
                        </UTable>
                    </div>

                    <!-- ═══ Note (always shown) ═══ -->
                    <div>
                        <label class="block text-sm font-medium mb-1">{{ $t('note') }}</label>
                        <UTextarea v-model="item.note" :rows="1" />
                    </div>
                </div>
            </template>
        </UAccordion>
    </div>
</template>
