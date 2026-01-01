<template>
    <div>
        {{ patientStore.fullName || "No patient selected" }}
    </div>
</template>

<script setup>
const patientStore = usePatientStore();
</script>
