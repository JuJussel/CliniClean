<template>
    <div class="cc-scoped-wrapper">
        <div style="display: flex; align-items: center; margin-bottom: ">
            <span style="width: 150px; display: flex; align-items: center">
                <h2>{{ $lang.basic }}</h2>
                <cui-button icon="fas fa-edit" plain @click="showBasicModal" />
            </span>
            <span
                style="display: flex; align-items: center; margin-right: 20px"
            >
                <span> {{ $lang.bloodType }} </span>
                <cui-tag>
                    {{ medicalStore.medicalData.bloodType || this.$lang.unknown }}
                </cui-tag>
            </span>
            <!-- <span
                style="display: flex; align-items: center; margin-right: 20px"
            >
                <span> {{ $lang.alcohol }} </span>
                <cui-tag>
                    {{ patientData.alcohol || this.$lang.unknown }}
                </cui-tag>
            </span> -->
            <!-- <span
                style="display: flex; align-items: center; margin-right: 20px"
            >
                <span> {{ $lang.tabaco }} </span>
                <cui-tag>
                    {{ patientData.tabaco || this.$lang.unknown }}
                </cui-tag>
            </span> -->
        </div>
        <div class="grid-tables">
            <cui-card noPadding>
                <allergies></allergies>
            </cui-card>

            <cui-card noPadding>
                <cui-table>
                    <template #header>
                        <h3> Problem </h3>
                    </template>
                </cui-table>
            </cui-card>
            <cui-card noPadding>
                <perscriptions activeOnly></perscriptions>
            </cui-card>
            <cui-card>
                <cui-table>
                    <template #header>
                        <h3> Imunization </h3>
                    </template>
                </cui-table>
            </cui-card>
            <cui-card>
                <orders pendingOnly></orders>
            </cui-card>
            <cui-card noPadding>
                <diseases activeOnly></diseases>
            </cui-card>
            <cui-card>
                    <h3>Risk factors</h3>
                    <div style="display: grid; grid-template-columns: 50% auto">
                        <h5>Lifestyle - tabace alk,...</h5>
                        <h5>Family history</h5>
                        <h5>Asessment</h5>
                        <h5>Relatives</h5>
                    </div>
            </cui-card>
        </div>
        
        
        <h3>Forms</h3>            

        <cui-table style="grid-column-end: span 2">
            <template #header>
                <h3>{{ $lang.note }}</h3>
            </template>
        </cui-table>
        <cui-modal
            :visible="modals.basic.visible"
            :closable="!modals.basic.loading"
            @close="modals.basic.visible = false"
        >
            <cui-card style="width: 250px; height: auto; position: relative">
                <template #header> {{ $lang.basic }} </template>
                <div style="position: relative">
                    <div class="loader" v-if="modals.basic.loading" />
                    {{ $lang.bloodType }}
                    <div
                        style="
                            display: flex;
                            justify-content: space-between;
                            width: 100%;
                        "
                    >
                        <div>
                            <cui-radio
                                v-model="modals.basic.data.bloodType"
                                :label="$lang.unknown"
                                :value="$lang.unknown"
                            />
                        </div>
                        <div>
                            <cui-radio
                                v-model="modals.basic.data.bloodType"
                                v-for="(item, index) in bloodTypes.minus"
                                :key="index"
                                :label="item"
                                :value="item"
                            />
                        </div>
                        <div>
                            <cui-radio
                                v-model="modals.basic.data.bloodType"
                                v-for="(item, index) in bloodTypes.plus"
                                :key="index"
                                :label="item"
                                :value="item"
                            />
                        </div>
                    </div>
                    <!-- <cui-input
                        :label="$lang.alcohol"
                        v-model="modals.basic.data.alcohol"
                        :append="$lang.countCup"
                    />
                    <cui-input
                        :label="$lang.tabaco"
                        v-model="modals.basic.data.tabaco"
                        :append="$lang.countStick"
                    /> -->
                </div>
                <template #footer>
                    <cui-button
                        :label="$lang.cancel"
                        @click="this.modals.basic.visible = false"
                        plain
                        :loading="modals.basic.loading"
                    />
                    <cui-button
                        :label="$lang.register"
                        primary
                        @click="updateBasic"
                        :loading="modals.basic.loading"
                    />
                </template>
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import { usePatientStore } from '@/stores/patient'
import { useMedicalStore } from '@/stores/medical'
import { mapStores } from 'pinia'

import diseases from './cc_p_patient_info_medical_diseases.vue'
import perscriptions from './cc_p_patient_info_medical_perscription.vue'
import orders from './cc_p_patient_info_medical_orders.vue'
import allergies from './cc_p_patient_info_medical_allergies'

export default {
    components: {
        diseases,
        perscriptions,
        orders,
        allergies
    },
    props: {
        outline: {
            default: false,
            type: Boolean,
        },
        square: {
            default: true,
            type: Boolean,
        },
    },
    data() {
        return {
            modals: {
                basic: {
                    loading: false,
                    visible: false,
                },
            },
            bloodTypes: {
                minus: ["0-", "A-", "B-", "AB-"],
                plus: ["0+", "A+", "B+", "AB+"],
            },
        };
    },
    computed: {
        ...mapStores(usePatientStore, useMedicalStore),
        basicTable() {
            return [
                { label: this.$lang.id, value: this.patientStore.patientData.id },
                {
                    label: this.$lang.age,
                    value: this.$dayjs().diff(
                        this.patientStore.patientData.birthdate,
                        "year"
                    ),
                },
                {
                    label: this.$lang.gender,
                    value:
                        this.patientStore.patientData.gender == 1
                            ? this.$lang.male
                            : this.$lang.female,
                },
            ];
        }
    },
    methods: {
        showBasicModal() {
            this.modals.basic.data = {
                bloodType: JSON.parse(
                    JSON.stringify(this.patientStore.patientData.bloodType || "不明")
                ),
            };
            this.modals.basic.visible = true;
        },
        async updateBasic() {
            this.modals.basic.loading = true;
            const sendData = {
                data: this.modals.basic.data,
                patientId: this.patientData.id,
            };
            await this.$dataService().put.medical.basics(sendData);
            let patientHistory =
                await this.$dataService().get.patient.medicalHistory(
                    this.patientData.id
                );

            this.usePatientStore.patientData = patientHistory
            this.$store.commit("SET_LAYOUT_DATA", [
                "medical",
                { patient: patientHistory },
            ]);
            this.modals.basic.loading = false;
            this.modals.basic.visible = false;
        },
    },

};
</script>

<style scoped>
.grid-tables {
    display: flex; 
    flex-wrap: wrap;
}
.grid-tables > div{
    min-width: 400px;
    flex-grow: 1;
    width: auto!important;
}
</style>