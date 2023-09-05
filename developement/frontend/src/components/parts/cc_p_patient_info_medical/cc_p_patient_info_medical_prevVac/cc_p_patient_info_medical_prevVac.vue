<template>
    <cui-table :data="prevVacs || []" outline>
        <template #header>
            <h2>{{ $lang.vaccines }}</h2>
            <cui-button icon="fas fa-plus" :label="$lang.register" @click="openImmEditor(null)" />
        </template>
        <template v-slot:row="{ row }">
            <td> {{ row.name }} </td>
            <td> {{ $parseDate(row.date) }} </td>
        </template>

    </cui-table>

    <cui-modal :visible="immEditor.visible" :closable="!immEditor.loading" @close="immEditor.visible = false">
        <cui-card style="width: 600px; height: 640px" v-if="immEditor.visible">
            <template #header>
                {{ $lang.prevVac }}
                {{ immEditor.data ? $lang.edit : $lang.register }}
            </template>
            <imm-editor :item="immEditor.data" @close="immEditor.visible = false" @submitting="immEditor.loading = true" />
        </cui-card>
    </cui-modal>
</template>

<script>

import { useListStore } from "@/stores/list"
import { useMedicalStore } from "@/stores/medical"
import { useEncounterStore } from "@/stores/encounter"
import { mapStores } from "pinia";
import immEditor from "./cc_p_patient_info_medical_prevVac_edit.vue";

export default {
    components: {
        immEditor,
    },
    props: {
        activeOnly: {
            default: false,
            type: Boolean
        },
        outline: {
            default: false,
            type: Boolean,
        },
        square: {
            default: true,
            type: Boolean,
        },
    },
    data() {
        return {
            immEditor: {
                visible: false,
                loading: false,
                data: null,
            },
        };
    },
    methods: {
        openImmEditor(data) {
            this.immEditor.data = data;
            this.immEditor.visible = true;
        },
        async diseaseEditSubmitted() {
            await this.encounterStore.getData();
            this.immEditor.loading = false;
        },
    },
    computed: {
        ...mapStores(useListStore, useMedicalStore, useEncounterStore),
        prevVacs() {
            let vaccines = [];
            this.medicalStore.medicalData.encounters.forEach((enc) => {
                let procedures = enc.karte?.procedures || null;
                if (!procedures) return;
                procedures = procedures.filter((proc) => proc.cat?.code === 31);
                procedures = procedures.map((item) => {
                    item.encounter = enc.id;
                    item.date = enc.date;
                    return item;
                });
                vaccines = vaccines.concat(procedures);
            });
            return vaccines;
        },

    },
};
</script>