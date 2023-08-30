<template>
        <cui-table
                :data="activeMeds"
                outline
                v-if="activeOnly"
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
            <cui-table
                :data="persc"
                style="max-height: calc(100% - 2px)"
                outline
                v-else
            >
                <template #header>
                    <h2>{{ $lang.procedureCategoryLabels.perscription }}</h2>
                </template>
                <template #thead>
                    <cui-th style="width: 150px"> {{ $lang.date }} </cui-th>
                    <cui-th> {{ $lang.endDate }} </cui-th>
                    <cui-th> {{ $lang.perscriptionType }} </cui-th>
                    <cui-th> {{ $lang.perscriptionName }} </cui-th>
                    <cui-th> {{ $lang.perscriptionName }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td>{{ $parseDate(row.date) }}</td>
                    <td style="padding: 0">
                        <span v-if="getEndDate(row)">{{ $parseDate(getEndDate(row)) }}</span>
                        <cui-button primary v-else label="終了" @click="updateEndDate(row)">  </cui-button>
                    </td>
                    <td>{{ row.varData?.type.name || "" }}</td>
                    <td>
                        <cui-tag :label="row.name || ''" />
                    </td>
                    <td>
                        {{ row.varData?.timing.name || "" }}
                        {{ row.varData?.amount || ""}} 
                        {{ row.taniname || "" }}
                        {{ row.varData?.duration || ""}}
                        {{ row.varData?.timing.unit || "" }}
                    </td>
                </template>
            </cui-table>
</template>

<script>

import { useMedicalStore } from '@/stores/medical';
import { mapStores } from 'pinia';

export default {
    props: {
        activeOnly: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        getEndDate(item) {
            let typeCode = this.$lang.codes[item.varData?.timing?.unit] || null
            if (typeCode === 'perCodeTimingUnitDays') return this.$dayjs(item.date).add(item.varData.duration, 'day')
            return item.endDate || null
        },
        async updateEndDate(med) {
            med.endDate = this.$dayjs().format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]')
            let encounterData = this.patientData.encounters.find((enc) => enc._id === med.encounter)
            //Update Encounter...
            await this.$api.put('encounters/' + encounterData.id, encounterData);
        }
    },
    computed: {
        ...mapStores(useMedicalStore),
        activeMeds() {
            return this.persc.filter((item) => {
                let endDate = this.getEndDate(item)
                if(!endDate) return true
                return this.$dayjs().isBefore(endDate)
            })
        }, 
        persc() {
            let perscriptions = [];
            this.medicalStore.medicalData.encounters.forEach((enc) => {
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