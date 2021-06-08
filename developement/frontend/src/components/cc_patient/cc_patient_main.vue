<template>
    <div class="cc-patient-main-cont">
        <cui-button-group v-model="activeTab">
            <cui-button-group-item icon="fas fa-sign-out-alt" :label="$lang.patientList" value="patientList"></cui-button-group-item>
            <cui-button-group-item 
                v-for="(item, index) in dynamicTabs" :key="index" 
                :label="item.label"
                :value="item.value"
                :icon="item.icon"
            />

        </cui-button-group>
        <div>
            <component :is="activeTabContent" @newPatient="newPatient"></component>
        </div>

    </div>
</template>

<script>

    import patientList from './cc_patient_overview'
    import patientDetails from './cc_patient_details'
    import patientEdit from './cc_patient_edit'

export default {
    components: {
        patientList,
        patientDetails,
        patientEdit
    },
    data() {
        return {
            activeTab: 'patientList',
            dynamicTabs: []
        }
    },
    methods: {
        newPatient() {
            let key = this.dynamicTabs.length
            this.dynamicTabs.push({label: this.$lang.patientNew, value: 'patientEdit_' + key, icon: ''})
            this.$nextTick(() => {
                this.activeTab = 'patientEdit_' + key
            })
        }
    },
    computed: {
        activeTabContent() {
            if (this.activeTab.includes('patientEdit')) {
                return 'patientEdit'
            }
            return this.activeTab
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