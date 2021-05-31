<template>
    <div class="cc-reception-main-cont">
        <cui-card class="cc-reception-patient-list" noPadding>
            <cui-table :data="encounters.active">
                <template #emptyImage>
                    <img src="../../assets/img/empty2.jpg" style="width: 300px">
                </template>
                <template #header>
                    <div style="display: flex; align-items: center">
                        <h2>{{ $lang.reception }}</h2>
                        <cui-button 
                            @click="view.modal.reception = true"
                            :label="$lang.register" 
                        />
                        <cui-button 
                            @click="view.modal.reservation = true"
                            :label="$lang.reservation" 
                        />
                    </div>
                    <div style="display: flex; align-items: center">
                        <cui-checkbox v-model="view.reservation" :label="$lang.reservation" />
                        <cui-checkbox v-model="view.active" style="margin-left: 20px" :label="$lang.activeReceprion" />
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
                                            <td> {{ row.name }} </td>
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
                    <td> {{ row.name }} </td>
                    <td> {{ parseExamType(row.type) }} </td>
                    <td>
                        <cui-select
                            :data="$store.getters.encounterTypes"
                            displayValueProp="name"
                            returnValueProp="id"
                            v-model="row.type"
                         />
                    </td>
                    <td> {{ parseWaitTime(row.lastChange).time }} </td>
                    <td> {{ $moment(row.time, 'HH:mm:ss').format('HH時mm分') }} </td>
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

    </div>
</template>

<script>

import Calendar from '../shared/cc_shared_calendar'
import Walkin from './cc_reception_walkin'
import Reservation from '../shared/cc_shared_reservation'

export default {
    name: "ReceptionMainView",
    components: {
        Calendar,
        Reservation,
        Walkin
    },
    created() {
        this.getEncounters(),
        this.getEncounterTypes()
        this.getDoctors()
    },
    data() {
        return {
            encounters: {
                active: [],
                done: []
            },
            view: {
                reservation: false,
                active: true,
                done: false,
                modal: {
                    reception: false,
                    reservation: false
                }
            },
            docStati: [
                null, this.$lang.free, this.$lang.inEncounter 
            ],
            doctors: []
        }
    },
    methods: {
        getDoctors() {
            this.$api.doctors.get.all()
            .then(result => {
                this.doctors = result
            })
            .catch(res => {
                this.$apiError(res.statusText)
            })                
        },
        getEncounterTypes() {
            let storeData = this.$store.getters.encounterTypes
            if (!storeData) {
                this.$api.lists.get.encounterTypes()
                .then(res => {
                    this.$store.commit('SET_ENCOUNTER_TYPES', res)
                    
                })
                .catch(res => {
                    this.$apiError(res.statusText)
                })                
            } else {
                return storeData
            }
        },
        getEncounters() {
            this.$api.encounters.get.today()
            .then(res => {
                this.encounters = res
                this.encounters.active =
                    res.filter(item => item.status > 1)
                this.encounters.done =
                    res.filter(item => item.status === 0)
            })
            .catch(res => {
                this.$apiError(res.statusText)
            })
        },
        parseExamType(type) {
            const types = this.$store.getters.encounterTypes
            let string = ''
            string = types?.find(item => item.id == type).name
            return string
        },
        parseWaitTime(change) {
            let time = this.$moment(change, "HH:mm").fromNow(true);
            let diff = this.$moment().diff(this.$moment(change, "HH:mm"), "minutes");
            return {
                time: time,
                diff: diff,
            };
        }
    },
    computed: {
        doctorsFree() {
            let free = this.doctors.filter(doc => doc.status === 1).length
            return free + '/' + this.doctors.length
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