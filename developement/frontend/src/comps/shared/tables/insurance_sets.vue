<template>
    <DataTable v-model:selection="selectedInsurance" :value="insurances" tableStyle="min-width: 50rem"
        selectionMode="single">
        <Column field="Insurance_Combination_Number" :header="$t('insuranceCombinationNumber')"></Column>
        <Column field="InsuranceProvider_WholeName" :header="$t('insurance')"></Column>
        <Column field="category" :header="$t('publicInsurance')"></Column>
        <Column field="category" :header="$t('publicInsurance')"></Column>
        <Column field="category" :header="$t('publicInsurance')"></Column>
        <Column field="category" :header="$t('publicInsurance')"></Column>
        <Column field="quantity" header="Quantity"></Column>
    </DataTable>
</template>

<script setup>

const props = defineProps(['insurances'])
const emit = defineEmits(['select'])
const selectedInsurance = ref(null)

watch(selectedInsurance, () => {
    emit('select', selectedInsurance)
})

</script>