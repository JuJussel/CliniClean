<template>
    <div class="main-cont">
        <cui-table
            :data="patientData"
            :loading="patientStore.loading"
            outline
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ patientStore.patientData?.name }}</h2>
                    <slot name="buttons">
                        <cui-button
                            :disabled="patientStore.loading"
                            :label="$lang.reception"
                            @click="uiStore.modals.receptionModalRegister = true"
                        ></cui-button>
                        <cui-button
                            :disabled="patientStore.loading"
                            :label="$lang.reservation"
                            @click="uiStore.modals.receptionModalReservation = true"
                        ></cui-button>
                        <cui-button
                            :disabled="patientStore.loading"
                            :label="$lang.edit"
                            @click="uiStore.modals.receptionModalPatientEdit = true"
                        ></cui-button>

                        <cui-button :label="$lang.details"></cui-button>
                    </slot>
                </div>
            </template>
            <template v-slot:row="row">
                <td>{{ row.label }}</td>
                <td>{{ row.value }}</td>
            </template>
        </cui-table>

        <cui-table
            :data="encounters"
            :loading="patientStore.loading"
            outline
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ $lang.outPatient }} {{ $lang.history }}</h2>
                    <cui-button
                        @click="showKarte"
                        :label="$lang.karte"
                    ></cui-button>
                </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.encounterType }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>{{ $parseDate(row.date) }}</td>
                <td>{{ parseEncounterType(row.type) }}</td>
            </template>
        </cui-table>

        <cui-table
            :data="insuranceData"
            outline
            :loading="patientStore.loading"
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2>{{ $lang.insurance }}</h2>
                    <cui-button
                        :disabled="patientStore.loading"
                        :label="$lang.register"
                        @click="uiStore.modals.receptionModalInsuranceEdit = true"
                    ></cui-button>
                </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.insuranceCombinationNumber }} </cui-th>
                <cui-th> {{ $lang.insurance }} </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 1 </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 2 </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 3 </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 4 </cui-th>
                <cui-th> {{ $lang.validUntil }} </cui-th>
            </template>
            <template v-slot:row="row">
                <td>{{ row.Insurance_Combination_Number }}</td>
                <td>{{ row.InsuranceProvider_WholeName }}</td>
                <td>{{ buildPublicIns(0, row) }}</td>
                <td>{{ buildPublicIns(1, row) }}</td>
                <td>{{ buildPublicIns(2, row) }}</td>
                <td>{{ buildPublicIns(3, row) }}</td>
                <td>{{ $parseDate(row.Certificate_ExpiredDate) }}</td>
            </template>
        </cui-table>

        <cui-table
            :data="encounterReservations"
            :loading="patientStore.loading"
            outline
        >
            <template #header>
                <h2>{{ $lang.reservation }}</h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.encounterType }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>{{ $parseDate(row.date) }}</td>
                <td>{{ parseEncounterType(row.type) }}</td>
            </template>
        </cui-table>
    </div>
</template>

<script>

import { usePatientStore } from '@/stores/patient'
import { useListStore } from '@/stores/list'
import { useUiStore } from '@/stores/ui'
import { mapStores } from 'pinia'

export default {
    props: {
        outline: {
            default: false,
            type: Boolean,
        },
        square: {
            default: true,
            type: Boolean,
        },
    },
    created() {
        this.patientStore.getData()
    },
    data() {
        return {
            encounters: [],
            encounterReservations: [],
        };
    },
    methods: {
        async showKarte() {
            this.uiStore.medicalTab = this.patientStore.patientData
            this.uiStore.activeTab = "medical"
        },
        parseEncounterType(type) {
            return this.listStore.listData.encounterTypes.find(
                (item) => item.id === type
            ).name;
        },
        buildPublicIns(index, row) {
            if (index > 0) {
                if (
                    row.PublicInsurance_Information
                        ?.PublicInsurance_Information_child?.[index]
                ) {
                    return row.PublicInsurance_Information
                        .PublicInsurance_Information_child[index]
                        .PublicInsurance_Name;
                }
            } else {
                if (
                    row.PublicInsurance_Information
                        ?.PublicInsurance_Information_child
                        ?.PublicInsurance_Name
                ) {
                    return row.PublicInsurance_Information
                        .PublicInsurance_Information_child.PublicInsurance_Name;
                }
            }
            return "";
        },
    },
    computed: {
        ...mapStores(usePatientStore, useListStore, useUiStore),
        patientData() {
            let patientData = this.patientStore.patientData;
            if (patientData === "loading" || !patientData) return [];
            let tableData = [
                { label: this.$lang.patientId, value: patientData?.id },
                {
                    label: this.$lang.birthdate,
                    value: this.$dayjs(patientData?.birthdate).format(
                        "YYYY年MM月DD日"
                    ),
                },
                {
                    label: this.$lang.gender,
                    value:
                        patientData?.gender == 1
                            ? this.$lang.male
                            : this.$lang.female,
                },
                {
                    label: this.$lang.address,
                    value:
                        patientData?.address?.zip +
                        " " +
                        patientData?.address?.addr,
                },
                {
                    label: this.$lang.occupation,
                    value: patientData?.occupation,
                },
                {
                    label: this.$lang.workOrSchoolName,
                    value: patientData?.company?.name,
                },
                { label: this.$lang.telephone, value: patientData?.phone },
                {
                    label: this.$lang.mailAddress,
                    value: patientData?.mail,
                },
            ];
            return tableData;
        },
        insuranceData() {
            let insData = this.patientStore.patientData || null;
            if (insData === "loading" || !insData) return [];
            return insData.insurance?.[0]?.[0]
                ? insData?.insurance[0]
                : insData?.insurance;
        },
    },
    watch: {
        async patientData() {
            let patientData = this.patientStore.patientData;
            if (patientData === "loading" || !patientData) return [];
            let today = new Date().toISOString();
            let encounters = await this.$api.get('patients/' + patientData.id + '/encounters');
            this.encounters = encounters.filter((item) => item.date < today);
            this.encounterReservations = encounters.filter(
                (item) => item.date > today
            );
        },
    },
};
</script>

<style scoped>
.main-cont {
    display: grid;
    grid-template-rows: 60% auto;
    grid-template-columns: calc(50% - 20px) auto;
    grid-gap: 20px;
}
</style>