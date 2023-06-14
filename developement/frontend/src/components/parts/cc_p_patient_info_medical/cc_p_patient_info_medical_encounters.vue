<template>
    <div style="height: 100%">
        <cui-table
            :data="medicalStore.medicalData.encounters || []"
            style="max-height: calc(100% - 2px)"
            outline
        >
            <template #header>
                <h2>{{ $lang.karte }} {{ $lang.history }}</h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.encounterType }} </cui-th>
                <cui-th
                    v-for="(item, index) in procedureCategories"
                    :key="index"
                    style="width: 35px"
                >
                    {{ $lang.procedureCategoryLabels[item.label] }}
                </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td style="padding: 0">
                    <cui-tag :label="$parseDate(row.date)" />
                </td>
                <td>{{ parseType(row.type) }}</td>
                <td
                    v-for="(item, index) in procedureCategories"
                    :key="index"
                    style="width: 35px; text-align: center"
                >
                    <i
                        v-if="hasType(row, item)"
                        :class="hasType(row, item)?.cat?.icon"
                    ></i>
                </td>
            </template>
            <template v-slot:expand="{ expand }">
                <div style="display: grid; grid-template-columns: 40% auto;">
                    <div v-html="expand.karte.soap?.html || ''" style="border: solid 1px var(--cui-gray-3); padding: 10px" />
                    <div style="border: solid 1px var(--cui-gray-3); margin-left: -1px">
                        <proceduresListReadOnly :procedures="expand.karte.procedures"></proceduresListReadOnly>
                    </div>
                </div>
            </template>

        </cui-table>
    </div>
</template>

<script>

import { useListStore } from '@/stores/list';
import { useMedicalStore } from '@/stores/medical';
import { mapStores } from 'pinia';
import proceduresListReadOnly from '../cc_p_karte/cc_p_procedures_list/cc_p_procedure_list_read_only.vue'

export default {
    components: {
        proceduresListReadOnly
    },
    props: {
        outline: {
            default: false,
            type: Boolean,
        },
        square: {
            default: true,
            type: Boolean,
        },
    },
    emits: ["update"],
    data() {
        return {
            encounters: [],
        };
    },
    methods: {
        parseType(type) {
            return this.listStore.listData.encounterTypes.find(
                (item) => item.id === type
            ).name;
        },
        hasType(row, type) {
            if (!row.karte?.procedures) return false;
            let has = row.karte.procedures.find(
                (item) => item.cat.code === type.code
            );
            return has;
        },
    },
    computed: {
        ...mapStores(useListStore, useMedicalStore),
        procedureCategories() {
            return this.listStore.listData.procedureCategories.filter(
                (item) => item.orcaCode
            );
        },
    },
};
</script>