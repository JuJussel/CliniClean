<template>
    <div class="cc-patient-medical-info-main-wrapper">
        <cui-button-group v-model="activeTab" class="cc_patient_medical_info_bg">
            <cui-button-group-item
                v-for="(tab, index) in tabs" :key="index"
                :label="tab.label"
                :value="tab.name"
                :icon="tab.icon"
                :index="index"
            />
        </cui-button-group>
        <keep-alive>
            <component class="cc-patient-medical-info-main-cont" v-bind:is="activeTab" :patientData="patientData"></component>
        </keep-alive>
    </div>
</template>

<script>

import basic from "./cc_shared_patient_medical_info_basic.vue"

export default {
    components: { 
        basic
    },
    data() {
        return {
            tabs: [
                {label: "基本", name: "basic", icon: "fas fa-info"},
                {label: "バイタル", name: "vitals", icon: "fas fa-chart-line"},
                {label: "検査", name: "kensa", icon: "fas fa-microscope"},
                {label: "処方歴", name: "meds", icon: "fas fa-pills"},
                {label: "行為歴", name: "koui", icon: "fas fa-list"},
                {label: "病歴", name: "byoumei", icon: "fas fa-disease"},
                {label: "カルテ歴", style: "padding: 0", name: "karte", icon: "fas fa-file-alt"}
            ],
            activeTab: "basic",
            patientData: this.$store.getters.activePatientHistory
        }
    }
}
</script>

<style>
    .cc_patient_medical_info_bg {
        margin: 0!important;
    }
    .cc_patient_medical_info_bg .cui-button-group-item {
        flex-grow: 1
    }

</style>

<style scoped>
    .cc-patient-medical-info-main-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%
    }
    .cc-patient-medical-info-main-cont {
        flex-grow: 1;
        overflow: auto;
    }
</style>