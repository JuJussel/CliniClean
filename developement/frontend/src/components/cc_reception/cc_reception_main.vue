<template>
    <div class="cc-reception-main-cont">
        <cui-card class="cc-reception-patient-list" noPadding>
            <cui-table :data="visibleEncounters" :loading="loading.recTable">
                <template #emptyImage>
                    <img src="../../assets/img/empty2.jpg" style="width: 300px">
                </template>
                <template #header>
                    <div style="display: flex; align-items: center">
                        <h2>{{ $lang.reception }}</h2>
                        <cui-button 
                            @click="view.modal.reception = true"
                            :label="$lang.register"
                             icon="fas fa-walking" 
                        />
                        <cui-button 
                            @click="view.modal.reservation = true"
                            :label="$lang.reservation"
                             icon="fas fa-calendar-plus"
                        />
                    </div>
                    <div style="display: flex; align-items: center">
                        <cui-checkbox v-model="view.reservation" :label="$lang.reservation" />
                        <cui-checkbox v-model="view.active" style="margin-left: 20px" :label="$lang.activeReception" />
                        <cui-checkbox v-model="view.done" style="margin-left: 20px; margin-right: 40px" :label="$lang.paymentDone" />
                        <cui-tooltip>
                            <a>{{ $lang.doctor }} {{ doctorsFree }} </a>
                            <template #tooltip>
                                    <cui-table :data="doctors" style="margin: -10px">
                                        <template #thead>
                                            <cui-th> {{ $lang.name }} </cui-th>
                                            <cui-th> {{ $lang.status }} </cui-th>
                                        </template>
                                        <template v-slot:row="{ row }">
                                            <td> {{ row.nameFull }} </td>
                                            <td> 
                                                <cui-tag
                                                    :danger="row.status === 2"
                                                    :primary="row.status === 1"
                                                >
                                                    {{ docStati[row.status] }}
                                                </cui-tag>
                                            </td>
                                        </template>
                                    </cui-table>
                            </template>
                        </cui-tooltip>
                    </div>
                </template>
                <template #thead>
                    <cui-th sort="name">{{ $lang.name }}</cui-th>
                    <cui-th sort="examType">{{ $lang.encounterType }}</cui-th>
                    <cui-th sort="status">{{ $lang.status }}</cui-th>
                    <cui-th sort="waitTime">{{ $lang.waitTime }}</cui-th>
                    <cui-th sort="recTime">{{ $lang.receptionTime }}</cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.patient?.name }} </td>
                    <td> {{ parseExamType(row.type) }} </td>
                    <td>
                        <cui-select
                            :data="examStatiOptions(row)"
                            displayValueProp="name"
                            returnValueProp="status"
                            v-model="row.status"
                            :disabled="examStatiOptions(row)[0].disabled"
                            :color="examStatiOptions(row)[0].color"
                            noNote
                            @select="changeStatus(row)"
                         />
                    </td>
                    <td> 
                        <span v-if="row.status !== 1">{{ parseWaitTime(row.lastChange).time }}</span> 
                    </td>
                    <td> {{ $moment(row.date).format('HH時mm分') }} </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card noPadding>
            <Calendar style="height: calc(100% - 1px)" ref="calendar"></Calendar>
        </cui-card>
        <cui-modal :visible="view.modal.reception" closable  @close="view.modal.reception = false">
            <cui-card style="width: 700px; height: auto; min-height: 200px; max-height: 800px">
                <template #header> <h2>{{ $lang.newReception }}</h2> </template>
                <Walkin @close="view.modal.reception = false" @created="getEncounters()" />
            </cui-card>
        </cui-modal>
        <cui-modal :visible="view.modal.reservation" closable  @close="view.modal.reservation = false">
            <cui-card style="width: 900px; height: 620px">
                <template #header> {{ $lang.newReservation }} </template>
                <Reservation @close="view.modal.reservation = false" @created="getEncounters()" />
            </cui-card>
        </cui-modal>
        <cui-modal :visible="view.modal.reservationAccept" closable  @close="view.modal.reservationAccept = false">
            <cui-card style="width: 900px; height: 500px">
                <template #header> {{ $lang.newReservation }} </template>
                <ReservationAccept @close="view.modal.reservationAccept = false" :data="view.modal.reservationAccept"/>
            </cui-card>
        </cui-modal>


    </div>
</template>

<script>

import Calendar from '../shared/cc_shared_calendar'
import Walkin from './cc_reception_walkin'
import Reservation from '../shared/cc_shared_reservation'
import ReservationAccept from './cc_reception_reservation_accept'


export default {
    name: "ReceptionMainView",
    components: {
        Calendar,
        Reservation,
        Walkin,
        ReservationAccept
    },
    created() {
        this.getEncounters();
        this.getEncounterTypes();
        this.getDoctors();
    },
    data() {
        return {
            encounters: [],
            loading: {
                recTable: false
            },
            view: {
                reservation: true,
                active: true,
                done: false,
                modal: {
                    reception: false,
                    reservation: false,
                    reservationAccept: false
                }
            },
            docStati: [
                null, this.$lang.free, this.$lang.inEncounter 
            ],
            doctors: []
        }
    },
    methods: {
        async getDoctors() {
            this.doctors = await this.$dataService().get.doctors.all()
        },
        async getEncounterTypes() {
            return await this.$dataService().get.lists.encounterTypes()
        },
        async getEncounters() {
            this.loading.recTable = true
            this.encounters = await this.$dataService().get.encounters.today()
            this.loading.recTable = false
        },
        parseExamType(type) {
            const types = this.$store.getters.encounterTypes
            let string = ''
            string = types?.find(item => item.id == type).name
            return string
        },
        examStatiOptions(row) {
            const currentStatus = row.status
            const encounterStati = {
                0: [{name: '会計済み', status: 0, disabled: true}],
                1: [{name: '予約', status: 1},{name: '待ち', status: 2}],
                2: [{name: '待ち', status: 2, color: '#E29578'},{name: '診察中', status: 3}],
                3: [{name: '診察中', status: 3, disabled: true, color: 'var(--cui-primary)'}],
                4: [{name: '健康診断中', status: 4, color: 'var(--cui-primary)'}],
                5: [{name: 'オーダー待ち', status: 5, disabled: true, color: '#E29578'}],
                6: [{name: 'オーダー待ち', status: 6, disabled: true, color: '#E29578'}],
                10: [{name: '会計待ち', status: 10, color: '#E29578'}],
                35: [{name: '再開待ち', status: 35, color: '#E29578'},{name: '診察中', status: 3}],
                45: [{name: '健康診断中・医者', status: 45, disabled: true, color: 'var(--cui-primary)'}]
            }
            return encounterStati[currentStatus]


        },
        parseWaitTime(change) {
            let time = this.$moment(change).fromNow(true);
            let diff = this.$moment().diff(this.$moment(change), "minutes");
            return {
                time: time,
                diff: diff,
            };
        },
        changeStatus(row) {
            const status = row.status
            if (status === 2) {
                this.view.modal.reservationAccept = row
            }
        }
    },
    computed: {
        doctorsFree() {
            let free = this.doctors.filter(doc => doc.status === 1).length
            return free + '/' + this.doctors.length
        },
        visibleEncounters() {
            let enc = []
            if (this.view.reservation) {
                let add = this.encounters.filter(e => e.status === 1)
                enc.push(...add)
            }
            if (this.view.active) {
                let add = this.encounters.filter((e) => {
                    if (e.status > 1 && e.status < 10) {
                        return true
                    }
                    if (e.status > 34) {
                        return true
                    }
                    return false
                })
                enc.push(...add)
            }
            if (this.view.done) {
                let add = this.encounters.filter(e => e.status === 0)
                enc.push(...add)
            }
            return enc
        }
    }
}
</script>

<style scoped>
    .cc-reception-main-cont {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
    }
</style>