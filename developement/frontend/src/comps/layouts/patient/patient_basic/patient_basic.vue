<template>
<div class="flex gap-2 flex-wrap">
    <BasicInfo :patientDataBasic="patientStore.activePatientDataBasic"/>
</div>
<Fieldset :legend="$t('insurance')">
    <InsuranceSets :insurances="patientStore.activePatientDataBasic.insurance"/>
</Fieldset>

</template>

<script setup>

import BasicInfo from '@/comps/shared/patient_info_basic.vue'
import InsuranceSets from '@/comps/shared/tables/insurance_sets.vue'
const patientStore = usePatientStore()

</script>