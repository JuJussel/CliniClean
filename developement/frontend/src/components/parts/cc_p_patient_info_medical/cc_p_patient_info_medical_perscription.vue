<template>
    <div style="height: 100%">
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
                    <td>
                        <span v-if="getEndDate(row)">{{ $parseDate(getEndDate(row)) }}</span>
                        <cui-switch v-else trueLabel="終了" falseLabel="継続">  </cui-switch>
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
    methods: {
        getEndDate(item) {
            let typeCode = this.$lang.codes[item.varData.timing.unit]
            if (typeCode === 'perCodeTimingUnitDays') return this.$dayjs(item.date).add(item.varData.duration, 'day')
            return item.endDate || null           
        }
    },
    computed: {
        // activeMeds() {
        //     let endDate = null
        //     return this.persc.filter((item) => this.$dayjs().isAfter(item.))
        // }, 
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