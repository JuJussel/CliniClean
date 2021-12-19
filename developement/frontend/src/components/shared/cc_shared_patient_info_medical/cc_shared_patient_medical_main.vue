<template>
    <div style="height: 100%">
        <cui-card>
            <patientBasic  :patientId="patient._id"/>
        </cui-card>
    </div>
</template>

<script>

import patientBasic from "../cc_shared_patient_info_basic/cc_shared_patient_info_basic_dashboard.vue"

export default {
    props: {
        patient: {
            default: null
        }
    },
    components: {
        patientBasic
    }
}
</script>