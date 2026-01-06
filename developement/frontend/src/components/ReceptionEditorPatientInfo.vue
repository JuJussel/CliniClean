<template>
    <div>
        {{ patientStore.fullName || "No patient selected" }}
        <div v-if="patientStore.basic.loading">
            <Skeleton height="2rem" />
            <Skeleton height="1.5rem" />
            <Skeleton height="1.5rem" />
        </div>
    </div>
</template>

<script setup>
const patientStore = usePatientStore();

patientStore.getBasic();
</script>
