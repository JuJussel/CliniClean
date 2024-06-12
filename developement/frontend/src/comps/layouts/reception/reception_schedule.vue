<template>
    <div>
        <DataTable :value="schedule" :loading="loading">
            <Column field="patient.name" :header="$t('name')"></Column>
            <Column field="type" :header="$t('encounterType')">
                <template #body="slotProps">
                    <span> {{ parseExamType(slotProps.data.type) }} </span>
                </template>
            </Column>
            <Column field="status" :header="$t('status')">

                <template #body="slotProps">
                    <Button v-if="useAcl(2) && slotProps.status === 10">

                    </Button>
                    <cui-tag v-else-if="slotProps.status === 0" :value="$t('paymentDone')" />
                    <Select v-else v-model="slotProps.data.status" :options="examStatiOptions(slotProps.data.status)"
                        optionLabel="name" optionValue="status" @change="changeStatus" class="w-full md:w-14rem">
                        <template #value="slotProps">
                            <span> {{ parseStatusLabel(slotProps.value) }} </span>
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
    </div>
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

const listStore = useListStore()

const loading = ref(false)
const schedule = ref([])

getSchedule()

async function getSchedule() {
    loading.value = true
    const start = dayjs().startOf('day');
    const end = dayjs().endOf('day');
    const range = 'start=' + start.$d + '&end=' + end.$d;

    schedule.value = await useApi.get("encounters/range?" + range)
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

function changeStatus(selection) {
    console.log(selection);
}



</script>

<style>
.selectColor {
    background: red
}
</style>