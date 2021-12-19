<template>
    <div style="display: flex; height: 100%">
        <div>
            <basic :patientId="patientId" />
        </div>
        <div class="cc-local-main-grid">
            <div style="padding: 10px">
                <h2>地図</h2>
                <GMapMap
                    :center="{lat: 51.093048, lng: 6.842120}"
                    :zoom="7"
                    map-type-id="terrain"
                />
            </div>
        </div>
    </div>
</template>

<script>

import basic from "./cc_shared_patient_info.vue"

export default {
    props: {
        patientId: {
            default: null,
            type: Number
        }
    },
    components: {
        basic
    }
}
</script>

<style scoped>
    .cc-local-main-grid {
        display: grid;
        grid-template-columns: 30% 30% 40%;
        grid-template-rows: 50% 50%;
        flex-grow: 1;
        height: 100%;
    }
</style>