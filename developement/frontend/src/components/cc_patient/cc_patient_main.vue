<template>
    <div class="cc-patient-main-cont">
        <cui-button-group v-model="activeTab">
            <cui-button-group-item icon="fas fa-list" :label="$lang.patientList" value="patientList"></cui-button-group-item>
            <cui-button-group-item 
                v-for="(item, index) in dynamicTabs" :key="index" 
                :label="item.label"
                :value="item.value"
                :icon="item.icon"
                :index="index"
            />

        </cui-button-group>
        <div class="cc-patient-main-tab-hidden" v-bind:class="{ 'cc-patient-main-tab-visible': 'patientList' === activeTab }">
            <patientList 
                @newPatient="newPatient"
                @editPatient="editPatient"
                :key="listResetter"
            />
        </div>
        <div v-for="(tab, index) in dynamicTabs" :key="index" class="cc-patient-main-tab-hidden" v-bind:class="{ 'cc-patient-main-tab-visible': tab.value === activeTab }">
            <component
             :is="tabContent(tab.value)"
             :editData="tab.patientData ? tab.patientData : null"
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
            listResetter: 1,
            activeTab: 'patientList',
            dynamicTabs: []
        }
    },
    methods: {
        tabContent(tab) {
            return tab.split('_')[0]
        },
        newPatient() {
            let key = this.dynamicTabs.length
            let item = {label: this.$lang.patientNew, value: 'patientEdit_' + key, icon: 'fas fa-user-plus',  index: key}
            this.dynamicTabs.push(item)
            this.$nextTick(() => {
                this.activeTab = item.value
            })
        },
        editPatient(patientData) {
            let key = this.dynamicTabs.length
            let item = {label: this.$lang.patientEdit, value: 'patientEdit_' + key, icon: 'fas fa-edit',  index: key, patientData: patientData}
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
        showPatientQuickInfo(pat) {
            let transferData = {
                target: 'patientList',
                data: pat.patientId
            };
            this.$store.commit('SET_TRANSFER_DATA', transferData);
            this.listResetter++;
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
    .cc-patient-main-tab-hidden {
        display: none;
    }
    .cc-patient-main-tab-visible {
        display: block;
    }
</style>