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
        <cui-card noPadding>
            <cc_p_patient_info
                v-if="$store.getters.activePatient"
            ></cc_p_patient_info>
            Patient View Reception Reservation Edit Medical
        </cui-card>
        <cui-modal
            :visible="view.modal.reception"
            closable
            @close="view.modal.reception = false"
        >
            <cui-card
                style="
                    width: 700px;
                    height: auto;
                    min-height: 200px;
                    max-height: 800px;
                "
            >
                <template #header>
                    <h2>{{ $lang.newReception }}</h2>
                </template>
                <Walkin
                    @close="view.modal.reception = false"
                    @created="getEncounters()"
                />
            </cui-card>
        </cui-modal>
        <cui-modal
            :visible="view.modal.reservation"
            closable
            @close="view.modal.reservation = false"
        >
            <cui-card style="width: 900px; height: 620px">
                <template #header> {{ $lang.newReservation }} </template>
                <Reservation
                    @close="view.modal.reservation = false"
                    @created="getEncounters()"
                />
            </cui-card>
        </cui-modal>
        <cui-modal
            :visible="view.modal.reservationAccept"
            closable
            @close="view.modal.reservationAccept = false"
        >
            <cui-card style="width: 900px; height: 500px">
                <template #header> {{ $lang.newReservation }} </template>
                <ReservationAccept
                    @close="view.modal.reservationAccept = false"
                    :data="view.modal.reservationAccept"
                />
            </cui-card>
        </cui-modal>
        <cui-modal
            :visible="view.modal.payment"
            closable
            @close="view.modal.payment = false"
        >
            <cui-card style="width: 600px; height: 600px">
                <template #header> {{ $lang.payment }} </template>
                <Payment
                    @submitted="getEncounters"
                    @close="view.modal.payment = false"
                    :encounter="modal.payment"
                    ref="payment"
                />
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>
import { cc_p_calendar } from "../parts";
import { cc_p_reception_list } from "../parts";
import { cc_p_patient_list } from "../parts";
import { cc_p_patient_info } from "../parts";
// import Payment from "./cc_reception_payment";
// import Reservation from "../shared/cc_shared_reservation";
// import ReservationAccept from "./cc_reception_reservation_accept";

export default {
    name: "ReceptionMainView",
    components: {
        cc_p_calendar,
        cc_p_reception_list,
        cc_p_patient_list,
        cc_p_patient_info,
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
                done: false,
                modal: {
                    reception: false,
                    reservation: false,
                    reservationAccept: false,
                    payment: false,
                },
            },
            modal: {
                payment: null,
            },
            docStati: [null, this.$lang.free, this.$lang.inEncounter],
            doctors: [],
        };
    },
    computed: {
        hasActivePatient() {
            return this.$store.getters.activePatient;
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
    grid-template-rows: 50% 50%;
}
</style>