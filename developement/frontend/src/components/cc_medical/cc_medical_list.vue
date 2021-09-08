<template>
    <div class="cc-medical-list-cont">
        <cui-card noPadding>
            <cui-table 
                :data="visibleEncounters" 
                :loading="loading.encounters" 
                single-select @select="selectEncounter" 
                :disabledFunct="(row) => {return(row.status == 10 || row.status == 0)}"
                >
                    <template #emptyImage>
                    <img src="../../assets/img/empty2.jpg" style="width: 300px">
                </template>
                <template #header>
                    <div style="display: flex; align-items: center">
                        <h2>{{ $lang.reception }} {{ $lang.list }} </h2>
                    </div>
                    <div style="display: flex; align-items: center">
                        <cui-checkbox v-model="viewEncounters.waiting" :label="$lang.waiting" />
                        <cui-checkbox v-model="viewEncounters.examination" style="margin-left: 20px" :label="$lang.inEncounter" />
                        <cui-checkbox v-model="viewEncounters.done" style="margin-left: 20px; margin-right: 40px" :label="$lang.paymentDone" />
                    </div>
                </template>
                <template #thead>
                    <cui-th sort="name">{{ $lang.name }}</cui-th>
                    <cui-th sort="examType">{{ $lang.encounterType }}</cui-th>
                    <cui-th sort="status">{{ $lang.status }}</cui-th>
                    <cui-th sort="waitTime">{{ $lang.waitTime }}</cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.patient?.name }} </td>
                    <td> 
                        <cui-tag primary>
                            {{ parseExamType(row.type) }}
                        </cui-tag>
                    </td>
                    <td>
                        {{ decodeEncounterStati([row.status]) }}
                    </td>
                    <td> 
                        <span v-if="row.status !== 1">{{ parseWaitTime(row.lastChange) }}</span> 
                    </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card>
            <patientList></patientList>
        </cui-card>
    </div>
</template>

<script>

import patientList from "../shared/cc_shared_patient_list.vue"

export default {
    components: {
        patientList
    },
    created() {
        this.getEncounters();
        this.getEncounterTypes();
    },
    emits: [
        'showEncounter'
    ],
    data() {
        return {
            loading: {
                encounters: false
            },
            encounters: [],
            viewEncounters: {
                waiting: false,
                examination: true,
                done: false,
            }
        }
    },
    methods: {
        async getEncounterTypes() {
            return await this.$dataService().get.lists.encounterTypes()
        },
        async getEncounters() {
            this.loading.encounters = true
            this.encounters = await this.$dataService().get.encounters.today()
            this.loading.encounters = false
        },
        parseExamType(type) {
            const types = this.$store.getters.encounterTypes
            let string = ''
            string = types?.find(item => item.id == type).name
            return string
        },
        parseWaitTime(change) {
            return this.$dayjs(change).fromNow(true);

        },
        selectEncounter(enc) {
            this.$emit('showEncounter', enc)
        },
        decodeEncounterStati(status) {
            let item = this.$store.getters.config.encounterStati.find(s => s[0].status === status[0])
            if (item) {
                return item[0].name;
            } else {
                return null
            }
        }
    },
    computed: {
        visibleEncounters() {
            let enc = []
            if (this.viewEncounters.waitung) {
                let add = this.encounters.filter(e => e.status === 2)
                enc.push(...add)
            }
            if (this.viewEncounters.examination) {
                let add = this.encounters.filter((e) => {
                    if (e.status > 2 && e.status < 11) {
                        return true
                    }
                    if (e.status > 34) {
                        return true
                    }
                    return false
                })
                enc.push(...add)
            }
            if (this.viewEncounters.done) {
                let add = this.encounters.filter(e => e.status === 0)
                enc.push(...add)
            }
            return enc
        }
    }

}
</script>

<style scoped>
    .cc-medical-list-cont {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
        height: 100%
    }
</style>