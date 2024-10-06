<template>
    <BlockUI :blocked="uiLoading">
        <div class="flex flax-col gap-10">
            <div class="w-30">
                <div class="field">
                    <label>{{ $t('encounterType') }}</label>
                    <Select id="encType" v-model="encounterType" :options="listStore.listData.encounterTypes"
                        optionLabel="name" class="w-60" :disabled="uiLoading" />
                </div>
                <div class="field">
                    <label for="comment">{{ $t('comment') }}</label>
                    <Textarea id="comment" v-model="comment" rows="5" class="w-60" :disabled="uiLoading" />
                </div>
            </div>
            <Fieldset :legend="$t('selectInsurance')">
                <InsuranceTable v-bind:insurances="insurances" :loading="insuranceSetsLoading" @select="setInsurance" />
            </Fieldset>
        </div>
    </BlockUI>
    <div class="flex justify-end gap-2 mt-8">
        <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')" raised
            :disabled="uiLoading"></Button>
        <Button type="button" :label="$t('reception')" @click="commit()"
            :disabled="uiLoading || !selectedInsurance.data" raised :loading="uiLoading"></Button>
    </div>
</template>

<script setup>

import useApi from "@/composables/apiComposable.js"
import InsuranceTable from "@/comps/shared/tables/insurance_sets"
import Select from 'primevue/select';

const listStore = useListStore()

const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])

const insurances = ref([])
const uiLoading = ref(false)
const insuranceSetsLoading = ref(false)
const comment = ref(null)
const selectedInsurance = ref({ data: null })
const encounterType = ref(listStore.listData.encounterTypes[0])

getInsurances()

async function getInsurances() {
    insuranceSetsLoading.value = true
    const patientId = props.patient.id
    insurances.value = await useApi.get('patients/' + patientId + '/insuranceSets')
    insuranceSetsLoading.value = false
}

function setInsurance(ins) {
    selectedInsurance.value.data = ins
}

async function commit() {
    uiLoading.value = true
    const encounterData = {
        patient: props.patient,
        ins: selectedInsurance.value.data,
        encounterType: encounterType.value.id,
        note: comment.value
    }
    await useApi.post('encounters', encounterData);
    uiLoading.value = false
    emit('commit')
    emit('close')
}


</script>