<template>
    <div class="grid">
        <div>
            <h3> {{ $lang.historyFull }} </h3>
            <div class="switch-cont">
                <cui-switch :label="$lang.medicationHistory" v-model="input.medicationHistory.value"/>
                <cui-textarea
                    v-if="input.medicationHistory.value"
                    v-model="input.medicationHistory.note"
                    noNote
                    :placeholder="$lang.input"
                    style="margin-left: 10px"/>
            </div>
            <div class="switch-cont">
                <cui-switch :label="$lang.medicalHistory" v-model="input.medicalHistory.value"/>
                <cui-textarea
                    v-if="input.medicalHistory.value"
                    v-model="input.medicalHistory.note"
                    noNote
                    :placeholder="$lang.input"
                    style="margin-left: 10px"/>
            </div>
            <div class="switch-cont">
                <cui-switch :label="$lang.subjectiveSymtoms" v-model="input.subjectiveSymtoms.value"/>
                <cui-textarea
                    v-if="input.subjectiveSymtoms.value"
                    v-model="input.subjectiveSymtoms.note"
                    noNote
                    :placeholder="$lang.input"
                    style="margin-left: 10px"/>
            </div>
            <div class="switch-cont">
                <cui-switch :label="$lang.objectiveSymtoms" v-model="input.objectiveSymtoms.value"/>
                <cui-textarea
                    v-if="input.objectiveSymtoms.value"
                    v-model="input.objectiveSymtoms.note"
                    noNote
                    :placeholder="$lang.input"
                    style="margin-left: 10px"/>
            </div>
            <h3> {{ $lang.basic }} </h3>
            <div style="display: flex">
                <cui-input :label="$lang.height" v-model="input.height.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.weight" v-model="input.weight.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.bmi" v-model="input.bmi.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.stomacheWidth" v-model="input.stomacheWidth.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <h3> {{ $lang.bloodPreasure }} </h3>
            <div style="display: flex">
                <cui-input :label="$lang.bloodPreasureMin" v-model="input.bloodPreasureMin.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.bloodPreasureMax" v-model="input.bloodPreasureMax.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <h3> {{ $lang.eyeSight }} </h3>
            <div style="display: flex">
                <cui-input :label="$lang.sightLeft" v-model="input.sightLeft.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.sightRight" v-model="input.sightRight.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <h3> {{ $lang.hearingEvaluation }} </h3>
            <div style="display: flex">
                <cui-input :label="$lang.hearingLeftLow" v-model="input.hearingLeftLow.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.hearingLeftHight" v-model="input.hearingLeftHight.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.hearingRightLow" v-model="input.hearingRightLow.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.hearingRightHigh" v-model="input.hearingRightHigh.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <h3> {{ $lang.other }} </h3>
            <!-- <div v-for="(item, index) in input" :key="index">
                <cui-input :label="$lang[item.label]" v-if="item.type === 'text'" style="max-width: 150px"></cui-input>
                <cui-input :label="$lang[item.label]" v-if="item.type === 'number'" type="number" style="max-width: 150px"></cui-input>
            </div> -->
        </div>
        <div>
            Test
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: {
                medicationHistory: {value: false, note: ""},
                medicalHistory: {value: false, note: ""},
                subjectiveSymtoms: {value: false, note: ""},
                objectiveSymtoms: {value: false, note: ""},
                height: {value: ""},
                weight: {value: ""},
                bmi: {value: ""},
                stomacheWidth: {value: ""},
                bloodPreasureMax: {value: ""},
                bloodPreasureMin: {value: ""},
                sightLeft: {value: ""},
                sightRight: {value: ""},
                hearingLeftLow: {value: ""},
                hearingLeftHight: {value: ""},
                hearingRightLow: {value: ""},
                hearingRightHigh: {value: ""},
                ecgId: {value: ""},
                xRayId: {value: ""},
            },
            input2: [
                {label: "medicationHistory", value: true, type: "boolean", error: false, note: ""},
                {label: "medicalHistory", value: false, type: "boolean", error: false, note: ""},
                {label: "subjectiveSymtoms", value: false, type: "boolean", error: false, note: ""},
                {label: "objectiveSymtoms", value: false, type: "boolean", error: false, note: ""},
                {label: "height", value: null, type: "number", error: false},
                {label: "weight", value: null, type: "number", error: false},
                {label: "bmi", value: null, type: "number", error: false},
                {label: "stomacheWidth", value: null, type: "number", error: false},
                {label: "bloodPreasureMax", value: null, type: "number", error: false},
                {label: "bloodPreasureMin", value: null, type: "number", error: false},
                {label: "sightLeft", value: null, type: "number", error: false},
                {label: "sightRight", value: null, type: "number", error: false},
                {label: "hearingLeftLow", value: false, type: "boolean", error: false},
                {label: "hearingLeftHight", value: false, type: "boolean", error: false},
                {label: "hearingRightLow", value: false, type: "boolean", error: false},
                {label: "hearingRightHigh", value: false, type: "boolean", error: false},
                {label: "ecgId", value: null, type: "text", error: false},
                {label: "xRayId", value: null, type: "text", error: false},
            ],
            xRaySchemaId: null
        }
    }
}
</script>

<style scoped>
    .switch-cont {
        margin: 10px 0;
        display: flex;
        overflow: auto;
    }
    .grid {
        display: grid;
        grid-template-columns: 50% 50%;
    }
    
</style>