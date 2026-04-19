<script setup>
const dayjs = useDayjs();

const searchQuery = ref("");
const searchResults = ref([]);
const searchLoading = ref(false);
const columns = [
    {
        accessorKey: "id",
        header: $t("id"),
    },
    {
        accessorKey: "name.family",
        header: $t("name"),
        cell: (row) => {
            const patient = row.row.original;
            return `${patient.name?.family} ${patient.name?.given}`;
        },
    },
    {
        accessorKey: "birthDate",
        header: $t("birthDate"),
        cell: (row) => {
            const patient = row.row.original;
            return dayjs(patient.birthDate).format("LL");
        },
    },
];

async function searchPatients() {
    searchResults.value = [];
    searchLoading.value = true;
    const res = await usePatientStore().searchPatients(searchQuery.value, true);
    searchResults.value = res;
    searchLoading.value = false;
}
</script>

<template>
    <div>
        <div class="flex gap-2">
            <UInput
                v-model="searchQuery"
                :loading="searchLoading"
                class="max-w-sm"
                icon="material-symbols:search-rounded"
                :placeholder="$t('patientSearch')"
                @update:modelValue="searchPatients"
            />
            <ModalPatientRegistration />
        </div>

        <UTable
            :loading="searchLoading"
            :data="searchResults"
            :columns="columns"
            class="flex-1"
        />
    </div>
</template>
