<template>
    <div class="cc-patient-main-cont">
        <cui-button-group>
            <cui-button-group-item icon="fas fa-sign-out-alt" label="Button1" value="1"></cui-button-group-item>
            <cui-button-group-item label="Button2" value="2"></cui-button-group-item>
            <cui-button-group-item label="Button3" value="3"></cui-button-group-item>
            <cui-button-group-item label="Button4" value="4"></cui-button-group-item>
        </cui-button-group>
        <div>
            <component :is="activeTab"></component>
        </div>

    </div>
</template>

<script>

    import patientList from './cc_patient_list'

export default {
    components: {
        patientList
    },
    data() {
        return {
            activeTab: 'patientList'
        }
    }
}
</script>

<style scoped>
    .cc-patient-main-cont {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 5% 95%;
        height: 100%
    }
</style>