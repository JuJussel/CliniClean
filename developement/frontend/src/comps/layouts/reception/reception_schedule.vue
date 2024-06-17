<template>
    <DataTable :value="schedule" :loading="loading" scrollable scrollHeight="flex">
        <template #empty>
            <div class="flex justify-center">
                <img src="@/assets/img/empty2.jpg" alt="Nothing here" class="w-2/5">
            </div>
        </template>
        <Column field="patient.name" :header="$t('name')"></Column>
        <Column field="type" :header="$t('encounterType')">
            <template #body="slotProps">
                <span> {{ parseExamType(slotProps.data.type) }} </span>
            </template>
        </Column>
        <Column field="status" :header="$t('status')">

            <template #body="slotProps">
                <Button v-if="useAcl(2) && slotProps.data.status === 10">

                </Button>
                <Tag v-else-if="slotProps.data.status === 0" :value="$t('paymentDone')" />
                <Select v-else modelValue="slotProps.data.status" :options="examStatiOptions(slotProps.data.status)"
                    optionLabel="name" optionValue="status" @change="changeStatus($event, slotProps.data)"
                    class="w-full md:w-14rem" :SelectChangeEvent="changeStatus">
                    <template #value>
                        <span> {{ parseStatusLabel(slotProps.data.status) }} </span>
                    </template>
                </Select>
            </template>
        </Column>
        <Column field="lastChange" :header="$t('waitTime')">

            <template #body="slotProps">
                <span> {{ parseWaitTime(slotProps.data.lastChange).time }} </span>
            </template>
        </Column>
        <Column field="date" :header="$t('receptionTime')">

            <template #body="slotProps">
                <span> {{ dayjs(slotProps.data.date).format("HH時mm分") }} </span>
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="receptionAcceptModal" modal :header="$t('reception') + $t('register')" class="w-3/5">
        <ReceptionAcceptReservation v-bind:encounter="receptionAcceptModal" @close="receptionAcceptModal = null"
            @commit="" />
    </Dialog>
</template>

<script setup>

// TODO: 
// Color for select :: pt = "{ root: { style: 'background: #E29578; border: none' }, label: { style: 'color: white' }, dropdown: { style: 'color: white' } }"
// Filter for table
// Doctor list

import useAcl from "@/composables/aclComposable.js"
import useApi from "@/composables/apiComposable.js"
import dayjs from "dayjs"
import Select from 'primevue/select';
import ReceptionAcceptReservation from './modals/reception_acp_res.vue'

const listStore = useListStore()

const loading = ref(false)
const schedule = ref([])
const receptionAcceptModal = ref(null)

getSchedule()

async function getSchedule() {
    loading.value = true
    const start = dayjs().startOf('day');
    const end = dayjs().endOf('day');
    const range = 'start=' + start.$d + '&end=' + end.$d;

    schedule.value = await useApi.get("encounters/range?" + range)

    loading.value = false
}

function parseExamType(type) {
    const types = listStore.listData.encounterTypes;
    let string = "";
    string = types?.find((item) => item.id == type).name;
    return string;
}

function parseWaitTime(change) {
    let time = dayjs(change).fromNow(true);
    let diff = dayjs().diff(dayjs(change), "minutes");
    return {
        time: time,
        diff: diff,
    };
}

function parseStatusLabel(status) {
    const statusData = listStore.listData.encounterStati.find((item) => item[0].status === status)
    return statusData[0].name
}

function examStatiOptions(currentStatus) {
    const encounterStati =
        listStore.listData.encounterStati;
    let status = encounterStati.find(
        (item) => item[0].status === currentStatus
    );
    return status;
}

async function changeStatus(seletection, row) {
    if (seletection.value === 3 && row.type === 6) seletection.value = 4;
    if (seletection.value === 2) {
        receptionAcceptModal.value = row
    } else {
        commitEncounter(seletection)
    }
}

async function commitEncounter(encounter) {
    loading.value = true
    console.log(encounter);
    // await useApi.put('encounters/' + encounter.id, encounter)
    getSchedule()

}



</script>