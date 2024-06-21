<template>
    <DataTable v-model:selection="selectedInsurance" :loading="loading" :value="insurances"
        tableStyle="min-width: 50rem" selectionMode="single">
        <Column field="Insurance_Combination_Number" :header="$t('insuranceCombinationNumber')"></Column>
        <Column field="InsuranceProvider_WholeName" :header="$t('insurance')"></Column>
        <Column field="Certificate_ExpiredDate" :header="$t('validUntil')">
            <template #body="slotProps">
                <span> {{ parseDate(slotProps.data.Certificate_ExpiredDate) }} </span>
            </template>

        </Column>

        <Column field="PublicInsurance_Information" :header="$t('publicInsurance')">
            <template #body="slotProps">
                <span> {{ slotProps.data.PublicInsurance_Information?.[0]?.PublicInsurance_Name }} </span>
            </template>
        </Column>
        <Column field="PublicInsurance_Information" :header="$t('publicInsurance')">
            <template #body="slotProps">
                <span> {{ slotProps.data.PublicInsurance_Information?.[1]?.PublicInsurance_Name }} </span>
            </template>
        </Column>
        <Column field="PublicInsurance_Information" :header="$t('publicInsurance')">
            <template #body="slotProps">
                <span> {{ slotProps.data.PublicInsurance_Information?.[2]?.PublicInsurance_Name }} </span>
            </template>

        </Column>
        <Column field="PublicInsurance_Information" :header="$t('publicInsurance')">
            <template #body="slotProps">
                <span> {{ slotProps.data.PublicInsurance_Information?.[3]?.PublicInsurance_Name }} </span>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>

import parseDate from '@/composables/dateComposable.js'

const props = defineProps(['insurances', 'loading'])
const emit = defineEmits(['select'])
const selectedInsurance = ref(null)

watch(selectedInsurance, () => {
    emit('select', selectedInsurance)
})

</script>