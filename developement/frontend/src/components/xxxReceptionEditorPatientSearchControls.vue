<template>
    <div class="flex gap-2 justify-between">
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
        <Button
            :label="$t('newPatient')"
            @click="uiStore.tabs.reception.multiview.mode = PatientNew"
            class="w-32"
        />
    </div>
</template>

<script setup>
import { watch, ref } from "vue";
import PatientNew from "@/components/ReceptionEditorPatientNew.vue";

const uiStore = useUiStore();
const patientStore = usePatientStore();
const patientSearchInput = ref(null);

watch(patientSearchInput, (newVal) => {
    patientStore.searchPatients(newVal);
});
</script>
