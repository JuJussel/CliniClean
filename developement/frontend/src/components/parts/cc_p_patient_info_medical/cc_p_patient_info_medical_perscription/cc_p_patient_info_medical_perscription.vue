<template>
    <cui-table :data="activeMeds" outline v-if="activeOnly">
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
    <div v-else>
        <cui-table :data="persc" style="max-height: calc(100% - 2px)" outline>
            <template #header>
                <h2>{{ $lang.procedureCategoryLabels.perscription }}</h2>
                Only Active
            </template>
            <template #thead>
                <cui-th style="width: 150px"> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.endDate }} </cui-th>
                <cui-th> {{ $lang.perscriptionType }} </cui-th>
                <cui-th> {{ $lang.perscriptionName }} </cui-th>
                <cui-th></cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>{{ $parseDate(row.date) }}</td>
                <td style="padding: 0">
                    <span v-if="getEndDate(row)">{{ $parseDate(getEndDate(row)) }}</span>
                    <cui-button primary v-else label="終了" @click="updateEndDate(row)"> </cui-button>
                </td>
                <td>{{ row.varData?.type.name || "" }}</td>
                <td>
                    <cui-tag :label="row.name || ''" />
                </td>
                <td>
                    {{ row.varData?.timing.name || "" }}
                    {{ row.varData?.amount || "" }}
                    {{ row.taniname || "" }}
                    {{ row.varData?.duration || "" }}
                    {{ row.varData?.timing.unit || "" }}
                </td>
            </template>
        </cui-table>
        <cui-table :data="activeMeds" outline>
            <template #header>
                <h2>{{ $lang.repeatPersc }}</h2>
                <cui-button @click="registerRepeat.open = true" :label="$lang.register"></cui-button>
            </template>
            <template #thead>
                <cui-th> {{ $lang.perscriptionName }} </cui-th>
                <cui-th> {{ $lang.perscriptionType }} </cui-th>
                <cui-th> </cui-th>
                <cui-th style="width: 150px"> Last Persc </cui-th>
                <cui-th> Until </cui-th>
                <cui-th> Add </cui-th>
            </template>

            <template v-slot:row="{ row }">
                <td>
                    <cui-tag :label="row.name || ''" />
                </td>
                <td>{{ row.varData?.type.name || "" }}</td>
                <td>
                    {{ row.varData?.timing.name || "" }}
                    {{ row.varData?.amount || "" }}
                    {{ row.taniname || "" }}

                </td>
            </template>
        </cui-table>
        <cui-modal :visible="registerRepeat.open" @close="registerRepeat.open = false">
            <cui-card style="width: 900px; height: 420px" v-if="registerRepeat.open">
                <template #header>
                    {{ $lang.repeatPersc }}
                    {{ $lang.register }}
                </template>
                <register ref="registerModal"></register>
                <template v-slot:footer>
                    <div class="justify-items-center flex">
                        <cui-button :label="$lang.cancel" plain @click="registerRepeat.open = false" />
                        <cui-button :label="$lang.register" primary @click="submitNewPers" />
                    </div>
                </template>
            </cui-card>
        </cui-modal>

    </div>
</template>

<script>

import { useMedicalStore } from '@/stores/medical';
import { mapStores } from 'pinia';
import register from "./cc_p_patient_info_medical_perscription_registerRepeat.vue"

export default {
    components: {
        register
    },
    props: {
        activeOnly: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            registerRepeat: {
                open: false
            }
        }
    },
    methods: {
        submitNewPers() {
            console.log(this.$refs.registerModal.perscription);
        },
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
                if (!endDate) return true
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
        repeatPersc() {
            return [
                { title: "Name1", meds: [{ name: "ABS" }] },
                { title: "Name2", meds: [{ name: "ABS" }] },
                { title: "Name3", meds: [{ name: "ABS" }] }
            ]
        }
    },
};
</script>