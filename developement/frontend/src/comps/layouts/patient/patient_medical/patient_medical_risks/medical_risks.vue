<template>
    <div>
        <DataView :value="listStore.listData.habitCategories">
            <template #list="slotProps">
                <div class="flex flex-col">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        {{ item.name }}
                        {{ findValue(item.name) }}
                    </div>
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
