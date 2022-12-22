<template>
    <div style="position: relative">
        <div class="loader" v-if="loading"></div>
        <div class="cc-reservation-main-cont">
            <div style="margin-right: 20px">
                <cui-select
                    :label="$lang.encounterType"
                    :placeholder="$lang.searchByNameodID"
                    :data="$store.getters.staticLists.encounterTypes"
                    displayValueProp="name"
                    returnValueProp="id"
                    v-model="reservation.encouterType"
                />
                <cui-datepicker
                    :label="$lang.date"
                    v-model="reservation.date"
                />

                <cui-datepicker
                    :label="$lang.time"
                    type="time"
                    v-model="reservation.time"
                    valueFormat="HH:mm"
                    format="HH:mm"
                    :timePickerOptions="{
                        start: '08:30',
                        step: '00:30',
                        end: '18:30',
                    }"
                />
                <cui-input :label="$lang.memo" v-model="reservation.note" />
            </div>
            <cc_p_calendar
                ref="calendar"
                :reRender="350"
                @selectDate="selectDate"
            ></cc_p_calendar>
        </div>

        <div
            style="
                flex-grow: 1;
                display: flex;
                justify-content: flex-end;
                margin-top: 20px;
            "
        >
            <cui-button
                :label="$lang.cancel"
                @click="
                    $store.commit('SET_LAYOUT_DATA', [
                        'reception',
                        { receptionModalReservation: false },
                    ])
                "
                plain
            />
            <cui-button
                :label="$lang.register"
                primary
                :disabled="!inputOK"
                @click="registerReservation"
            />
        </div>
    </div>
</template>

<script>
import { cc_p_calendar } from "../parts";

export default {
    components: { cc_p_calendar },
    emits: ["close", "created"],
    data() {
        return {
            loading: false,
            reservation: {
                patient: this.$store.getters.activePatient,
                date: null,
                time: null,
                encouterType: 1,
                note: "",
            },
        };
    },
    methods: {
        async registerReservation() {
            this.loading = true;
            await this.$dataService().post.encounters(this.reservation);
            this.$emit("created");
            this.$store.commit("SET_LAYOUT_DATA", [
                "reception",
                { receptionModalReservation: false },
            ]);
        },
        selectDate(i) {
            let date = this.$dayjs(i.start).format("YYYY-MM-DD");
            let time = this.$dayjs(i.start).format("HH:mm:ss");
            if (!i.allDay) {
                this.reservation.time = time;
            }
            this.reservation.date = date;
        },
    },
    computed: {
        inputOK() {
            if (
                this.reservation.patient &&
                this.reservation.date &&
                this.reservation.time
            ) {
                return true;
            }
            return false;
        },
    },
};
</script>

<style scoped>
.cc-reservation-main-cont {
    display: grid;
    grid-template-columns: 30% 70%;
    grid-template-rows: 100%;
    height: 500px;
}
</style>