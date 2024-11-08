<template>
    <div>
        <Button icon="pi pi-plus" :label="$t('add')" severity="contrast" />
        <!-- <DataView :value="listStore.listData.habitCategories">
            <template #list="slotProps">
                <div class="flex flex-col gap-4">
                    <Fieldset :legend="item.icon" v-for="(item, index) in slotProps.items" :key="index">
                        <template #legend>
                            <div class="flex justify-center align-center gap-2">
                                <i :class="item.icon" />
                                <span>{{ $t(item.name) }}</span>
                            </div>
                        </template>
                        <div>
                            <div v-for="(entry, indexEntry) in item.fields" :key="indexEntry">
                                <div class="w-32" v-if="entry.type === 'text'">
                                    <label>{{ $t(entry.name) }}</label>
                                    <InputText v-model="entry.value" size="small" />
                                </div>
                                <div class="w-24" v-else-if="entry.type === 'number'">
                                    <label>{{ $t(entry.name) }}</label>
                                    <InputGroup>
                                        <InputNumber v-model="entry.value" size="small" />
                                        <InputGroupAddon>{{ $t(entry.unit) }}</InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                </div>
            </template>
        </DataView> -->
        <!-- <DataTable v-model:editingRows="editingRows" :value="habits" editMode="row" size="small">
            <Column class="w-[200px]">
                <template #body="slotProps">
                     <i :class="slotProps.data.icon " />
                     <span class="ml-4">{{ $t(slotProps.data.name) }}</span>
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <div v-for="(item, index) in slotProps.data.fields" :key="index">
                            <div v-if="item.value" class="flex items-center">
                                <span class="infoLabel mr-2">{{ $t(item.name) }}:</span>
                                <div v-if="item.type==='selectMultiAdd'">
                                    <Chip v-for="(tag, tagIndex) in item.value" :key="tagIndex" :label="tag"/>
                                </div>
                                <tag v-else severity="contrast" >
                                    {{ item.value }}
                                    {{ $t(item.unit) }}
                                </tag>
                            </div>
                            <tag v-else severity="secondary" >{{$t("unknown")}}</tag>
                        </div>
                    </div>
                </template>
                <template #editor="{ data, field }">
                    <div class="flex gap-2">
                        <div v-for="(item, index) in data.fields" :key="index">
                            <div class="flex items-center">
                                <span class="infoLabel mr-2">{{ $t(item.name) }}:</span>
                                <InputGroup v-if="item.type === 'number'"  class="!w-24">
                                    <InputNumber v-model="data[field]" size="small"/>
                                    <InputGroupAddon v-if="item.unit">{{ $t(item.unit) }}</InputGroupAddon>
                                </InputGroup>
                                <InputGroup v-else-if="item.type === 'text'"  class="!w-24">
                                    <InputText v-model="data[field]" size="small"/>
                                    <InputGroupAddon v-if="item.unit">{{ $t(item.unit) }}</InputGroupAddon>
                                </InputGroup>
                                <div v-else-if="item.type === 'selectMultiAdd'">
                                    <Chip v-for="(tag, tagIndex) in item.value" :key="tagIndex" :label="tag" removable />
                                    <InputText v-model="data[field]" size="small"/>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
            </Column>
            <Column :rowEditor="true" class="w-16" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable> -->
        <DataTable 
            v-model:editingRows="editingRowsDummy" 
            :value="habits" 
            editMode="row" 
            size="small" 
            @row-edit-save="habitValueEditSave"
            @row-edit-init="initRowEdit">
            <Column class="w-[200px]">
                <template #body="slotProps">
                     <i :class="slotProps.data.icon " />
                     <span class="ml-4">{{ $t(slotProps.data.name) }}</span>
                </template>
            </Column>
            <Column>
                <template #body="slotProps">
                </template>
                <template #editor="{data, field, index}">
                    <ItemEdit :itemData="rowEditCopy.find(i => i.index === index).data.values" />
                </template>
            </Column>
            <Column :rowEditor="true" class="w-16" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>
    </div>
</template>

<script setup>

import ItemEdit from './medical_risks_item_edit.vue'

const listStore = useListStore();
const patientStore = usePatientStore();

const editingRowsDummy = ref([]);
const rowEditCopy = ref([])

const habits = computed(() => {

    let baseArray = JSON.parse(JSON.stringify(listStore.listData.habitCategories))

    // patientStore.activePatientDataMedical.habits?.forEach(habit => {
    //     let index = baseArray.findIndex((i) => i.name === habit.name)
    //     baseArray[index].fields = habit.fields
    // });

    return baseArray

})

const habitValueEditSave = async (event) => {
    let { dummy, index } = event
    let newDataIndex = rowEditCopy.value.findIndex(i => i.index === index)   
    let completeOldData = JSON.parse(JSON.stringify(habits.value))
    completeOldData[index].values = rowEditCopy.value[newDataIndex].data.values
    rowEditCopy.value.splice(newDataIndex,1)
    // POST

 
}

const initRowEdit = (data) => {
    rowEditCopy.value.push(JSON.parse(JSON.stringify(data)))
}

</script>
