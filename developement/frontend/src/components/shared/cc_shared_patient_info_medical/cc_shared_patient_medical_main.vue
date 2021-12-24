<template>
    <div style="height: 100%">
        <cui-card>
            <cui-button-group v-model="activeTab" class="cc_patient_medical_info_bg">
                <cui-button-group-item
                    v-for="(tab, index) in tabs" :key="index"
                    :label="tab.label"
                    :value="tab.name"
                    :icon="tab.icon"
                    :index="index"
                />
            </cui-button-group>
            <div style="position:relative; overflow: auto; flex: 1; margin-top: 10px; height: calc(100% - 60px)">
                <keep-alive>
                    <component 
                        v-bind:is="activeTab" 
                        :patientId="patient._id" 
                    />
                </keep-alive>
            </div>
        </cui-card>
    </div>
</template>

<script>

import patientBasic from "../cc_shared_patient_info_basic/cc_shared_patient_info_basic_dashboard.vue"
import patientMedical from "./cc_shared_patient_medical_dashboard.vue"

export default {
    props: {
        patient: {
            default: null
        }
    },
    components: {
        patientBasic,
        patientMedical
    },
    data() {
        return {
            activeTab: "patientBasic",
            tabs: [
                {label: this.$lang.basic, name: 'patientBasic', icon: 'fas fa-info'},
                {label: 'medical', name: 'patientMedical', icon: 'fas fa-info'}
            ]
        }
    }
}
</script>