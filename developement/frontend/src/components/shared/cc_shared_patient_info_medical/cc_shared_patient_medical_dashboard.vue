<template>
    <div style="height: 100%">
        <div class="loader" v-if="loading" />
        <div v-else class="cc-local-main-grid">
            <overview :patientData="patientData"/>
            <encounters :patientData="patientData" />
            <diseases :patientData="patientData" />
        </div>
    </div>
</template>

<script>

import overview from "../cc_shared_medical_info/cc_shared_patient_medical_info_basic.vue"
import diseases from "../cc_shared_medical_info/cc_shared_patient_medical_info_diseases.vue"
import encounters from "../cc_shared_medical_info/cc_shared_patient_medical_info_encounters.vue"

export default {
    props: {
        patientId: {
            default: null,
            type: Number
        }
    },
    components: {
        overview,
        diseases,
        encounters
    },
    created() {
        this.getPatientData();
    },
    data() {
        return {
            patientData: null,
            loading: true
        }
    },
    methods: {
        async getPatientData() {
            this.loading = true;
            this.patientData = await this.$dataService().get.patient.medicalHistory(this.patientId);
            this.loading = false;
        }
    },
}
</script>

<style scoped>
    .cc-local-main-grid {
        display: grid;
        grid-template-columns: calc(30% - 80px) 30% 40%;
        column-gap: 40px;
        flex-grow: 1;
        height: 100%;
    }

</style>