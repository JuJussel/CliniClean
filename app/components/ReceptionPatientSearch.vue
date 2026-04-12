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
    const res = await usePersonStore().searchPersons(searchQuery.value, true);
    searchResults.value = res;
    searchLoading.value = false;
}
</script>

<template>
    <div>
        <UInput
            v-model="searchQuery"
            :loading="searchLoading"
            class="max-w-sm"
            icon="i-lucide-search"
            :placeholder="$t('patientSearch')"
            @update:modelValue="searchPatients"
        />
        <UTable
            :loading="searchLoading"
            :data="searchResults"
            :columns="columns"
            class="flex-1"
        />
    </div>
</template>
