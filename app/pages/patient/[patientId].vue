<script setup>
definePageMeta({
    key: (route) => `${route.params.patientId}-${route.query.encounterId || ""}`,
});

const route = useRoute();
const patientId = route.params.patientId;
const encounterId = route.query.encounterId;

const encounters = ref([])

onMounted(async () => {
    if (encounterId) {
        console.log(encounterId);
        
        try {
            let encounterData = await fetch('/api/encounter/' + encounterId)
            encounterData = await encounterData.json();
            encounters.value.push(encounterData)
        } catch (error) {
            console.log(error)
        }
    }
})

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
            <PatientMedical :patientId="patientId" />
        </UCard>

        <UCard
            :ui="{
                root: 'flex flex-col h-full min-h-0',
                body: 'flex-1 min-h-0'
            }"
            class="h-full"
            v-if="encounters.length > 0"
        >
            <UTabs
                :items="encounters"
                color="neutral"
                class="h-full flex flex-col min-h-0"
                :ui="{
                    root: 'flex flex-col h-full min-h-0',
                    content: 'flex-1 min-h-0'
                }"
            >
              <template #default="{ item }">
                    <span>{{ $dayjs(item.date).format('YYYY-MM-DD') }} </span>
                </template>
                <template #content="{ item }">
                    <PatientEncounter :encounter="item" />
                </template>
            </UTabs>

        </UCard>
    </div>
</template>
