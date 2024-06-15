<template>
    <div class="grid grid-cols-2">
        <div>
            <InsuranceTable v-bind:insurances="insurances" />
        </div>
        <div>
            <div>{{ $t('comment') }}</div>
            <Textarea v-model="value" rows="5" cols="30" />
        </div>
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="$emit('close')"></Button>
        <Button type="button" label="Save" @click=""></Button>
    </div>
</template>

<script setup>

import useApi from "@/composables/apiComposable.js"
import InsuranceTable from "@/comps/shared/tables/insurance_sets"

const props = defineProps(['encounter'])
const emit = defineEmits(['close', 'commit'])

const insurances = ref([])
const loading = ref(false)

getInsurances()

async function getInsurances() {
    loading.value = true
    const patientId = props.encounter.patient.id
    insurances.value = await useApi.get('patients/' + patientId + '/insuranceSets')
    loading.value = false
}


</script>