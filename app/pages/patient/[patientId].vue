<script setup>
const route = useRoute();
const patientId = route.params.patientId;
const encounterId = route.query.encounterId;
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
        >
            <PatientEncounter v-if="encounterId" :encounterId="encounterId" />
        </UCard>
    </div>
</template>
