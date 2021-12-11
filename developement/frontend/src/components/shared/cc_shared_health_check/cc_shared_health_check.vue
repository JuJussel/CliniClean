<template>
    <div class="grid">
        <div>
            <div class="switch-cont">
                <cui-switch :label="$lang.medicationHistory" v-model="input.medicationHistory.value"/>
                <cui-textarea
                    v-if="input.medicationHistory.value"
                    v-model="input.medicationHistory.note"
                    noNote
                    :placeholder="$lang.input"
                    rows="4"
                    cols="30"
                    style="margin-left: 10px"/>
            </div>
            <div class="switch-cont">
                <cui-switch :label="$lang.medicalHistory" v-model="input.medicalHistory.value"/>
                <cui-textarea
                    v-if="input.medicalHistory.value"
                    v-model="input.medicalHistory.note"
                    noNote
                    :placeholder="$lang.input"
                    rows="4"
                    cols="30"
                    style="margin-left: 10px"/>
            </div>
            <div class="switch-cont">
                <cui-switch :label="$lang.subjectiveSymtoms" v-model="input.subjectiveSymtoms.value"/>
                <cui-textarea
                    v-if="input.subjectiveSymtoms.value"
                    v-model="input.subjectiveSymtoms.note"
                    noNote
                    :placeholder="$lang.input"
                    rows="4"
                    cols="30"
                    style="margin-left: 10px"/>
            </div>
            <div class="switch-cont">
                <cui-switch :label="$lang.objectiveSymtoms" v-model="input.objectiveSymtoms.value"/>
                <cui-textarea
                    v-if="input.objectiveSymtoms.value"
                    v-model="input.objectiveSymtoms.note"
                    noNote
                    :placeholder="$lang.input"
                    rows="4"
                    cols="30"
                    style="margin-left: 10px"/>
            </div>
            <div style="display: flex">
                <cui-input @update:modelValue="calcBMI" :label="$lang.height" v-model="input.height.value" type="number" style="max-width: 150px" :append="input.height.unit"/>
                <cui-input @update:modelValue="calcBMI" :label="$lang.weight" v-model="input.weight.value" type="number" style="max-width: 150px; margin-left: 20px" :append="input.weight.unit"/>
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.bmi" v-model="input.bmi.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.stomacheWidth" v-model="input.stomacheWidth.value" type="number" style="max-width: 150px; margin-left: 20px" :append="input.stomacheWidth.unit"/>
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.bloodPreasureMin" v-model="input.bloodPreasureMin.value" type="number" style="max-width: 150px" :append="input.bloodPreasureMin.unit"/>
                <cui-input :label="$lang.bloodPreasureMax" v-model="input.bloodPreasureMax.value" type="number" style="max-width: 150px; margin-left: 20px" :append="input.bloodPreasureMax.unit"/>
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.sightLeft" v-model="input.sightLeft.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.sightRight" v-model="input.sightRight.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.hearingLeftLow" v-model="input.hearingLeftLow.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.hearingLeftHight" v-model="input.hearingLeftHight.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.hearingRightLow" v-model="input.hearingRightLow.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.hearingRightHigh" v-model="input.hearingRightHigh.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex; align-items: center">
                <cui-input :label="$lang.xRayId" v-model="input.xRay.value" style="max-width: 120px" />
                <cui-button :label="$lang.display" @click="showXRay"></cui-button>
                <cui-input :label="$lang.ecgId" v-model="input.ecg.value" style="max-width: 120px; margin-left: 20px" />
                <cui-button :label="$lang.display" @click="showEcg"></cui-button>
            </div>

            <painter
                :width="400"
                :height="400"
                ref="xrayDraw"
                style="margin-top: 10px; width: 400px"
                :schema="input.xRay.schema + '.png'"
                :x-ray="true"
                id="K675g"
            >
            ></painter>
            <!-- <div v-for="(item, index) in input" :key="index">
                <cui-input :label="$lang[item.label]" v-if="item.type === 'text'" style="max-width: 150px"></cui-input>
                <cui-input :label="$lang[item.label]" v-if="item.type === 'number'" type="number" style="max-width: 150px"></cui-input>
            </div> -->
        </div>
        <div>
            <div style="display: flex; align-items: baseline">
                <cui-radio :label="$lang.order" value="order" v-model="mode" style="margin-right: 10px" />
                <cui-radio :label="$lang.input" value="input" v-model="mode" />
                <span style="width: 70px; margin-left: 40px"> {{ $lang.examProvider }} </span>
                <cui-select
                    :data="examProviders"
                    displayValueProp="label"
                    v-model="provider"
                    style="width: 200px; margin-left: 20px"
                ></cui-select>
            </div>
            <div v-if="mode === 'order'">
                <cui-textarea label="deit" :placeholder="$lang.input" />
            </div>
            <div v-else>
            <div v-for="(examGroup, examGroupIndex) in examinationsGrouped" :key="examGroupIndex">
                <div> <cui-tag>{{ examGroup.items[0].class.name }}</cui-tag> </div>
                <div>
                    <exam-Input
                        v-for="(exam, examIndex) in examGroup.items" 
                        :key="examIndex"
                        :item="exam"
                        style="max-width: 600px"
                    />
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import examInput from "./cc_shared_health_check_exams.vue";
import painter from "../cc_shared_painter.vue"

export default {
    components: {
        examInput,
        painter
    },
    created() {
        this.getExams();
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
                height: Object.assign( this.$store.getters.staticLists.vitalCategories.find(i => i.code === 909), {value: ""}),
                weight: Object.assign( this.$store.getters.staticLists.vitalCategories.find(i => i.code === 906), {value: ""}),
                bmi: Object.assign( this.$store.getters.staticLists.vitalCategories.find(i => i.code === 907), {value: ""}),
                stomacheWidth: Object.assign( this.$store.getters.staticLists.vitalCategories.find(i => i.code === 908), {value: ""}),
                bloodPreasureMax: Object.assign( this.$store.getters.staticLists.vitalCategories.find(i => i.code === 901), {value: ""}),
                bloodPreasureMin: Object.assign( this.$store.getters.staticLists.vitalCategories.find(i => i.code === 902), {value: ""}),
                sightLeft: {value: ""},
                sightRight: {value: ""},
                hearingLeftLow: {value: ""},
                hearingLeftHight: {value: ""},
                hearingRightLow: {value: ""},
                hearingRightHigh: {value: ""},
                ecg: {value: ""},
                xRay: {value: "", schema: "lung_schema"},
            },
            examinations: null,
            examinationsGrouped: null
        }
    },
    computed: {
        examProviders() {
            return [{ name: "inhouse", label: this.$lang.inhouse }].concat(
                this.$store.getters.settings.examinationProviders.public
            );
        }
    },
    methods: {
        showXRay() {},
        showEcg() {},
        async getExams() {
            let examinations = await this.$dataService().get.lists.healthCheckExams();
            examinations = examinations.map(item => {
                item.results.forEach(res => res.value = "");
                let procedure = {
                    class: item.procedure.procedureClass,
                    name: item.results[0].procedure.name,
                    srycd: item.results[0].procedure.code,
                    varData: item.results
                }
                return procedure;
            })

            let grouped = [];
            examinations.forEach(item => {
                const group = item.class._id;
                let index = grouped.findIndex(item => item._id === group);
                index > -1 ? grouped[index].items.push(item) : grouped.push({_id: item.class._id, items: [item]});
            });


            this.examinations = examinations;
            this.examinationsGrouped = grouped;
        },
        calcBMI() {
            setTimeout(() => {
                if (this.input.height.value > 0 && this.input.weight.value > 0) {
                    let weight = this.input.weight.value;
                    let height = this.input.height.value;
                    let bmi = (weight/Math.pow(height/100,2))
                    bmi = Math.round(bmi * 10) /10
                    this.input.bmi.value = bmi
                }                
            }, 200);
        },
        getData() {
            let data = this.input;
            data = data.map(item => {
                if(!item.vitalCode) return item;
                item.vital = this.$store.getters.staticLists.vitalCategories.find(i => i.code === item.vitalCode);
                return item;
            })
            data.exams = this.examinations;
            return data;
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
