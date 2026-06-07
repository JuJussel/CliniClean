<script setup>
import { ModalPatientReservation, ModalEncounterClose } from "#components";

const props = defineProps(["encounter"]);
const editable = ref(true);
const loading = ref(false);

const dayjs = useDayjs();
const overlay = useOverlay();


const addProcedure = (procedure) => {
    props.encounter.karte.procedures.push(procedure);
};

const saveState = () => {
    loading.value = true;
    try {
        fetch("/api/encounter/" + props.encounter._id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(props.encounter),
        });
    } catch (error) {
        console.error("Error saving state:", error);
    } finally {
        loading.value = false;
    }
};

async function openReservationModal() {
    const reservationModal = overlay.create(ModalPatientReservation, {
        destroyOnClose: true,
    });
    const action = await reservationModal.open({ patient: props.encounter.patient });

    if (!action) return;
}

async function openCloseEncounterModal() {
    const closeModal = overlay.create(ModalEncounterClose, {
        destroyOnClose: true,
    });
    const action = await closeModal.open({ encounter: props.encounter });

    if (action?.success) {
        await navigateTo("/reception");
    }
}


let saveTimeout = null;

watch(
    () => props.encounter.karte,
    () => {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveState();
        }, 2000);
    },
    { deep: true },
);
</script>

<template>
    <div v-if="encounter.status === 3" class="grid grid-cols-2 grid-rows-[1fr_auto] gap-4 h-full min-h-0">
        <div class="h-full min-h-0 row-span-2">
            <UCard
                :ui="{
                    root: 'flex flex-col h-full min-h-0',
                    body: 'flex-1 min-h-0 p-0 sm:p-0',
                }"
                class="h-full"
            >
                <template #header>
                    <h3 class="text-base font-semibold">
                        {{ $t("soap") }}
                    </h3>
                </template>

                <CompTextEditor v-model="encounter.karte.soap" class="h-full" />
            </UCard>
        </div>

        <div class="h-full min-h-0">
            <UCard
                :ui="{
                    root: 'flex flex-col h-full min-h-0',
                    body: 'flex-1 overflow-y-auto min-h-0',
                }"
                class="h-full"
            >
                <template #header>
                    <div class="flex items-center justify-between w-full">
                        <h3 class="text-base font-semibold">
                            {{ dayjs(encounter.date).format("LL") }}
                        </h3>
                        <USlideover>
                            <UButton
                                label="Add Entry"
                                color="neutral"
                                variant="subtle"
                            />
                            <template #content>
                                <CompProcedureBrowser
                                    class="h-full m-4"
                                    @selected="addProcedure"
                                />
                            </template>
                        </USlideover>
                    </div>
                </template>

                <CompProcedure :procedures="encounter.karte.procedures" />
            </UCard>
        </div>
        <div>
            <UCard>
                <div class="flex justify-end gap-3">
                    <UButton
                        :label="$t('reservation')"
                        color="neutral"
                        variant="subtle"
                        class="w-32 justify-center"
                        @click="openReservationModal"
                    />
                    <!-- ToDo -->
                    <UButton
                        :label="$t('print')"
                        color="neutral"
                        variant="subtle"
                        class="w-32 justify-center"
                    />
                    <!-- ToDo -->
                    <UButton
                        :label="$t('billing')"
                        color="neutral"
                        variant="subtle"
                        class="w-32 justify-center"
                    />
                    <UButton
                        :label="$t('next')"
                        color="primary"
                        class="w-32 justify-center"
                        @click="openCloseEncounterModal"
                    />
                </div>
            </UCard>
        </div>
    </div>
</template>
