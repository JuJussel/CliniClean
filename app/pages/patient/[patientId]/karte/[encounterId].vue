<script setup>
const route = useRoute();
const patientId = route.params.patientId;
const encounterId = route.params.encounterId;
</script>

<template>
    <div class="h-full">{{ patientId }} - {{ encounterId }}</div>
</template>
