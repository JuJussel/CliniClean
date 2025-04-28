<template>
    <div class="cc-reception-main-cont">
        <div style="overflow: hidden">
            <cc_p_patient_info_medical v-if="!loading" :loading="loading" />
        </div>
        <div class="resizer" @mousedown.stop="resizeHandler" />
        <cui-card :loading="loading" no-padding style="overflow: hidden">
            <cc_p_karte v-if="encounterStore.encounterData" />
            <div v-else style="padding: 10px">{{ $lang.noKarteSelected }}</div>
        </cui-card>
    </div>
</template>

<script>

import { useMedicalStore } from "@/stores/medical";
import { usePatientStore } from "@/stores/patient";
import { useUiStore } from "@/stores/ui";
import { useEncounterStore } from "@/stores/encounter";
import { mapStores } from "pinia";
import { cc_p_patient_info_medical, cc_p_karte } from "../parts";

export default {
    components: {
        cc_p_patient_info_medical,
        cc_p_karte,
    },
    async mounted() {
        this.getData();
    },
    data() {
        return {
            loading: true,
            resizeData: {
                start: null,
                startWidth: 900,
                widthInteger: null,
            },
        };
    },
    methods: {
        async getData() {
            this.loading = true;

            // NEW NEW NEW
            const patientData = await this.$api.get('patients/' + this.uiStore.medicalTab.id)
            this.patientStore.patientData = patientData

            const medicalData = await this.$api.get('patients/' + this.patientId + '/medical')
            this.medicalStore.medicalData = medicalData.medicalData

            // NEW END END
            this.loading = false;
        },
        resizeHandler(mousedown) {
            if (mousedown) {
                this.resizeData.start = event.clientX;
                document.addEventListener("mousemove", this.mouseMoveHandler);
                document.addEventListener("mouseup", this.mouseUpHandler);
            }
        },
        mouseMoveHandler() {
            event.preventDefault();
            const dx = event.clientX - this.resizeData.start;
            let newWidth = this.resizeData.startWidth + dx;
            newWidth <= 100
                ? this.resizeData.widthInteger
                : (this.resizeData.widthInteger = newWidth);
        },
        mouseUpHandler() {
            this.resizeData.startWidth = this.resizeData.widthInteger;
            document.removeEventListener("mousemove", this.mouseMoveHandler);
            document.removeEventListener("mouseup", this.mouseUpHandler);
        },
    },
    watch: {
        async patientId() {
            this.getData();
        },
    },
    computed: {
        ...mapStores(useMedicalStore, usePatientStore, useUiStore, useEncounterStore),
        finalWidth() {
            return (
                (this.resizeData.widthInteger || this.resizeData.startWidth) +
                "px"
            );
        },
        patientId() {
            return this.patientStore.patientData?.id || null;
        },
    },
};
</script>

<style scoped>
.cc-reception-main-cont {
    display: grid;
    grid-template-columns: v-bind(finalWidth) 5px auto;
}

.resizer {
    cursor: ew-resize;
    background: var(--cui-gray-2);
    width: 5px;
}
</style>