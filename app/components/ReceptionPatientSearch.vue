<script setup>

import {ModalPatientRegistration, ModalPatientWalkin} from '#components'
const overlay = useOverlay()

async function openRegistrationModal() {
    const registrationModal = overlay.create(ModalPatientRegistration, {destroyOnClose: true})
    const action = await registrationModal.open()

    if(!action) return
    if(action.modal === 'walkin') {
        const walkinModal = overlay.create(ModalPatientWalkin, {destroyOnClose: true})
        walkinModal.open({patientId: action.id})
    }
    
}


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
                    <UButton color="neutral" icon="material-symbols-add"
                    @click="openRegistrationModal"
                    >
            {{ $t("registerNewPatient") }}
        </UButton>

        </div>

        <UTable
            :loading="searchLoading"
            :data="searchResults"
            :columns="columns"
            class="flex-1"
        />
    </div>
</template>
