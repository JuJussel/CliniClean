<template>
    <cui-table
        :data="patientList"
        style="margin: -10px"
        @select="selectPatient"
        singleSelect
        :loading="loading"
    >
        <template #header>
            <div style="display: flex; align-items: center">
                <h2 style="margin-right: 20px">{{ $lang.patientList }}</h2>
                <cui-input
                    noNote
                    darker
                    @input="searchPatient"
                    v-model="patientSearchInput"
                    :placeholder="$lang.searchByNameodID"
                    :loading="loading.patientSearch"
                ></cui-input>
                <slot name="buttons">
                    <cui-button
                        :label="$lang.register"
                        @click="
                            patientStore.patientData = null;
                            uiStore.modals.receptionModalPatientEdit = true
                        "
                    ></cui-button>
                </slot>
            </div>
        </template>
        <template #thead>
            <cui-th style="width: 100px"> {{ $lang.patientId }} </cui-th>
            <cui-th> {{ $lang.name }} </cui-th>
            <cui-th> {{ $lang.birthdate }} </cui-th>
            <cui-th></cui-th>
        </template>
        <template v-slot:row="{ row }">
            <td>{{ row.id }}</td>
            <td>{{ row.name }}</td>
            <td>{{ $parseDate(row.birthdate) }}</td>
            <td></td>
        </template>
    </cui-table>
</template>

<script>

import { usePatientStore } from '@/stores/patient'
import { useUiStore } from '@/stores/ui'
import { mapStores } from 'pinia'

export default {
    emits: ["selected"],
    created() {
        this.$options.sockets.onmessage = (data) => {
            data = JSON.parse(data.data);
            if (data.event === "updatePatient") this.resetSearch();
        };
    },
    computed: {
        ...mapStores(usePatientStore, useUiStore),
    },
    data() {
        return {
            patientList: [],
            patientSearchInput: "",
            loading: false,
        };
    },
    methods: {
        resetSearch() {
            this.patientSearchInput = "";
            this.patientList = [];
        },
        async searchPatient() {
            let input = this.patientSearchInput;
            if (input === "") {
                this.patientList = [];
                return;
            }
            this.loading = true;
            this.patientList = await this.$api.get('patients/search?query=' + input);
            this.loading = false;
        },
        async selectPatient(pat) {
            this.$emit("selected", pat.row);
            this.patientStore.patientData = {
                id: pat.row.id
            }
        },
    },
};
</script>

<style scoped>
.cc-patient-list-main-cont {
    height: 100%;
    display: flex;
}
</style>