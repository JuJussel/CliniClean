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
                        <div v-if="!searching" class="grid grid-flow-col auto-cols-max gap-3">
                            <Tag severity="success" :value="slotProps.option.id"></Tag>
                            <b>{{ slotProps.option.name }}</b>
                            <span>{{ parseDate(slotProps.option.birthdate) }}</span>
                        </div>
                        <div v-else>
                            <Skeleton width="20rem" height="2rem" class="mb-2"></Skeleton>
                            <Skeleton width="20rem" height="2rem" class="mb-2"></Skeleton>
                            <Skeleton width="20rem" height="2rem" class="mb-2"></Skeleton>
                        </div>
                    </template>
                </AutoComplete>
                <Button icon="pi pi-plus" severity="secondary" @click="triggerPatientEdit" />
            </InputGroup>
            <div v-if="patientData" class="flex items-center gap-2">
                <Tag severity="success" :value="patientData.id"></Tag>
                <span class="font-bold">{{ patientData.name }}</span>
            </div>
        </div>
        <div v-if="patientData" class="grid grid-flow-col auto-cols-auto gap-2">
            <Button :label="$t('reception')" @click="triggerNewWalkin" raised class="w-24" />
            <Button :label="$t('reservation')" @click="triggerNewReservation" severity="secondary" raised />
            <Button :label="$t('edit')" @click="triggerPatientEdit()" severity="secondary" raised />
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
    <Dialog v-model:visible="modals.patientEdit.open" modal :header="$t('patientEdit')" class="w-[72rem]"
        :closable="false">
        <EditPatient :patient="patientData" @patientCreated="getPatientData" @close="modals.patientEdit.open = false" />
    </Dialog>
    <Dialog v-model:visible="modals.reservation.open" modal :header="$t('reservation')" class="w-[72rem]"
        :closable="false">
        <NewReservation :patient="patientData" @commit="" @close="modals.reservation.open = false" />
    </Dialog>



</template>

<script setup>
import useApi from '@/composables/apiComposable.js'
import parseDate from '@/composables/dateComposable.js'
import PatientInfo from './reception_patient_info.vue'
import NewWalkin from './modals/reception_new_walkin.vue'
import EditPatient from './modals/reception_patient_new.vue'
import NewReservation from './modals/reception_new_reservation.vue'

const patientDataLoading = ref(false)
const searching = ref(false)
const selectedPatient = ref()
const searchResults = ref([])
const patientData = ref()
const encounterHistory = ref()
const modals = ref({
    walkin: { open: false },
    reservation: { open: false },
    patientEdit: { open: false },
})
const patientEditData = null

const search = async (event) => {
    searching.value = true
    searchResults.value = [0]
    searchResults.value = await useApi.get('patients/search?query=' + event.query)
    searching.value = false
}

const getPatientData = async (event) => {
    let patientId = event.value.id ? event.value.id : event
    patientDataLoading.value = true
    patientData.value = await useApi.get('patients/' + patientId)
    encounterHistory.value = await useApi.get('patients/' + patientId + '/encounters')
    patientDataLoading.value = false
    selectedPatient.value = null
}

const triggerNewWalkin = () => {
    modals.value.walkin.insuranceSets =
        modals.value.walkin.open = true
}

const triggerNewReservation = () => {
    modals.value.reservation.open = true
}
const triggerPatientEdit = () => {
    modals.value.patientEdit.open = true
}
const showPatientDetails = (patient = null) => {
}


</script>