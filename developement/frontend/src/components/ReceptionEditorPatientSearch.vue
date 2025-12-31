<template>
    <div class="min-h-0 max-h-[calc(100vh-130px)] grid grid-rows-[auto_1fr]">
        <Toolbar>
            <template #end>
                <Button
                    :label="$t('newPatient')"
                    @click="uiStore.tabs.reception.multiview.mode = PatientNew"
                    class="w-32"
                />
            </template>

            <template #center>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText
                        :placeholder="$t('patientSearch')"
                        type="text"
                        v-model="patientSearchInput"
                    />
                </IconField>
            </template>

            <template #start>
                <Button
                    icon="pi pi-plus"
                    class="mr-2"
                    severity="secondary"
                    text
                />
                <Button
                    icon="pi pi-print"
                    class="mr-2"
                    severity="secondary"
                    text
                />
                <Button icon="pi pi-upload" severity="secondary" text />
            </template>
        </Toolbar>
        <Panel
            class="mt-4"
            :pt="{
                content: {
                    class: '!px-0 mt-2',
                },
                header: { class: '!hidden' },
            }"
        >
            <DataTable
                :value="patientStore.search.results"
                v-model:selection="patientStore.basic.data"
                selectionMode="single"
                dataKey="id"
                scrollable
                scrollHeight="flex"
                @rowSelect="receptionStore.multiView.mode = PatientInfo"
            >
                <Column field="id" :header="$t('id')" class="w-24">
                    <template #body="slotProps">
                        <Skeleton v-if="patientStore.search.loading" />
                        {{ slotProps.data.id }}
                    </template>
                </Column>
                <Column field="name.family" :header="$t('name')">
                    <template #body="slotProps">
                        <Skeleton v-if="patientStore.search.loading" />
                        {{ slotProps.data.name?.family }}
                        {{ slotProps.data.name?.given }}
                    </template>
                </Column>
                <Column
                    field="birthdate"
                    :header="$t('birthdate')"
                    class="w-36"
                >
                    <template #body="slotProps">
                        <Skeleton v-if="patientStore.search.loading" />

                        {{ parseDate(slotProps.data.birthDate) }}
                    </template>
                </Column>
                <Column class="w-[168px]">
                    <template #body="slotProps">
                        <div
                            v-if="patientStore.search.loading"
                            class="flex gap-2"
                        >
                            <Skeleton height="2rem" />
                            <Skeleton height="2rem" />
                            <Skeleton height="2rem" />
                        </div>
                        <div v-else class="flex gap-2">
                            <Button
                                icon="pi pi-eye"
                                text
                                size="small"
                                @click="viewPatient(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-pencil"
                                text
                                size="small"
                                @click="editPatient(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-trash"
                                severity="danger"
                                text
                                size="small"
                                @click="deletePatient(slotProps.data)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </Panel>
    </div>
</template>

<script setup>
import parseDate from "@/composables/dateComposable.js";
import { watch, ref } from "vue";
import PatientNew from "@/components/ReceptionEditorPatientNew.vue";

const uiStore = useUiStore();
const patientStore = usePatientStore();
const patientSearchInput = ref(null);

watch(patientSearchInput, (newVal) => {
    patientStore.searchPatients(newVal);
});

patientStore.search.results = [];
</script>
