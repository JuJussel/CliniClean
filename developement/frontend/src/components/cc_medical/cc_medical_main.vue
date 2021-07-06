<template>
    <div class="cc-medical-main-cont">
        <cui-card noPadding>
            <cui-table :data="encounters" :loading="loading.encounters">
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
                        {{ encounterStati[row.status] }}
                    </td>
                    <td> 
                        <span v-if="row.status !== 1">{{ parseWaitTime(row.lastChange).time }}</span> 
                    </td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>
export default {
        created() {
        this.getEncounters();
        this.getEncounterTypes();
    },
    data() {
        return {
            loading: {
                encounters: false
            },
            encounters: [],
            viewEncounters: {
                waiting: true,
                examination: false,
                done: false,
            },
            encounterStati: {
                0: '会計済み',
                1: '予約',
                2: '待ち',
                3: '診察中',
                4: '健康診断中',
                5: 'オーダー待ち',
                6: 'オーダー待ち',
                10: '会計待ち',
                35: '再開待ち',
                45: '健康診断中・医者'
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
            let time = this.$moment(change).fromNow(true);
            let diff = this.$moment().diff(this.$moment(change), "minutes");
            return {
                time: time,
                diff: diff,
            };
        },


    }

}
</script>

<style scoped>
    .cc-medical-main-cont {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
    }
</style>