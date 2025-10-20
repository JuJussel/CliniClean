<template>
    <div>
                {{  receptionStore.multiView.data.patient.name }}

    </div>
</template>

<script setup>
const receptionStore = useReceptionStore();
</script>