<template>
    <div class="control-floater">
        <div>
            <cui-button plain :label="$lang.view" icon="fas fa-columns"></cui-button>
        </div>
        <div style="display: flex">
            <cui-button :label="$lang.reservation" icon="fas fa-calendar-plus"></cui-button>
            <cui-button warn :label="$lang.pause" icon="fas fa-pause"></cui-button>
            <cui-button primary :label="$lang.finish" icon="fas fa-check-double" @click="confirmExaminationClose = true" :disabled="!encounterState"></cui-button>
        </div>
    </div>
    <div class="cc-medical-examination-main">
        <cui-card>
            <patientMedicalInfo
                :encounter="encounterState"
            ></patientMedicalInfo>
        </cui-card>
        <cui-card no-padding>
            <template #header>
                <div style="display: flex; justify-content: space-between; width: calc(100% - 20px)">
                    <h2>{{ $lang.karte }}</h2>
                    <div class="cc-medical-exam-loader-cont" v-if="saving">
                        <div> {{ $lang.saving }} </div>
                        <div class="loader" style="background-color: transparent"/>
                    </div>
                    <div v-else-if="saved">
                        <i class="fas fa-check"></i>
                        {{ $lang.save }}{{ $lang.done }}
                    </div>
                </div>
            </template>
            <karte v-if="encounterState" :encounter="encounterState" ref="karte" @update="updateState"/>
        </cui-card>
        <cui-card>
            <procedures-browser @select="addProcedure"></procedures-browser>
        </cui-card>
    </div>
    <div class="loader" v-if="loading"></div>

    <!-- Modals -->
    <cui-modal :visible="confirmExaminationClose" @close="confirmExaminationClose = false">
        <cui-card style="width: 250px; height: 180px">
            <template #header> {{ $lang.confirm }} </template>
            <h4> {{ $lang.confirmExaminationClose }} </h4>
            <div style="display: flex; justify-content: flex-end">
                <cui-button plain :label="$lang.cancel" @click="confirmExaminationClose = false"/>
                <cui-button primary :label="$lang.finish" @click="closeExamination"/>
            </div>
        </cui-card>
    </cui-modal>
    <cui-modal :visible="submitErrors.length > 0" @close="submitErrors = []">
        <cui-card style="width: 1000px; height: 400px;" noPadding>
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between">
                <cui-table square :data="submitErrors" style="height: auto; max-height: 400px">
                    <template #header>
                        <div>
                            <h2>{{ $lang.procedureErrors }} {{ $lang.confirmInput }}</h2>
                        </div>
                    </template>
                    <template v-slot:row="row">
                        <td>
                            {{ encounterState.karte.procedures[row.index].name }}
                        </td>
                        <td>
                            <div v-for="(item, i) in row.errors" :key="i">
                                {{ $lang.validationMessages[item.context.label] }}:
                                {{ item.message }}
                            </div>
                        </td>
                    </template>
                </cui-table>
                <div style="display: flex; justify-content: flex-end; padding: 10px">
                    <cui-button plain :label="$lang.cancel" @click="submitErrors = []"/>
                    <cui-button primary :label="$lang.finish" @click="closeExamination"/>
                </div>
            </div>
        </cui-card>
    </cui-modal>

</template>

<script>

import karte from "./cc_medical_karte.vue";
import proceduresBrowser from "../shared/cc_shared_procedures_browser.vue";
import baseCostUtil from "../../utils/encounterBaseCost";
import patientMedicalInfo from "../shared/cc_shared_medical_info/cc_shared_patient_medical_info_main.vue"
import procedureCheck from "../../utils/procedureCheck"

export default {
    components: {
        karte,
        proceduresBrowser,
        patientMedicalInfo
    },
    emits: [
        'cancel',
        'examinationClosed'
    ],
    props: {
        encounter: {
            default: null
        }
    },
    data() {
        return {
            saving: false,
            saved: false,
            encounterState: null,
            loading: false,
            confirmExaminationClose: false,
            postExaminationClose: false,
            baseCost: null,
            submitErrors:  []
        }
    },
    mounted() {
        this.prepareEncounter();
        this.$dataService().get.patient.medicalHistory(this.encounter.patient.id);
        this.$options.sockets.onmessage = (data) => {
            data = JSON.parse(data.data);
            if(data.event === "updateOrder") this.handelUpdateOrder(data.data)
        };
    },
    methods: {
        async prepareEncounter() {
            let encounterId = this.encounter.id;

            let preparedEncounter = await this.$dataService().get.encounters.findOne(encounterId)

            if (preparedEncounter.baseCost.length < 1) {

                    let baseCost = await baseCostUtil(
                    this.encounter, 
                    this.$store.getters.staticLists.encounterBaseCost, 
                    this.$store.getters.settings.clinicBaseInfo.public
                );
                preparedEncounter.baseCost = baseCost;
            }
            preparedEncounter.doctor = this.$store.getters.user.id;
            this.encounterState = preparedEncounter;

        },
        handelUpdateOrder(order) {
            if (order.encounterId === this.encounterState._id) {
                const index = this.encounterState.karte.procedures.findIndex((el) => el.order?.id === order.id)
                this.encounterState.karte.procedures[index].order = {
                    done: order.done,
                    id: order.id,
                    locked: order.locked
                }
            }
        },
        addProcedure(item) {
            item = JSON.parse(JSON.stringify(item.row));
            this.$refs.karte.addProcedure(item);
        },
        async updateState(state) {
            this.saved = false;
            this.saving = true;
            this.encounterState.karte = state;
            await this.$dataService().put.encounters(this.encounterState);
            this.saving = false;
            this.saved = true;
        },
        async closeExamination() {
            this.confirmExaminationClose = false;
            let errors = [];
            this.loading = true;

            this.encounterState.karte.procedures.forEach((proc, index) => {
                let error = procedureCheck(index, proc);
                if(error) errors.push(error);
            });
            if (errors.length > 0) {
                this.loading = false;
                this.submitErrors = errors;
                return;
            }

            let encounter = this.encounterState;
            encounter.status = 10;
            encounter.closeEncounter = true;
            try {
                await this.$dataService().put.encounters(encounter);
                this.$cui.notification({
                    text: this.$lang.examinationClosed,
                    duration: 3000,
                    color: 'primary'
                })
                this.$emit('examinationClosed');
                this.$emit('cancel');
            } catch (error) {this.loading = false}
        }
    }
}
</script>

<style scoped>
    .cc-medical-examination-main {
        height: 100%;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 30% auto 400px;
    }
    .control-floater {
        position: absolute;
        right: 0;
        top: 0;
        width: 430px;
        height: 45px;
        margin: 5px 10px;
        border-radius: 10px;
        padding-top: 3px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 30%);
        display: flex;
        justify-content: space-between;
    }
    .cc-medical-exam-loader-cont {
        position: relative;
        display: flex;
        width: 200px;
        justify-content: flex-end;
        align-items: center;
        margin-right: -20px;
        opacity: 0.7
    }
    .cc-medical-exam-loader-cont .loader {
        position: relative;
        width: 50px;
        align-items: center;
        justify-content: center;
        display: flex;
    }
</style>