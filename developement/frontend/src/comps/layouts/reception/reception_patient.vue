<template>
    <div>
        <IconField>
            <InputIcon class="pi pi-search z-10" />
            <AutoComplete v-model="selectedPatient" forceSelection optionLabel="name" :suggestions="searchResults"
                :disabled="patientDataLoading" @option-select="getPatientData" @complete="search"
                :pt="{ pcInput: { style: { 'margin-left': '20px' } } }">
                <template #option="slotProps">
                    <div class="grid grid-flow-col auto-cols-max gap-3">
                        <Tag severity="success" :value="slotProps.option.id"></Tag>
                        <b>{{ slotProps.option.name }}</b>
                        <span>{{ parseDate(slotProps.option.birthdate) }}</span>
                    </div>
                </template>
            </AutoComplete>
        </IconField>
    </div>
    <div class="flex h-full">
        <ProgressSpinner v-if="patientDataLoading" strokeWidth="4" animationDuration=".5s" class="self-center" />
        <PatientInfo v-if="patientData && !patientDataLoading" :patientData="patientData" />
    </div>
</template>

<script setup>
import useApi from '@/composables/apiComposable.js'
import parseDate from '@/composables/dateComposable.js'
import PatientInfo from '@/comps/shared/layouts/patient_info_basic.vue'

const patientDataLoading = ref(false)
const selectedPatient = ref()
const searchResults = ref([])
const patientData = ref()

const search = async (event) => {
    searchResults.value = await useApi.get('patients/search?query=' + event.query);
}

const getPatientData = async (event) => {
    patientDataLoading.value = true
    patientData.value = await useApi.get('patients/' + event.value.id)
    patientDataLoading.value = false
    selectedPatient.value = null
}

</script>