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
            <h3>Exams</h3>
            <div style="display: flex">
                <cui-radio label="Order" value="order" v-model="mode" style="margin-right: 10px" />
                <cui-radio label="Input" value="input" v-model="mode" />
            </div>
            <div v-if="mode === 'order'">
                <div style="display: flex; align-items: baseline; padding: 10px">
                    <span style="width: 70px"> {{ $lang.examProvider }} </span>
                    <cui-select
                        :data="examProviders"
                        displayValueProp="label"
                        v-model="provider"
                        style="width: 200px; margin-left: 20px"
                    ></cui-select>
                </div>
                <cui-textarea label="deit" placeholder="Ordernumber or so" />
            </div>
            <div v-else>
                <exam-Input
                    v-for="(item,index) in examinations"
                    :key="index"
                    @update="updateLocalOrderVar"
                    :item="orderLocal.procedure"
                    style="max-width: 600px"
                />

            </div>
        </div>
    </div>
</template>

<script>
import examInput from "./cc_shared_procedures_list/cc_shared_procedure_exam.vue";

export default {
    components: {
        examInput
    },
    async created() {
        this.examinations = await this.$dataService().get.lists.healthCheckExams();
    },
    data() {
        return {
            mode: 'order',
            provider: null,
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
            xRaySchemaId: null,
            examinations: null
        }
    },
    computed: {
        examProviders() {
            return [{ name: "inhouse", label: this.$lang.inhouse }].concat(
                this.$store.getters.settings.examinationProviders.public
            );
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