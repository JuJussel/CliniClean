<template>
    <div style="height: 100%">
        <div class="cc-local-main-grid">
            <cui-card>
                <div style="display: flex">
                    <span style="display: flex; align-items: center; margin-right: 20px">
                        <span> {{ $lang.bloodType }} </span>
                        <cui-tag> {{ patientData.bloodType || this.$lang.unknown }} </cui-tag>
                    </span>
                    <span style="display: flex; align-items: center; margin-right: 20px">
                        <span> {{ $lang.alcohol }} </span>
                        <cui-tag> {{ patientData.alcohol || this.$lang.unknown }} </cui-tag>
                    </span>
                    <span style="display: flex; align-items: center; margin-right: 20px">
                        <span> {{ $lang.tabaco }} </span>
                        <cui-tag> {{ patientData.tabaco || this.$lang.unknown }} </cui-tag>
                    </span>
                </div>
            </cui-card>
            <cui-card>
                <encounters :patientData="patientData" outline :square="false"/>
            </cui-card>
            <cui-card>
                <diseases :patientData="patientData" outline :square="false"/>
            </cui-card>
        </div>
    </div>
</template>

<script>

import diseases from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_diseases.vue"
import encounters from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_encounters.vue"

export default {
    props: {
        patientData: {
            default: null
        }
    },
    components: {
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
        grid-template-columns: 700px 30% auto;
        height: 100%;
    }

</style>