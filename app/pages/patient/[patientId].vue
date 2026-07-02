<script setup>
import { ref, watch, provide } from "vue";

definePageMeta({
    key: (route) => route.params.patientId,
});

const route = useRoute();
const patientId = route.params.patientId;
const initialEncounterId = route.query.encounterId;

const encounters = ref([]);
const activeEncounterId = ref("");

// Helper to determine if an encounter tab can be closed
const isClosable = (encounter) => {
    if (!encounter) return false;
    return encounter.status !== 3 && encounter._id !== initialEncounterId;
};

// Helper to load/add an encounter to the tabs list
const loadAndAddEncounter = async (id) => {
    if (!id) return;
    
    // Check if it already exists in the tabs list
    const existing = encounters.value.find(e => e._id === id);
    if (existing) {
        activeEncounterId.value = id;
        return;
    }

    try {
        const encounterData = await $fetch('/api/encounter/' + id);
        if (encounterData) {
            // Mark as readOnly if it is not the active encounter (status !== 3)
            if (encounterData.status !== 3) {
                encounterData.readOnly = true;
            }
            encounters.value.push(encounterData);
            activeEncounterId.value = id;
        }
    } catch (error) {
        console.error("Error fetching encounter for tabs:", error);
    }
};

provide('openEncounterInTabs', loadAndAddEncounter);

// Watch for query parameter changes to dynamically load and activate tabs
watch(
    () => route.query.encounterId,
    async (newId) => {
        if (newId) {
            await loadAndAddEncounter(newId);
        }
    },
    { immediate: true }
);

// Provide a reload function for the active encounter slot (e.g. after adding a procedure)
const refreshEncounter = async () => {
    const currentId = activeEncounterId.value;
    if (!currentId) return;

    try {
        const encounterData = await $fetch('/api/encounter/' + currentId);
        if (encounterData) {
            const index = encounters.value.findIndex(e => e._id === currentId);
            if (index !== -1) {
                const wasReadOnly = encounters.value[index].readOnly;
                if (wasReadOnly || encounterData.status !== 3) {
                    encounterData.readOnly = true;
                }
                encounters.value[index] = encounterData;
            }
        }
    } catch (error) {
        console.error("Error refreshing encounter:", error);
    }
};
provide('refreshEncounter', refreshEncounter);

// Close tab handler
const closeTab = (id) => {
    const index = encounters.value.findIndex(e => e._id === id);
    if (index !== -1) {
        const encounter = encounters.value[index];
        if (!isClosable(encounter)) return;

        encounters.value.splice(index, 1);
        // If the closed tab was the active one, select another tab
        if (activeEncounterId.value === id) {
            if (encounters.value.length > 0) {
                activeEncounterId.value = encounters.value[encounters.value.length - 1]._id;
            } else {
                activeEncounterId.value = "";
            }
        }
    }
};
</script>

<template>
    <div class="h-full grid grid-cols-2 gap-4 min-h-0">
        <UCard
            :ui="{
                root: 'flex flex-col h-full min-h-0',
                body: 'flex-1 min-h-0'
            }"
            class="h-full"
        >
            <PatientMedical :patient-id="patientId" />
        </UCard>

        <UCard
            v-if="encounters.length > 0"
            :ui="{
                root: 'flex flex-col h-full min-h-0',
                body: 'flex-1 min-h-0'
            }"
            class="h-full"
        >
            <UTabs
                v-model="activeEncounterId"
                :items="encounters"
                value-key="_id"
                color="neutral"
                class="h-full flex flex-col min-h-0"
                :ui="{
                    root: 'flex flex-col h-full min-h-0',
                    content: 'flex-1 min-h-0'
                }"
            >
                <template #default="{ item }">
                    <div class="flex items-center gap-1.5 py-0.5">
                        <UIcon v-if="item.readOnly || item.status !== 3" name="material-symbols:lock-outline" class="size-3.5 text-neutral-400 dark:text-neutral-500" />
                        <span>{{ $dayjs(item.date).format('YYYY-MM-DD') }} </span>
                        <UButton
                            v-if="isClosable(item)"
                            icon="material-symbols:close-rounded"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                            class="p-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 ml-1"
                            @click.stop="closeTab(item._id)"
                        />
                    </div>
                </template>
                <template #content="{ item }">
                    <PatientEncounter :encounter="item" />
                </template>
            </UTabs>

        </UCard>
    </div>
</template>
