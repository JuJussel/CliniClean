<template>
    <div>
        <Button icon="pi pi-plus" :label="$t('add')" severity="contrast" @click="toggleNewPop"/>
        <DataTable 
            v-model:editingRows="editingRowsDummy" 
            :loading = "risksLoading"
            :value="habits" 
            editMode="row" 
            size="small" 
            @row-edit-save="habitValueEditSave"
            @row-edit-cancel="habitValueEditCancel"
            @row-edit-init="initRowEdit">
            <Column class="w-[200px]">
                <template #body="slotProps">
                     <i :class="slotProps.data.icon " />
                     <span class="ml-4">{{ $t(slotProps.data.name) }}</span>
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <Tag v-for="(value, valueIndex) in slotProps.data.values" :key="valueIndex" class="m-1" severity="contrast" :value="value"></Tag>
                </template>
                <template #editor="{data, field, index}">
                    <ItemEdit :itemData="rowEditCopy.find(i => i.index === index).data.values" />
                </template>
            </Column>
            <Column :rowEditor="true" class="w-16" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
    </div>
    <Popover ref="newPop">
        <newHabit @add="addHabit" />
    </Popover>
</template>

<script setup>

import newHabit from './medical_risk_new_habit.vue'
import ItemEdit from './medical_risks_item_edit.vue'
import useApi from "@/composables/apiComposable.js"
import Popover from 'primevue/popover'

const listStore = useListStore()
const patientStore = usePatientStore()

const newPop = ref()

const editingRowsDummy = ref([])
const rowEditCopy = ref([])
const risksLoading = ref(false)

const habits = computed(() => {

    if (patientStore.activePatientDataMedical.habits) return JSON.parse(JSON.stringify(patientStore.activePatientDataMedical.habits))
    return JSON.parse(JSON.stringify(listStore.listData.habitCategories))

})

const habitValueEditSave = async (event) => {

    risksLoading.value = true
    let patientId = patientStore.activePatientDataBasic.id
    let { dummy, index } = event
    let newDataIndex = rowEditCopy.value.findIndex(i => i.index === index)   
    let sendData = JSON.parse(JSON.stringify(habits.value))
    let fieldsWithData = rowEditCopy.value[newDataIndex].data.values.filter( i => i !=='')
    sendData[index].values = fieldsWithData
    rowEditCopy.value.splice(newDataIndex, 1)
    await useApi.post("patients/" + patientId + "/medical?type=habits", sendData)
    // POST
    patientStore.activePatientDataMedical.habits = sendData
    risksLoading.value = false

}

const initRowEdit = (data) => {
    rowEditCopy.value.push(JSON.parse(JSON.stringify(data)))
}

const habitValueEditCancel = (event) => {

    let { dummy, index } = event
    let newDataIndex = rowEditCopy.value.findIndex(i => i.index === index)
    rowEditCopy.value.splice(newDataIndex, 1)
    
}

const toggleNewPop = (event) => {
    newPop.value.toggle(event)
}

const addHabit = async (habit) => {
    risksLoading.value = true
    let patientId = patientStore.activePatientDataBasic.id
    patientStore.activePatientDataMedical.habits.push(habit)
    await useApi.post("patients/" + patientId + "/medical?type=habits", patientStore.activePatientDataMedical.habits)
    newPop.value.toggle()
    risksLoading.value = false
}

</script>
