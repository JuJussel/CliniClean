<template>
    <div class="cc-reception-main-cont">
        <cui-card class="cc-reception-patient-list" noPadding>
            <cui-table :data="encounters.active">
                <template #header>
                <h2>{{ $lang.reception }}</h2>
                <cui-button label="登録" />
                </template>
                <template #thead>
                    <cui-th sort="name">{{ $lang.name }}</cui-th>
                    <cui-th sort="examType">{{ $lang.examType }}</cui-th>
                    <cui-th sort="status">{{ $lang.status }}</cui-th>
                    <cui-th sort="waitTime">{{ $lang.wait + $lang.time }}</cui-th>
                    <cui-th sort="recTime">{{ $lang.reception + $lang.time }}</cui-th>
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
        <cui-card class="cc-reception-calendar">
            Calendar
        </cui-card>
        <cui-card noPadding>
            <cui-table :data="encounters.done">
                <template #header>
                <h2>{{ $lang.reception }}</h2>
                </template>
                <template #thead>
                    <cui-th sort="name">{{ $lang.name }}</cui-th>
                    <cui-th sort="examType">{{ $lang.examType }}</cui-th>
                    <cui-th sort="recTime">{{ $lang.time }}</cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.name }} </td>
                    <td> {{ parseExamType(row.type) }} </td>
                    <td> {{ $moment(row.time, 'HH:mm:ss').format('HH時mm分') }} </td>
                </template>
            </cui-table>

        </cui-card>
        <cui-card>
            Doctors
        </cui-card>
    </div>
</template>

<script>
export default {
    name: "ReceptionMainView",
    created() {
        this.getEncounters(),
        this.getEncounterTypes()
    },
    data() {
        return {
            encounters: {
                active: [],
                done: []
            },
        }
    },
    methods: {
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
            console.log(types);
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
    }
}
</script>

<style scoped>
    .cc-reception-main-cont {
        display: grid;
        grid-template-columns: 50% 25% auto;
        grid-template-rows: 70% 30%;
    }
    .cc-reception-patient-list {
        grid-row: 1 / 3;
        grid-column: 1
    }
    .cc-reception-calendar {
        grid-column: 2 / 4;
    }
</style>