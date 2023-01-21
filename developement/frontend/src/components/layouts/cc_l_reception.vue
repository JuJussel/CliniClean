<template>
    <div class="cc-reception-main-cont">
        <cui-card class="cc-reception-patient-list" noPadding>
            <cc_p_reception_list></cc_p_reception_list>
        </cui-card>
        <cui-card>
            <cc_p_patient_list></cc_p_patient_list>
        </cui-card>
        <cui-card noPadding>
            <cc_p_calendar
                style="height: calc(100% - 1px)"
                ref="calendar"
            ></cc_p_calendar>
        </cui-card>
        <cui-card>
            <cc_p_patient_info
                v-if="hasActivePatient"
                style="height: 100%"
            ></cc_p_patient_info>
            <cui-tag v-else>{{ $lang.noPatientSelected }}</cui-tag>
        </cui-card>

        <!---------------- Modals ---------------->

        <cui-modal
            :visible="
                $store.getters.layoutData.reception?.receptionModalRegister
            "
            closable
            @close="
                $store.commit('SET_LAYOUT_DATA', [
                    'reception',
                    { receptionModalRegister: false },
                ])
            "
        >
            <cui-card style="width: 900px; height: 400px">
                <template #header>
                    <h2>
                        {{ patientStore.patientData.name
                        }}{{ $lang.newReception }}
                    </h2>
                </template>
                <cc_p_reception_register />
            </cui-card>
        </cui-modal>

        <cui-modal
            :visible="
                $store.getters.layoutData.reception?.receptionModalReservation
            "
            closable
            @close="
                $store.commit('SET_LAYOUT_DATA', [
                    'reception',
                    { receptionModalReservation: false },
                ])
            "
        >
            <cui-card style="width: 1000px; height: 640px">
                <template #header>
                    <h2>
                        {{ patientStore.patientData.name
                        }}{{ $lang.reservation }}
                    </h2>
                </template>
                <cc_p_reception_reservation />
            </cui-card>
        </cui-modal>

        <cui-modal
            :visible="
                $store.getters.layoutData.reception?.receptionModalPatientEdit
            "
            closable
            @close="
                $store.commit('SET_LAYOUT_DATA', [
                    'reception',
                    { receptionModalPatientEdit: false },
                ])
            "
        >
            <cui-card style="width: 1100px; height: 600px">
                <template #header>
                    <h2 v-if="hasActivePatient">
                        {{ patientStore.patientData.name }}{{ $lang.edit }}
                    </h2>
                    <h2 v-else>{{ $lang.patient }}{{ $lang.register }}</h2>
                </template>
                <cc_p_patient_edit />
            </cui-card>
        </cui-modal>

        <cui-modal
            :visible="
                $store.getters.layoutData.reception?.receptionModalInsuranceEdit
            "
            closable
            @close="
                if (!$refs.insuranceModal.loading.all)
                    $store.commit('SET_LAYOUT_DATA', [
                        'reception',
                        { receptionModalInsuranceEdit: false },
                    ]);
            "
        >
            <cui-card style="width: 1100px; height: 550px">
                <template #header>
                    <h2>
                        {{ patientStore.patientData.name
                        }}{{ $lang.insurance }}{{ $lang.register }}
                    </h2>
                </template>
                <cc_p_insurance_edit ref="insuranceModal" />
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import { usePatientStore } from '@/stores/patient'
import { mapStores } from 'pinia'

import {
    cc_p_calendar,
    cc_p_reception_list,
    cc_p_patient_list,
    cc_p_patient_info,
    cc_p_reception_register,
    cc_p_reception_reservation,
    cc_p_patient_edit,
    cc_p_insurance_edit,
} from "../parts";

export default {
    name: "ReceptionMainView",
    components: {
        cc_p_calendar,
        cc_p_reception_list,
        cc_p_patient_list,
        cc_p_patient_info,
        cc_p_reception_register,
        cc_p_reception_reservation,
        cc_p_patient_edit,
        cc_p_insurance_edit,
        // Reservation,
        // Walkin,
        // ReservationAccept,
        // Payment,
    },
    created() {
        this.patientStore.patientData = null
    },
    data() {
        return {
            view: {
                reservation: true,
                active: true,
                done: false,
            },
            modal: {
                payment: null,
                reception: {
                    mode: "rec",
                },
            },
            docStati: [null, this.$lang.free, this.$lang.inEncounter],
            doctors: [],
        };
    },
    computed: {
        ...mapStores(usePatientStore),
        hasActivePatient() {
            return this.patientStore.patientData;
        },
    },
    methods: {
        savePayment() {
            this.$refs.payment.savePayment();
        },
    },
};
</script>

<style scoped>
.cc-reception-main-cont {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 40% 60%;
}
</style>