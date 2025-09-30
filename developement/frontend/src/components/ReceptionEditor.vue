<template>
    <div class="p-2">
        <patientSearch />
    </div>
</template>

<script setup>
import patientSearch from "./ReceptionEditorPatientSearch.vue";
const receptionStore = useReceptionStore();

receptionStore.multiView.mode = "patientSearch";
</script>
