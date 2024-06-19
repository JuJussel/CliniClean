<template>
    <div>
        {{ props.patientData?.name }}
    </div>
</template>

<script setup>

const props = defineProps(['patientData'])

</script>