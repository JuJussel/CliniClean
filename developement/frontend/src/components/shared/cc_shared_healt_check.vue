<template>
    <div>
        <div v-for="(item, index) in input" :key="index">
            <cui-switch v-if="item.type === 'boolean'" v-model="item.value"></cui-switch>
            <cui-input v-if="item.type === 'text'"></cui-input>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: [
                {label: "medicationHistory", value: false, type: "boolean", error: false},
                {label: "MedicationHistoryText", value: null, type: "text", error: false},
                {label: "medicalHistory", value: false, type: "boolean", error: false},
                {label: "medicalHistoryText", value: null, type: "text", error: false},
                {label: "subjectiveSymtoms", value: false, type: "boolean", error: false},
                {label: "subjectiveSymtomsText", value: null, type: "text", error: false},
                {label: "objectiveSymtoms", value: false, type: "boolean", error: false},
                {label: "objectiveSymtomsText", value: null, type: "text", error: false},
                {label: "height", value: null, type: "number", error: false},
                {label: "weight", value: null, type: "number", error: false},
                {label: "bmi", value: null, type: "number", error: false},
                {label: "stomacheWidth", value: null, type: "number", error: false},
                {label: "ecg", value: null, type: "text", error: false},
                {label: "xRayId", value: null, type: "text", error: false},
                {label: "bloodPreasureMax", value: null, type: "number", error: false},
                {label: "bloodPreasureMin", value: null, type: "number", error: false},
                {label: "sightLeft", value: null, type: "number", error: false},
                {label: "sightRight", value: null, type: "number", error: false},
                {label: "hearingLeftLow", value: false, type: "boolean", error: false},
                {label: "hearingLeftHight", value: false, type: "boolean", error: false},
                {label: "hearingRightLow", value: false, type: "boolean", error: false},
                {label: "hearingRightHigh", value: false, type: "boolean", error: false},
                {label: "xRaySchemaId", value: false, type: "boolean", error: false}
            ]
        }
    }
}
</script>