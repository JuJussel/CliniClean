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
                v-if="$store.getters.activePatient"
                style="height: 100%"
            ></cc_p_patient_info>
            <cui-tag v-else>{{ $lang.noPatientSelected }}</cui-tag>
        </cui-card>

        <!---------------- Modals ---------------->

        <cui-modal
            :visible="$store.getters.layoutData.receptionModalRegister"
            closable
            @close="
                $store.commit('SET_LAYOUT_DATA', {
                    receptionModalRegister: false
                })
            "
        >
            <cui-card style="width: 900px; height: 400px">
                <template #header>
                    <h2>
                        {{ $store.getters.activePatient.name
                        }}{{ $lang.newReception }}
                    </h2>
                </template>
                <cc_p_reception_register />
            </cui-card>
        </cui-modal>

        <cui-modal
            :visible="$store.getters.layoutData.receptionModalReservation"
            closable
            @close="
                $store.commit('SET_LAYOUT_DATA', {
                    receptionModalReservation: false
                })
            "
        >
            <cui-card style="width: 1000px; height: 640px">
                <template #header>
                    <h2>
                        {{ $store.getters.activePatient.name
                        }}{{ $lang.reservation }}
                    </h2>
                </template>
                <cc_p_reception_reservation />
            </cui-card>
        </cui-modal>

        <cui-modal
            :visible="$store.getters.layoutData.receptionModalPatientEdit"
            closable
            @close="
                $store.commit('SET_LAYOUT_DATA', {
                    receptionModalPatientEdit: false
                })
            "
        >
            <cui-card style="width: 1100px; height: 600px">
                <template #header>
                    <h2 v-if="$store.getters.activePatient">
                        {{ $store.getters.activePatient.name }}{{ $lang.edit }}
                    </h2>
                    <h2 v-else>{{ $lang.patient }}{{ $lang.register }}</h2>
                </template>
                <cc_p_patient_edit />
            </cui-card>
        </cui-modal>

        <cui-modal
            :visible="$store.getters.layoutData.receptionModalInsuranceEdit"
            closable
            @close="
                if (!$refs.insuranceModal.loading.all) {
                    $store.commit('SET_LAYOUT_DATA', {
                        receptionModalInsuranceEdit: false
                    });
                }
            "
        >
            <cui-card style="width: 1100px; height: 550px">
                <template #header>
                    <h2>
                        {{ $store.getters.activePatient.name
                        }}{{ $lang.insurance }}{{ $lang.register }}
                    </h2>
                </template>
                <cc_p_insurance_edit ref="insuranceModal" />
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>
import {
    cc_p_calendar,
    cc_p_reception_list,
    cc_p_patient_list,
    cc_p_patient_info,
    cc_p_reception_register,
    cc_p_reception_reservation,
    cc_p_patient_edit,
    cc_p_insurance_edit
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
        cc_p_insurance_edit
        // Reservation,
        // Walkin,
        // ReservationAccept,
        // Payment,
    },
    created() {
        this.$store.commit("SET_ACTIVE_PATIENT", null);
    },
    data() {
        return {
            view: {
                reservation: true,
                active: true,
                done: false
            },
            modal: {
                payment: null,
                reception: {
                    mode: "rec"
                }
            },
            docStati: [null, this.$lang.free, this.$lang.inEncounter],
            doctors: []
        };
    },
    computed: {
        hasActivePatient() {
            return this.$store.getters.activePatient;
        }
    },
    methods: {
        savePayment() {
            this.$refs.payment.savePayment();
        }
    }
};
</script>

<style scoped>
.cc-reception-main-cont {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 40% 60%;
}
</style>