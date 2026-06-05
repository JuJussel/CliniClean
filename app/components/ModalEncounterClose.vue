<script setup>
import { ref, computed } from "vue";

const systemStore = useSystemStore();
const toast = useToast();
const emit = defineEmits(["close"]);

const props = defineProps({
    encounter: {
        type: Object,
        required: true,
    },
});

const selectedStatus = ref(4);
const submitting = ref(false);
const isCommitted = ref(false);
const openEncounters = ref([]);
const loadingEncounters = ref(false);
const dayjs = useDayjs();

const columns = [
    {
        accessorKey: "patient.id",
        header: $t("id"),
    },
    {
        accessorKey: "name",
        header: $t("name"),
    },
    {
        accessorKey: "date",
        header: $t("receptionTime"),
    },
    {
        accessorKey: "status",
        header: $t("status"),
    },
];

const selectedStatusItem = computed(() => {
    return systemStore.system?.ui?.encounterStati?.find(
        (status) => status.id === selectedStatus.value,
    );
});

async function fetchOpenEncounters() {
    loadingEncounters.value = true;
    try {
        const start = dayjs().startOf("day").toISOString();
        const end = dayjs().endOf("day").toISOString();
        const response = await $fetch(`/api/encounter/range?start=${start}&end=${end}`);
        // Filter encounters where status < 3
        openEncounters.value = (response || []).filter(e => e.status < 3);
    } catch (e) {
        console.error("Error fetching open encounters:", e);
    } finally {
        loadingEncounters.value = false;
    }
}

async function onCommit() {
    if (!props.encounter?._id) return;

    submitting.value = true;
    try {
        const response = await $fetch(`/api/encounter/${props.encounter._id}`, {
            method: "POST",
            body: {
                status: selectedStatus.value,
            },
        });

        if (response.success) {
            // Update local object so changes reflect immediately in parent components
            props.encounter.status = selectedStatus.value;
            toast.add({ title: $t("saved") });
            isCommitted.value = true;
            await fetchOpenEncounters();
        } else {
            throw new Error(response.error || "Failed to update encounter status");
        }
    } catch (e) {
        console.error("Error closing encounter:", e);
        toast.add({ title: e.message || "Error saving encounter status", color: "error" });
    } finally {
        submitting.value = false;
    }
}

async function onEncounterClick(enc) {
    if (!enc.patient?.id || !enc._id) return;
    
    // Close the modal without triggering parent's redirect to reception list
    emit("close", { success: false });
    
    // Redirect to the selected patient's encounter
    await navigateTo(`/patient/${enc.patient.id}?encounterId=${enc._id}`);
}

function getStatusItem(statusId) {
    return systemStore.system?.ui?.encounterStati?.find(
        (status) => status.id === statusId,
    );
}
</script>

<template>
    <UModal v-if="systemStore.system">
        <template #title>
            <div class="flex items-center gap-2">
                <UIcon
                    :name="systemStore.icons?.encounter || 'material-symbols-light:outpatient-med-outline'"
                    class="size-5 text-primary"
                />
                {{ isCommitted ? $t("openEncountersToday") : $t("closeEncounter") }}
            </div>
        </template>

        <template #body>
            <div v-if="isCommitted" class="space-y-4">
                <div v-if="loadingEncounters" class="flex flex-col gap-2 p-4">
                    <USkeleton class="h-6 w-full" />
                    <USkeleton class="h-10 w-full" />
                    <USkeleton class="h-10 w-full" />
                </div>
                <div v-else>
                    <div v-if="openEncounters.length > 0" class="border border-neutral-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <UTable
                            :columns="columns"
                            :data="openEncounters"
                            class="cursor-pointer"
                            @select="(event, row) => onEncounterClick(row.original)"
                        >
                            <template #name-cell="{ row }">
                                <span>
                                    {{ row.original.patient?.name?.family || "" }} {{ row.original.patient?.name?.given || "" }}
                                </span>
                            </template>
                            <template #date-cell="{ row }">
                                <span>
                                    {{ dayjs(row.original.date).format("HH:mm") }}
                                </span>
                            </template>
                            <template #status-cell="{ row }">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="inline-block w-2.5 h-2.5 rounded-full"
                                        :style="{ backgroundColor: 'var(' + getStatusItem(row.original.status)?.color + ')' }"
                                    />
                                    <span :style="{ color: 'var(' + getStatusItem(row.original.status)?.color + ')' }">
                                        {{ $t(getStatusItem(row.original.status)?.label) || getStatusItem(row.original.status)?.label }}
                                    </span>
                                </div>
                            </template>
                        </UTable>
                    </div>
                    <div v-else class="p-6 text-center text-sm text-neutral-500 dark:text-slate-400 border border-dashed border-neutral-200 dark:border-slate-800 rounded-lg">
                        {{ $t("noOpenEncountersToday") }}
                    </div>
                </div>
            </div>

            <div v-else class="space-y-4">
                <p class="text-sm text-neutral-600 dark:text-neutral-300">
                    {{ $t("confirmEncounterClose") }}
                </p>

                <UFormField :label="$t('status')">
                    <USelect
                        v-model="selectedStatus"
                        :items="systemStore.system.ui.encounterStati || []"
                        valueKey="id"
                        labelKey="label"
                        class="w-full"
                    >
                        <template #item-label="{ item }">
                            <div class="flex items-center gap-2">
                                <span
                                    class="inline-block w-2.5 h-2.5 rounded-full"
                                    :style="{ backgroundColor: 'var(' + item.color + ')' }"
                                />
                                <span>{{ $t(item.label) || item.label }}</span>
                            </div>
                        </template>
                        <div class="flex items-center gap-2">
                            <span
                                v-if="selectedStatusItem"
                                class="inline-block w-2.5 h-2.5 rounded-full"
                                :style="{ backgroundColor: 'var(' + selectedStatusItem.color + ')' }"
                            />
                            <span>{{ selectedStatusItem ? $t(selectedStatusItem.label) : $t('select') }}</span>
                        </div>
                    </USelect>
                </UFormField>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <template v-if="isCommitted">
                    <UButton
                        color="primary"
                        @click="emit('close', { success: true })"
                    >
                        {{ $t("close") }}
                    </UButton>
                </template>
                <template v-else>
                    <UButton
                        color="neutral"
                        variant="outline"
                        @click="emit('close')"
                        :disabled="submitting"
                    >
                        {{ $t("cancel") }}
                    </UButton>
                    <UButton
                        color="primary"
                        :loading="submitting"
                        @click="onCommit"
                    >
                        {{ $t("commit") }}
                    </UButton>
                </template>
            </div>
        </template>
    </UModal>
</template>

<style scoped>
</style>