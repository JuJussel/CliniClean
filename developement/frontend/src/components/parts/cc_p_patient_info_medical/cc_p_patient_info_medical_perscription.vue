<template>
    <div v-if="activeOnly">
        <cui-table
                :data="activeMeds"
                style="max-height: calc(100% - 2px)"
            >
                <template #header>
                    <h2>{{ $lang.procedureCategoryLabels.perscription + $lang.active }}</h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.perscriptionName }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td>{{ row.name }}</td>
                </template>
        </cui-table>
    </div>
    <div v-else style="height: 100%">
        <cui-card noPadding style="max-height: 100%">
            <cui-table
                :data="persc"
                style="max-height: calc(100% - 2px)"
                outline
            >
                <template #header>
                    <h2>{{ $lang.procedureCategoryLabels.perscription }}</h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.date }} </cui-th>
                    <cui-th> {{ $lang.endDate }} </cui-th>
                    <cui-th> {{ $lang.perscriptionType }} </cui-th>
                    <cui-th> {{ $lang.perscriptionName }} </cui-th>
                    <cui-th> {{ $lang.perscriptionName }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td>{{ $parseDate(row.date) }}</td>
                    <td style="padding: 0">
                        <span v-if="getEndDate(row)">{{ $parseDate(getEndDate(row)) }}</span>
                        <cui-button v-else label="終了" @click="updateEndDate(row)">  </cui-button>
                    </td>
                    <td>{{ row.varData.type.name }}</td>
                    <td>{{ row.name }}</td>
                    <td>
                        {{ row.varData.timing.name }}
                        {{ row.varData.amount + row.taniname }}
                        {{ row.varData.duration + row.varData.timing.unit }}
                    </td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>

export default {
    props: {
        activeOnly: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        getEndDate(item) {
            let typeCode = this.$lang.codes[item.varData.timing.unit]
            if (typeCode === 'perCodeTimingUnitDays') return this.$dayjs(item.date).add(item.varData.duration, 'day')
            return item.endDate || null
        },
        async updateEndDate(med) {
            med.endDate = this.$dayjs().format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]')
            let encounterData = this.patientData.encounters.find((enc) => enc._id === med.encounter)
            //Update Encounter...
            await this.$dataService().put.encounters(encounterData);
        }
    },
    computed: {
        activeMeds() {
            return this.persc.filter((item) => {
                let endDate = this.getEndDate(item)
                if(!endDate) return true
                return this.$dayjs().isBefore(endDate)
            })
        }, 
        patientData() {
            return this.$store.getters.layoutData.medical.patient;
        },
        persc() {
            let perscriptions = [];
            this.patientData.encounters.forEach((enc) => {
                let procedures = enc.karte?.procedures || null;
                if (!procedures) return;
                procedures = procedures.filter((proc) => proc.cat?.code === 25);
                procedures = procedures.map((item) => {
                    item.encounter = enc.id;
                    item.date = enc.date;
                    return item;
                });
                perscriptions = perscriptions.concat(procedures);
            });
            return perscriptions;
        },
    },
};
</script>