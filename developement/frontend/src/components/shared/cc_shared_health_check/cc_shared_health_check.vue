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
                <cui-input @update:modelValue="calcBMI" :label="$lang.height" v-model="input.height.value" type="number" style="max-width: 150px" />
                <cui-input @update:modelValue="calcBMI" :label="$lang.weight" v-model="input.weight.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.bmi" v-model="input.bmi.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.stomacheWidth" v-model="input.stomacheWidth.value" type="number" style="max-width: 150px; margin-left: 20px" />
            </div>
            <div style="display: flex">
                <cui-input :label="$lang.bloodPreasureMin" v-model="input.bloodPreasureMin.value" type="number" style="max-width: 150px" />
                <cui-input :label="$lang.bloodPreasureMax" v-model="input.bloodPreasureMax.value" type="number" style="max-width: 150px; margin-left: 20px" />
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

[3A0100000023271,
1C0100000041271,
1A0150000004271,
3A0150000023271,
3A0150000004061,
3A0150000001061,
3A0160000023919,
3A0200000023237,
3A0200000001233,
3A0300000023292,
3B0100000023272,
3B0150000023272,
3B0150000023051,
3B0250000023233,
3B0350000023272,
3B0400000023272,
3B0450000023272,
3B0500000023279,
3B0550000023233,
3B0700000023275,
3B0720000023052,
3B0760000041052,
3B0800000023238,
3B0900000023271,
3B1000000023272,
3B1100000023272,
3B1250000023271,
3B1300000023272,
3B1350000023271,
3B1600000023271,
3B1600000001271,
3B1650000023233,
3B1650000001233,
3B1750000023271,
3B1800000023271,
3B1850000023062,
3B1920000023005,
3B1920000022005,
3B1950000023062,
3B2000000058062,
3B2220000023023,
3B2550000023292,
3B2550000001292,
3B3250000023271,
3B3300000001272,
3B3390000023052,
3B5030000023062,
3B3470000023920,
3B3470000023920,
3C0100000023271,
3C0100000004271,
3C0150000023271,
3C0150000004271,
3C0160000023064,
3C0200000023271,
3C0200000004271,
3C0250000023272,
3C0250000004272,
3C0400000031271,
3C0450000022205,
3C0450000004204,
3C0460000022205,
3C0460000022205,
3C0470000023271,
3C0500000022204,
3C0500000041204,
3C0550000004204,
3C0700000022205,
3D0100000022272,
3D0460000019271,
3D0550000023271,
3D0550000022271,
3D0800000023062,
3D0800000042062,
3D0850000023271,
3D1050000023272,
3E0100000031271,
3E0150000031271,
3E0250000004237,
3E0300000001272,
3E0300000023272,
3E0450000023271,
3E0450000020271,
3E0600000023202,
3E0600000001202,
3E1050000001203,




]