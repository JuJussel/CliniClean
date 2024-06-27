<template>
    <div class="flex justify-between items-center mb-8">
        <div class="grid grid-cols-2 gap-2">
            <InputGroup>
                <InputGroupAddon>
                    <i class="pi pi-search" />
                </InputGroupAddon>
                <AutoComplete v-model="selectedPatient" forceSelection optionLabel="name" :suggestions="searchResults"
                    :disabled="patientDataLoading" @option-select="getPatientData" @complete="search"
                    :pt="{ pcInput: { style: { 'margin-left': '20px' } } }" :placeholder="$t('patientSearch')">
                    <template #option="slotProps">
                        <div class="grid grid-flow-col auto-cols-max gap-3">
                            <Tag severity="success" :value="slotProps.option.id"></Tag>
                            <b>{{ slotProps.option.name }}</b>
                            <span>{{ parseDate(slotProps.option.birthdate) }}</span>
                        </div>
                    </template>
                </AutoComplete>
                <Button icon="pi pi-plus" severity="secondary" />
            </InputGroup>
            <div v-if="patientData" class="flex items-center gap-2">
                <Tag severity="success" :value="patientData.id"></Tag>
                <span class="font-bold">{{ patientData.name }}</span>
            </div>
        </div>
        <div v-if="patientData" class="grid grid-flow-col auto-cols-auto gap-2">
            <Button :label="$t('reception')" @click="triggerNewWalkin" raised class="w-24" />
            <Button :label="$t('reservation')" @click="triggerNewReservation" severity="secondary" raised />
            <Button :label="$t('edit')" @click="triggerPatientEdit" severity="secondary" raised />
            <Button :label="$t('details')" @click="showPatientDetails" severity="secondary" raised />
        </div>
    </div>
    <div>
        <div v-if="patientDataLoading" class="mt-10 grid grid-cols-2 gap-4">
            <div>
                <Skeleton class="mb-2"></Skeleton>
                <Skeleton width="10rem" height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="5rem" height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="15rem" height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="4rem" class="mb-2"></Skeleton>
                <Skeleton width="20rem" class="mb-2"></Skeleton>
                <Skeleton width="10rem" height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="8rem" height="2rem" class="mb-2"></Skeleton>
            </div>
            <div>
                <Skeleton class="mb-2"></Skeleton>
                <Skeleton height="8rem"></Skeleton>
                <Skeleton class="mb-2 mt-10"></Skeleton>
                <Skeleton height="8rem"></Skeleton>
            </div>

        </div>
        <PatientInfo v-if="patientData && !patientDataLoading" :patientData="patientData"
            :encounterHistory="encounterHistory" />
    </div>
    <Dialog v-model:visible="modals.walkin.open" modal :header="$t('newReception')" class="w-[72rem]" :closable="false">
        <NewWalkin :patient="patientData" @commit="" @close="modals.walkin.open = false" />
    </Dialog>
    <Dialog v-model:visible="modals.patientEdit.open" modal :header="$t('newReception')" class="w-[72rem]"
        :closable="false">
        <NewWalkin :patient="patientData" @commit="" @close="modals.walkin.open = false" />
    </Dialog>


</template>

<script setup>
import useApi from '@/composables/apiComposable.js'
import parseDate from '@/composables/dateComposable.js'
import PatientInfo from './reception_patient_info.vue'
import NewWalkin from './modals/reception_new_walkin.vue'

const patientDataLoading = ref(false)
const selectedPatient = ref()
const searchResults = ref([])
const patientData = ref()
const encounterHistory = ref()
const modals = ref({
    walkin: { open: false },
    reservation: { open: false },
    patientEdit: { open: false }
})

const search = async (event) => {
    searchResults.value = await useApi.get('patients/search?query=' + event.query);
}

const getPatientData = async (event) => {
    patientDataLoading.value = true
    patientData.value = await useApi.get('patients/' + event.value.id)
    encounterHistory.value = await useApi.get('patients/' + event.value.id + '/encounters');
    patientDataLoading.value = false
    selectedPatient.value = null
}

const triggerNewWalkin = () => {
    modals.value.walkin.insuranceSets =
        modals.value.walkin.open = true
}

const triggerNewReservation = () => {

}
const triggerPatientEdit = () => {
    modals.patientEdit.open = true
}
const showPatientDetails = () => {

}


</script>