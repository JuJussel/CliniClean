<template>
    <Chip class="mr-4 h-[40px] flex justify-between	">
        <Button :loading="loading" icon="pi pi-bars" text severity="secondary" />
        <ProgressBar v-if="loading" :showValue="false" :value="progress" class="w-40 !h-2"></ProgressBar>
        <div v-else-if="encounterStore.encounterData">
            <ButtonGroup>
                <Button :label="encounterStore.patientData.name" @click="uiStore.activeTab = encounter" text
                    severity="secondary" />
                <Button v-tooltip.bottom="$t('nextPatient')" icon="pi pi-angle-double-right" text severity="primary" />
            </ButtonGroup>
        </div>
        <Button v-else :disabled="loading" :label="$t('startEncounter')" icon="pi pi-play" text severity="primary"
            iconPos="right" @click="startFirstEncounter" class="w-40" />
    </Chip>
</template>

<script setup>

import useApi from "@/composables/apiComposable.js"
const encounterStore = useEncounterStore()
const patientStore = usePatientStore()
const uiStore = useUiStore()
import encounter from '@/comps/layouts/encounter'
import ButtonGroup from 'primevue/buttongroup';

const loading = ref(false)
const progress = ref(10)

const startFirstEncounter = async () => {
    // Needs to select the first encounter of the day (time filter?) - or the first one in the waiting list
    // and change the status and start the encounter
    // Not done yet
    // Basically there is always an encounter active - unless user clicks "end encounter and don't go to next one"
    // In that case the click needs to start the next encounter in the list..
    progress.value = 10
    loading.value = true
    encounterStore.encounterData = null
    const encounterId = "6707733894ff22f1937f7bab"
    let encounterData = await useApi.get('encounters/' + encounterId)
    progress.value = 50
    let patientData = await useApi.get('patients/' + encounterData.patient.id)
    progress.value = 80
    encounterStore.patientData = patientData
    patientStore.activePatientDataBasic = patientData
    await useApi.put('encounters/' + encounterId, { status: 3 })
    progress.value = 90
    encounterData = await useApi.get('encounters/' + encounterId)
    progress.value = 100
    encounterStore.encounterData = encounterData
    uiStore.activeTab = encounter
    loading.value = false
}
</script>