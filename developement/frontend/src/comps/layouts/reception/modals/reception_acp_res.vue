<template>
    <div class="grid grid-cols-6 gap-16">
        <div class="col-span-4">
            <InsuranceTable v-bind:insurances="insurances" :loading="insuranceSetsLoading" @select="setInsurance" />
        </div>
        <div class="col-span-2">
            <label for="comment">{{ $t('comment') }}</label>
            <Textarea id="comment" v-model="comment" rows="5" class="w-full h-3/4" />
        </div>
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="$emit('close')"></Button>
        <Button type="button" label="Save" @click="commit()" :disabled="!selectedInsurance"></Button>
    </div>
</template>

<script setup>

import useApi from "@/composables/apiComposable.js"
import InsuranceTable from "@/comps/shared/tables/insurance_sets"

const props = defineProps(['encounter'])
const emit = defineEmits(['close', 'commit'])

const insurances = ref([])
const uiLoading = ref(false)
const insuranceSetsLoading = ref(false)
const comment = ref(null)
const selectedInsurance = ref({ data: null })

comment.value = props.encounter.note

getInsurances()

async function getInsurances() {
    insuranceSetsLoading.value = true
    const patientId = props.encounter.patient.id
    insurances.value = await useApi.get('patients/' + patientId + '/insuranceSets')
    insuranceSetsLoading.value = false
}

function setInsurance(ins) {
    selectedInsurance.value.data = ins
}

async function commit() {
    uiLoading.value = true
    const encounterData = {
        ins: selectedInsurance.value.data.Insurance_Combination_Number,
        status: 2,
        note: comment.value
    }
    await useApi.put('encounters/' + props.encounter.id, encounterData)
    uiLoading.value = true
    emit('commit')
    emit('close')

}


</script>