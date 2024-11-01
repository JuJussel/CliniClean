<template>
    <div>
        <DataView :value="listStore.listData.habitCategories">
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
                                <div class="field w-32" v-if="entry.type === 'text'">
                                    <label>{{ $t(entry.name) }}</label>
                                    <InputText v-model="entry.value" size="small" />
                                </div>
                                <div class="field w-24" v-else-if="entry.type === 'number'">
                                    <label>{{ $t(entry.name) }}</label>
                                    <InputGroup>
                                        <InputNumber v-model="entry.value" size="small" />
                                        <InputGroupAddon>{{ $t(entry.unit) }}</InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                    <!-- <Card v-for="(item, index) in slotProps.items" :key="index">
                        <template #title>
                            <div class="flex justify-center align-center gap-2">
                                <i :class="item.icon" />
                                <span>{{ $t(item.name) }}</span>
                            </div>
                        </template>
                        <template #content>
                        </template>
                    </Card> -->
                </div>
            </template>
        </DataView>
    </div>
</template>

<script setup>
const listStore = useListStore();
const patientStore = usePatientStore();

const habitData = computed(() => {
    return [];
});

const findValue = (category) => {
    console.log(category);

    return (
        patientStore.activePatientDataMedical.habits?.find(
            (item) => item.name === category
        ).value || 1
    );
};
</script>
