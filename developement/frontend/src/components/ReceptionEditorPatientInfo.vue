<template>
    <div>
        {{
            receptionStore.multiView.data.patient.name || "No patient selected"
        }}
    </div>
</template>

<script setup>
const receptionStore = useReceptionStore();
</script>
