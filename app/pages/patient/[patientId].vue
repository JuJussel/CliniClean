<script setup>

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
    <div class="h-full grid grid-cols-2 gap-4">
        <UCard
            :ui="{
                body: 'h-full',
            }"
        >
            <PatientMedical :patientId="patientId" />
        </UCard>

        <UCard
            :ui="{
                body: 'h-full',
            }"
            v-if="encounters.length > 0"
        >
            <UTabs
                :items="encounters"
                color="neutral"
                class="h-full"
                :ui="{
                    content: 'h-full',
                }"
            >
              <template #default="{ item }">
                    <span>{{ $dayjs(item.date).format('YYYY-MM-DD') }} </span>
                </template>
                <template #content="{ item }">
                    <PatientEncounter :encounterId="item" />
                </template>
            </UTabs>

        </UCard>
    </div>
</template>
