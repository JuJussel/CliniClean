<template>
    <div style="height: 100%">
        <div class="cc-local-main-grid">
            <overview :patientData="patientData" outline :square="false"/>
            <encounters :patientData="patientData" outline :square="false"/>
            <diseases :patientData="patientData" outline :square="false"/>
        </div>
    </div>
</template>

<script>

import overview from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_basic.vue"
import diseases from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_diseases.vue"
import encounters from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_encounters.vue"

export default {
    props: {
        patientData: {
            default: null
        }
    },
    components: {
        overview,
        diseases,
        encounters
    },
    data() {
        return {
        }
    },
    methods: {
    }
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