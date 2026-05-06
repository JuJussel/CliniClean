<script setup>
const route = useRoute();
const patientId = route.params.patientId;
</script>

<template>
    <div class="h-full">{{ patientId }}</div>
</template>
