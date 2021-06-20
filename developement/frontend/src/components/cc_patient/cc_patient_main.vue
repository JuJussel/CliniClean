<template>
    <div class="cc-patient-main-cont">
        <cui-button-group v-model="activeTab">
            <cui-button-group-item icon="fas fa-sign-out-alt" :label="$lang.patientList" value="patientList"></cui-button-group-item>
            <cui-button-group-item 
                v-for="(item, index) in dynamicTabs" :key="index" 
                :label="item.label"
                :value="item.value"
                :icon="item.icon"
                :index="index"
            />

        </cui-button-group>
        <div>
            <component
             :is="activeTabContent"
             @newPatient="newPatient"
             @cancel="closeTab"
             @showPatient="showPatientQuickInfo"
            ></component>
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
            let item = {label: this.$lang.patientNew, value: 'patientEdit_' + key, icon: '',  index: key}
            this.dynamicTabs.push(item)
            this.$nextTick(() => {
                this.activeTab = item.value
            })
        },
        closeTab(index = null) {
            if (!index) {
                let value = this.activeTab;
                index = this.dynamicTabs.indexOf(value);
            }
            this.dynamicTabs.splice(index, 1);
            if (this.dynamicTabs.length < 1) {
                this.activeTab = 'patientList';
            } else {
                this.activeTab = this.dynamicTabs[index - 1];
            }
        },
        showPatientQuickInfo(id) {
            let transferData = {
                target: 'patientList',
                data: id
            };
            this.$store.commit('SET_TRANSFER_DATA', transferData);
            this.activeTab = 'patientList';
        }
    },
    computed: {
        activeTabContent() {
            return this.activeTab.split('_')[0]
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