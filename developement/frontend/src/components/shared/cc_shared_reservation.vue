<template>
    <div style="position: relative">
        <div class="loader" v-if="loading.all"></div>
        <div class="cc-reservation-main-cont">
            <div style="margin-right: 20px">
                <cui-select
                    :label="$lang.selectPatient"
                    :placeholder="$lang.searchByNameodID"
                    search
                    :loading="loading.patientSearch"
                    @input="searchPatient"
                    :data="searchResults"
                    displayValueProp='name'
                    v-model="reservation.patient"
                >
                    <template v-slot:dropdownItem="{ item }">
                      <span style="margin-right: 20px">{{$lang.number}}: {{ item.id }}</span>
                      <span>{{ item.name }}</span>
                    </template>
                </cui-select>
                <cui-select
                    :label="$lang.encounterType"
                    :placeholder="$lang.searchByNameodID"
                    :data="$store.getters.encounterTypes"
                    displayValueProp="name"
                    returnValueProp="id"
                    v-model="reservation.encouterType"
                 />
                <cui-datepicker :label="$lang.date" v-model="reservation.date" />

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
            <Calendar ref="calendar" :reRender="350" @selectDate="selectDate"></Calendar>
        </div>

        <div style="flex-grow: 1; display: flex; justify-content: flex-end">
            <cui-button
                :label="$lang.cancel"
                @click="$emit('close')"
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

import Calendar from '../shared/cc_shared_calendar'

export default {
    components: { Calendar },
    created() {
        if (this.$store.getters.transferData.reception) {
            this.walkin = this.$store.getters.transferData.reception
        }
    },
    emits: ['close', 'created'],
    data() {
        return {
            searchResults: [],
            loading: {
                patientSearch: false,
                all: false
            },
            reservation: {
                patient: null,
                date: null,
                time: null,
                encouterType: 1,
                note: ''
            }
        }
    },
    methods: {
        searchPatient(input) {
            if (input === '') {
                this.reservation.patient = null
                this.searchResults = []
                return
            }
            this.loading.patientSearch = true
            this.$api.patients.search({name: input, id: input})
            .then(res => {
                this.loading.patientSearch = false
                this.searchResults = res
            })
            .catch(res => {
                this.loading.patientSearch = false
                this.$apiError(res.statusText)
            })
        },
        registerReservation() {
            this.loading.all = true
            this.$api.encounters.post(this.reservation)
            .then(() => {
                this.$emit('created')
                this.$emit('close')
            })
            .catch((res) => {
                this.loading.all =false
                this.$apiError(res.statusText)
            })
        },
        selectDate (i) {
            let date = this.$moment(i.start).format('YYYY-MM-DD')
            let time = this.$moment(i.start).format('HH:mm:ss')
            if (!i.allDay) {
                this.reservation.time = time                
            }
            this.reservation.date = date
        }
    },
    computed: {
        inputOK() {
            if (this.reservation.patient && this.reservation.date && this.reservation.time) {
                return true
            }
            return false
        }
    }
}
</script>

<style scoped>
    .cc-reservation-main-cont {
        display: grid;
        grid-template-columns: 30% 70%;
        grid-template-rows: 100%;
        height: 500px
    }
</style>