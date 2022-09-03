<template>
    <div class="cc-reception-main-cont">
        <cui-card :loading="loading">
            <cc_p_patient_info_medical v-if="!loading"/>
        </cui-card>
        <div 
                class="resizer"
                @mousedown.stop="resizeHandler"
            />

        <cui-card :loading="loading"></cui-card>
    </div>
</template>

<script>

import { cc_p_patient_info_medical } from "../parts"

export default {
    components: {
        cc_p_patient_info_medical
    },
    async mounted() {
        let patientId = this.$store.getters.activeEncounter.patient.id;
        let patientHistory = await this.$dataService().get.patient.medicalHistory(patientId);
        this.$store.commit('SET_ACTIVE_ENCOUNTER', {patient: patientHistory})
        this.loading = false;
    },
    data()  {
        return {
            loading: true,
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
    .cc-reception-main-cont {
        display: grid;
        grid-template-columns: v-bind(finalWidth) 5px auto;;
    }
    .resizer {
        cursor: ew-resize;
        background: var(--cui-gray-2);
        width: 5px;
    }
    </style>