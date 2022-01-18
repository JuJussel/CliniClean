<template>
    <div style="height: 100%">
        <div class="cc-local-main-grid">
            <cui-card>
                <cui-button-group v-model="activeInfoTab" class="cc_patient_medical_info_bg">
                    <cui-button-group-item
                        v-for="(tab, index) in infoTabs" :key="index"
                        :label="tab.label"
                        :value="tab.name"
                        :icon="tab.icon"
                        :index="index"
                    />
                </cui-button-group>
                <keep-alive>
                    <div style="position:relative; overflow: auto; flex: 1; margin-top: 10px">
                        <component v-bind:is="activeInfoTab" :patientData="patientData" v-if="patientData"></component>
                    </div>
                </keep-alive>
            </cui-card>
            <div 
                class="resizer"
                @mousedown.stop="resizeHandler"
            />
            <cui-card>
                    <cui-button-group v-model="activeViewTab" class="cc_patient_medical_info_bg">
                    <cui-button-group-item
                        v-for="(tab, index) in viewerTabs" :key="index"
                        :label="tab.label"
                        :value="tab.name"
                        :icon="tab.icon"
                        :index="index"
                    />
                </cui-button-group>
                <keep-alive>
                    <div style="position:relative; overflow: auto; flex: 1; margin-top: 10px">
                        <component v-bind:is="activeViewTab" :patientData="patientData" :options="dataExplorer.options" v-if="patientData"></component>
                    </div>
                </keep-alive>
            </cui-card>
        </div>
    </div>
</template>

<script>

import basic from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_basic.vue"
import vitals from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_vitals.vue"
import exams from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_exams.vue"
import perscription from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_perscription.vue"
import procedures from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_procedures.vue"
import diseases from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_diseases.vue"
import encounters from "../cc_shared_medical_info_compact/cc_shared_patient_medical_info_encounters.vue"
import dataExplorer from "./cc_shared_patient_medical_data_explorer.vue"

export default {
    props: {
        patientData: {
            default: null
        }
    },
    components: {
        basic, vitals, exams, perscription, procedures, diseases, encounters, dataExplorer
    },
    data() {
        return {
            dataExplorer: {
                options: null
            },
            infoTabs: [
                {label: this.$lang.basic, name: "basic", icon: "fas fa-info"},
                {label: this.$lang.vitals, name: "vitals", icon: "fas fa-chart-line"},
                {label: this.$lang.procedureCategoryLabels.exam, name: "exams", icon: "fas fa-microscope"},
                {label: this.$lang.procedureCategoryLabels.perscription, name: "perscription", icon: "fas fa-pills"},
                {label: this.$lang.procedureHistory, name: "procedures", icon: "fas fa-list"},
                {label: this.$lang.diseaseName, name: "diseases", icon: "fas fa-disease"},
                {label: this.$lang.karteHistory, style: "padding: 0", name: "encounters", icon: "fas fa-file-alt"}
            ],
            viewerTabs: [
                {label: this.$lang.basic, name: "dataExplorer", icon: "fas fa-info"},
                {label: this.$lang.basic, name: "karte", icon: "fas fa-info"}
            ],
            activeInfoTab: "vitals",
            activeViewTab: "karte",
            resizeData: {
                start: null,
                startWidth: 900,
                widthInteger: null
            }

        }
    },
    methods: {
        resizeHandler(mousedown) {
            
            if (mousedown) {
                this.resizeData.start = event.clientX;
                document.addEventListener('mousemove', this.mouseMoveHandler);
                document.addEventListener('mouseup', this.mouseUpHandler);
            }
        },
        mouseMoveHandler() {
            event.preventDefault();
            const dx = event.clientX - this.resizeData.start;
            let newWidth = this.resizeData.startWidth + dx;
            newWidth <= 100 ? this.resizeData.widthInteger : this.resizeData.widthInteger = newWidth;
        },
        mouseUpHandler() {
            this.resizeData.startWidth = this.resizeData.widthInteger;
            document.removeEventListener('mousemove', this.mouseMoveHandler);
            document.removeEventListener('mouseup', this.mouseUpHandler);
        }
    },
    computed: {
        finalWidth() {
            return (this.resizeData.widthInteger || this.resizeData.startWidth) + "px"
        }
    }
}
</script>

<style scoped>
    .cc-local-main-grid {
        display: grid;
        grid-template-columns: v-bind(finalWidth) 5px auto;
        height: 100%;
    }
    .resizer {
        cursor: ew-resize;
        background: var(--cui-gray-2);
        width: 5px;
    }

</style>