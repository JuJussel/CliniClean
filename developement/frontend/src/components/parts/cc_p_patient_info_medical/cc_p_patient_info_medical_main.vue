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
            <div style="position:relative; overflow: auto; flex: 1; margin-top: 10px">
                <div class="loader" v-if="loading" />
                <component v-bind:is="activeTab"></component>
            </div>
        </keep-alive>
    </div>
</template>

<script>
    import basic from "./cc_p_patient_info_medical_basic.vue"
    import vitals from "./cc_p_patient_info_medical_vitals.vue"
    import exams from "./cc_p_patient_info_medical_exams.vue"
    import perscription from "./cc_p_patient_info_medical_perscription.vue"
    import procedures from "./cc_p_patient_info_medical_procedures.vue"
    import diseases from "./cc_p_patient_info_medical_diseases.vue"
    import encounters from "./cc_p_patient_info_medical_encounters.vue"

export default {
    components: {
        basic,
        vitals,
        exams,
        perscription,
        procedures,
        diseases,
        encounters
    },
    data() {
        return {
            tabs: [
                {label: this.$lang.basic, name: "basic", icon: "fas fa-info"},
                {label: this.$lang.vitals, name: "vitals", icon: "fas fa-chart-line"},
                {label: this.$lang.procedureCategoryLabels.exam, name: "exams", icon: "fas fa-microscope"},
                {label: this.$lang.procedureCategoryLabels.perscription, name: "perscription", icon: "fas fa-pills"},
                {label: this.$lang.procedureHistory, name: "procedures", icon: "fas fa-list"},
                {label: this.$lang.diseaseName, name: "diseases", icon: "fas fa-disease"},
                {label: this.$lang.karteHistory, style: "padding: 0", name: "encounters", icon: "fas fa-file-alt"}
            ],
            activeTab: "basic",
            loading: false
        }
    }
}
</script>

<style scoped>
    .cc-patient-medical-info-main-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%
    }
</style>