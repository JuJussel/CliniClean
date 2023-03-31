<template>
    <div style="height: 100%">
        <cui-card noPadding style="max-height: 100%">
            <cui-table
                :data="procedures"
                style="max-height: calc(100% - 2px)"
                outline
            >
                <template #header>
                    <h2>{{ $lang.procedursOnly }}</h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.date }} </cui-th>
                    <cui-th></cui-th>
                    <cui-th> {{ $lang.procedureName }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td>{{ $parseDate(row.date) }}</td>
                    <td>
                        <i :class="row.cat.icon" />
                        {{ $lang.procedureCategoryLabels[row.cat.label] }}
                    </td>
                    <td>{{ row.name }}</td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>

import { useMedicalStore } from '@/stores/medical';
import { mapStores } from 'pinia';

export default {
    computed: {
        ...mapStores(useMedicalStore),
        procedures() {
            let proceduresList = [];
            this.medicalStore.medicalData.encounters.forEach((enc) => {
                let procedures = enc.karte?.procedures || null;
                if (!procedures) return;
                procedures = procedures.filter((proc) => proc.cat?.code !== 25);
                procedures = procedures.map((item) => {
                    item.encounter = enc.id;
                    item.date = enc.date;
                    return item;
                });
                proceduresList = proceduresList.concat(procedures);
            });
            return proceduresList;
        },
    },
};
</script>