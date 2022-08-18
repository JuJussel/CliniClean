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
            <!-- Patient View Reception Reservation Edit Medical -->
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
                <cc_p_reception_register></cc_p_reception_register>
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
                <cc_p_reception_reservation></cc_p_reception_reservation>
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
    cc_p_reception_reservation
} from "../parts";

export default {
    name: "ReceptionMainView",
    components: {
        cc_p_calendar,
        cc_p_reception_list,
        cc_p_patient_list,
        cc_p_patient_info,
        cc_p_reception_register,
        cc_p_reception_reservation
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