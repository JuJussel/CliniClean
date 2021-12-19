<template>
    <div class="cc-medical-main-cont">
        <cui-button-group v-model="activeTab" style="margin-left: 10px">
            <cui-button-group-item icon="fas fa-list" :label="$lang.receptionList" value="encounterList"></cui-button-group-item>
            <cui-button-group-item 
                v-for="(item, index) in dynamicTabs" :key="index" 
                :label="item.label"
                :value="item.value"
                :icon="item.icon"
                :index="index"
            />
        </cui-button-group>
        <div class="cc-medical-main-tab-hidden" v-bind:class="{ 'cc-medical-main-tab-visible': 'encounterList' === activeTab }">
            <encounterList 
                :key="listResetter"
                @showEncounter="showEncounter"
                @showPatientMedical="showPatientMedical"
                ref="list"
            />
        </div>
        <div v-for="(tab, index) in dynamicTabs" :key="index" class="cc-medical-main-tab-hidden" v-bind:class="{ 'cc-medical-main-tab-visible': tab.value === activeTab }">
            <component
             :is="tabContent(tab.value)"
             :encounter="tab.meta"
             :patient="tab.meta"
             @cancel="closeTab"
             @examinationClosed="examinationClosed()"
            ></component>
        </div>
    </div>

</template>

<script>
import encounterList from "./cc_medical_list.vue";
import examination from "./cc_medical_encounter.vue";
import patientMedical from "../cc_patient_medical/cc_patient_medical_main.vue"

export default {
    components: {
        encounterList,
        examination,
        patientMedical
    },
    data() {
        return {
            listResetter: 1,
            activeTab: 'encounterList',
            dynamicTabs: []
        }
    },
    methods: {
        tabContent(tab) {
            return tab.split('_')[0];
        },
        showEncounter(enc) {
            let key = this.dynamicTabs.length;
            let item = {
                label: this.$lang.examination + this.$lang.spacer + enc.row.patient.name,
                value: 'examination_' + key,
                icon: 'fas fa-clipboard',
                index: key,
                meta: enc.row
            };
            this.dynamicTabs.push(item);
            this.$nextTick(() => {
                this.activeTab = item.value;
            })
        },
        showPatientMedical(pat) {
            let key = this.dynamicTabs.length;
            let item = {
                label: this.$lang.patientMedicalRecord + this.$lang.spacer + pat.name,
                value: 'patientMedical_' + key,
                icon: 'fas fa-clipboard',
                index: key,
                meta: pat
            };
            this.dynamicTabs.push(item);
            this.$nextTick(() => {
                this.activeTab = item.value;
            })
        },
        closeTab(index = null) {
            if (!index) {
                let value = this.activeTab;
                index = this.dynamicTabs.indexOf(value);
            }
            this.dynamicTabs.splice(index, 1);
            if (this.dynamicTabs.length < 1) {
                this.activeTab = 'encounterList';
            } else {
                this.activeTab = this.dynamicTabs[index - 1];
            }
        },
        examinationClosed() {
            this.$refs.list.getEncounters()
        }
    }

}
</script>

<style scoped>
    .cc-medical-main-cont {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 60px calc(100% - 60px);
        height: 100%
    }
    .cc-medical-main-tab-hidden {
        display: none;
    }
    .cc-medical-main-tab-visible {
        display: block;
    }

</style>