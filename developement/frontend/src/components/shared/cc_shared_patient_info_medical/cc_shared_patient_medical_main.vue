<template>
    <div style="height: 100%">
        <cui-card style="height: 80px; overflow: hidden">
            <div class="loader" v-if="loading" />
            <div v-else style="display: flex; align-items: center">
                <cui-tag> {{ patient.id }} </cui-tag>
                <h2> {{ patient.name }} </h2>
                <h2 style="margin-left: 40px"> {{ $dayjs().diff(this.patient.birthdate, 'year') }} </h2>
                {{ $lang.yearsAge + $lang.jpOnly.no }}
                <h2> {{ patientData.gender == 1 ? $lang.male : $lang.female }} </h2>
                <cui-button-group v-model="activeTab" style="margin-left: 40px">
                    <cui-button-group-item
                        v-for="(tab, index) in tabs" :key="index"
                        :label="tab.label"
                        :value="tab.name"
                        :icon="tab.icon"
                        :index="index"
                    />
                </cui-button-group>
            </div>
        </cui-card>
        <div class="loader" v-if="loading" />
        <div v-else style="position:relative; overflow: auto; flex: 1; height: calc(100% - 95px)">
            <keep-alive>
                <component
                    v-bind:is="activeTab"
                    :patientId="patient._id"
                    :patientData="patientData"
                />
            </keep-alive>
        </div>
    </div>
</template>

<script>

import patientBasic from "../cc_shared_patient_info_basic/cc_shared_patient_info_basic_dashboard.vue"
import patientMedical from "./cc_shared_patient_medical_dashboard.vue"

export default {
    props: {
        patient: {
            default: null
        }
    },
    components: {
        patientBasic,
        patientMedical
    },
    created() {
        this.getPatientMedicalData();
    },
    data() {
        return {
            activeTab: "patientBasic",
            tabs: [
                {label: this.$lang.basic, name: 'patientBasic', icon: 'fas fa-info'},
                {label: this.$lang.medicalInfo, name: 'patientMedical', icon: 'fas fa-info'}
            ],
            patientData: null,
            loading: true
        }
    },
    methods: {
        async getPatientMedicalData() {
            this.loading = true;
            this.patientData = await this.$dataService().get.patient.medicalHistory(this.patient._id);
            this.loading = false;
        }
    }
}
</script>