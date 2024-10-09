<template>
    <div>
        <DataTable :value="encounterStore.encounterData.karte.procedures">
            <Column />
            <Column field="name" />
            <Column />
        </DataTable>
    </div>
</template>

<script setup>
const encounterStore = useEncounterStore();
</script>
