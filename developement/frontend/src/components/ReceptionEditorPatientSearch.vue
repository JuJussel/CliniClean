<template>
    <div class="flex flex-col h-full min-h-0">
        <div class="flex gap-2 mb-4">
            <div class="w-64">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-search" />
                    </InputGroupAddon>
                    <InputText
                        :placeholder="$t('patientSearch')"
                        type="text"
                        v-model="patientSearchInput"
                    />
                </InputGroup>
            </div>
            <Button :label="$t('newPatient')" @click="" class="w-32" />
        </div>
        <div class="min-h-0 h-[calc(100vh-150px)]">
            <DataTable
                :value="patientSearchResults"
                v-model:selection="receptionStore.multiView.data.patient"
                selectionMode="single"
                dataKey="id"
                class="w-full h-full"
                :loading="searching"
                scrollable
                scrollHeight="flex"
                @rowSelect="receptionStore.multiView.mode = 'patientDetails'"
            >
            <Column field="id" :header="$t('id')" />
            <Column field="name" :header="$t('name')" />
            <Column field="birthdate" :header="$t('birthdate')" />
            <Column>
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-eye"
                            @click="viewPatient(slotProps.data)"
                        />
                        <Button
                            icon="pi pi-pencil"
                            @click="editPatient(slotProps.data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            @click="deletePatient(slotProps.data)"
                        />
                    </div>
                </template>
            </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { watch, ref } from "vue";
import useApi from "@/composables/apiComposable.js";

const receptionStore = useReceptionStore();

const patientSearchInput = ref(null);
const patientSearchResults = ref([]);
const searching = ref(false);

// keep table scrollable; pagination was removed per request

let searchTimeout = null;

receptionStore.multiView.data.patient = null;

const search = async () => {
    searching.value = true;
    patientSearchResults.value = await useApi.get(
        "patients/search?query=" + patientSearchInput.value
    );
    searching.value = false;
};

watch(patientSearchInput, (newVal) => {
    searching.value = false;
    receptionStore.multiView.data.patient = null;
    if (searchTimeout) clearTimeout(searchTimeout);
    if (newVal && newVal.length >= 3) {
        searchTimeout = setTimeout(() => {
            search();
        }, 500);
    } else {
        patientSearchResults.value = [];
    }
});

const selectPatient = (patient) => {
    receptionStore.multiView.mode = "patientDetails";
};

// no-op: pagination removed
</script>
