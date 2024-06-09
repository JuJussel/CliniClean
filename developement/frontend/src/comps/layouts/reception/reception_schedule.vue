<template>
    <div>
        <DataTable :value="schedule">
            <Column field="patient.name" header="Code"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="quantity" header="Quantity"></Column>
        </DataTable>
    </div>
</template>

<script setup>

import useApi from "@/composables/apiComposable.js"
import dayjs from "dayjs"

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

</script>