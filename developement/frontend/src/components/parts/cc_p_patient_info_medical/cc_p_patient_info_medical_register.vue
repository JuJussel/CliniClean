<template>
    <div>
        <h3>Demographics - Rec, Medical</h3>
        <h5>name, address, employer, choices, language,..</h5>
        <h3>Upcoming Visits - Rec, Medical</h3>
        <h3>Insurance - Rec, Medical</h3>
        <h3>Billing - Rec Medical</h3>
        <cc_p_patient_info></cc_p_patient_info>

    </div>
</template>

<script>

import cc_p_patient_info from '../cc_p_patient_info.vue'

export default {

    components: {
        cc_p_patient_info
    }
    
}
</script>