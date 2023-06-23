<template>
    <div style="height: 100%">
            <cui-card noPadding style="max-height: 100%">
                <cui-table
                    :data="medicalStore.medicalData?.immunization || []"
                    style="max-height: calc(50% - 2px)"
                    outline
                >
                    <template #header>
                        <h2>{{ $lang.immunization }}</h2>
                        <cui-button
                            icon="fas fa-plus"
                            :label="$lang.register"
                            @click="openImmEditor(null)"
                        />
                    </template>
                    <template #thead>
                        <cui-th> {{ $lang.diseaseName }} </cui-th>
                        <cui-th style="width: 150px">
                            {{ $lang.startDate }}
                        </cui-th>
                        <cui-th style="width: 100px">
                            {{ $lang.diseaseSuspectOrAcute }}
                        </cui-th>
                    </template>
                    <template v-slot:row="{ row }">
                        <td>
                            <cui-tag :label="row.disease.name" />
                        </td>
                        <td>{{ $parseDate(row.startDate) }}</td>
                        <td>
                            <cui-button
                                icon="fas fa-edit"
                                plain
                                @click="openImmEditor(row)"
                                v-if="encounterStore.encounterData"
                            ></cui-button>
                        </td>
                    </template>
                </cui-table>
            </cui-card>
    </div>
    <cui-modal
        :visible="immEditor.visible"
        :closable="!immEditor.loading"
        @close="immEditor.visible = false"
    >
        <cui-card
            style="width: 600px; height: 640px"
            v-if="immEditor.visible"
        >
            <template #header>
                {{ $lang.prevVac }}
                {{ immEditor.data ? $lang.edit : $lang.register }}
            </template>
            <imm-editor
                :item="immEditor.data"
                @close="immEditor.visible = false"
                @submitting="immEditor.loading = true"
            />
        </cui-card>
    </cui-modal>
</template>

<script>

import { useListStore } from "@/stores/list"
import { useMedicalStore } from "@/stores/medical"
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
        ...mapStores(useListStore, useMedicalStore),
    },
};
</script>