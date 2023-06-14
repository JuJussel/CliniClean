<template>
    <div v-if="activeOnly">
        <cui-table
            :data="diseases.active"
            style="max-height: 245px"
        >
            <template #header>
                <h2>{{ $lang.diseaseName }} {{ $lang.valid }}</h2>
                <cui-button
                    icon="fas fa-plus"
                    :label="$lang.register"
                    @click="openDiseaseEditor(null)"
                    v-if="encounterStore.encounterData"
                />
            </template>
            <template #thead>
                <cui-th> {{ $lang.diseaseName }} </cui-th>
                <cui-th>
                    {{ $lang.diseaseSuspectOrAcute }}
                </cui-th>
                <cui-th>
                    {{ $lang.diseaseMain }}
                </cui-th>
                <cui-th></cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td>{{ row.disease.name }}</td>
                <td>{{ parseSuspectLabel(row) }}</td>
                <td>
                    <span v-if="row.primaryDisease">
                        {{ $lang.diseaseMain }}
                    </span>
                </td>
                <td>
                    <cui-button
                        icon="fas fa-edit"
                        plain
                        @click="openDiseaseEditor(row)"
                        v-if="encounterStore.encounterData"
                    ></cui-button>
                </td>
            </template>
        </cui-table>
    </div>
    <div style="height: 100%" v-else>
        <div class="table-container">
            <cui-card noPadding style="max-height: 100%">
                <cui-table
                    :data="diseases.active"
                    style="max-height: calc(50% - 2px)"
                    outline
                >
                    <template #header>
                        <h2>{{ $lang.diseaseName }} {{ $lang.valid }}</h2>
                        <cui-button
                            icon="fas fa-plus"
                            :label="$lang.register"
                            @click="openDiseaseEditor(null)"
                            v-if="encounterStore.encounterData"
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
                        <cui-th style="width: 50px">
                            {{ $lang.diseaseMain }}
                        </cui-th>
                        <cui-th></cui-th>
                    </template>
                    <template v-slot:row="{ row }">
                        <td>
                            <cui-tag :label="row.disease.name" />
                        </td>
                        <td>{{ $parseDate(row.startDate) }}</td>
                        <td>{{ parseSuspectLabel(row) }}</td>
                        <td>
                            <span v-if="row.primaryDisease">
                                {{ $lang.diseaseMain }}
                            </span>
                        </td>
                        <td>
                            <cui-button
                                icon="fas fa-edit"
                                plain
                                @click="openDiseaseEditor(row)"
                                v-if="encounterStore.encounterData"
                            ></cui-button>
                        </td>
                    </template>
                </cui-table>
            </cui-card>
            <cui-card noPadding style="max-height: 100%">
                <cui-table
                    :data="diseases.closed"
                    style="max-height: calc(50% - 2px)"
                    outline
                >
                    <template #header>
                        <h2>{{ $lang.diseaseName }} {{ $lang.history }}</h2>
                    </template>
                    <template #thead>
                        <cui-th> {{ $lang.diseaseName }} </cui-th>
                        <cui-th style="width: 130px">
                            {{ $lang.startDate }}
                        </cui-th>
                        <cui-th style="width: 130px">
                            {{ $lang.diseaseEndDate }}
                        </cui-th>
                        <cui-th style="width: 60px">
                            {{ $lang.diseaseOutcome }}
                        </cui-th>
                    </template>
                    <template v-slot:row="{ row }">
                        <td>{{ row.disease.name }}</td>
                        <td>{{ $parseDate(row.startDate) }}</td>
                        <td>{{ $parseDate(row.endDate) }}</td>
                        <td>{{ parseOutcomeLabel(row) }}</td>
                    </template>
                </cui-table>
            </cui-card>
        </div>
    </div>
    <cui-modal
        :visible="diseaseEditor.visible"
        :closable="!diseaseEditor.loading"
        @close="diseaseEditor.visible = false"
    >
        <cui-card
            style="width: 600px; height: 640px"
            v-if="diseaseEditor.visible"
        >
            <template #header>
                {{ $lang.diseaseName }}
                {{ diseaseEditor.data ? $lang.edit : $lang.register }}
            </template>
            <disease-editor
                :diseaseData="diseaseEditor.data"
                @close="diseaseEditor.visible = false"
                @submitting="diseaseEditor.loading = true"
            />
        </cui-card>
    </cui-modal>
</template>

<script>

import { useListStore } from "@/stores/list"
import { useEncounterStore } from "@/stores/encounter"
import { useMedicalStore } from "@/stores/medical"
import { mapStores } from "pinia";
import diseaseEditor from "../cc_p_disease_edit.vue";

export default {
    components: {
        diseaseEditor,
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
            diseaseEditor: {
                visible: false,
                loading: false,
                data: null,
            },
        };
    },
    methods: {
        parseSuspectLabel(row) {
            if (!row.suspectOrAcuteFlag) return "";
            return this.listStore.listData.disease.suspectFlags.find(
                (item) => item.value === row.suspectOrAcuteFlag
            ).label;
        },
        parseOutcomeLabel(row) {
            if (!row.outcome) return "";
            return this.listStore.listData.disease.outcomeFlags.find(
                (item) => item.value === row.outcome
            ).label;
        },

        openDiseaseEditor(data) {
            this.diseaseEditor.data = data;
            this.diseaseEditor.visible = true;
        },
        async diseaseEditSubmitted() {
            await this.encounterStore.getData();
            this.diseaseEditor.loading = false;
        },
    },
    computed: {
        ...mapStores(useListStore, useEncounterStore, useMedicalStore),
        diseases() {
            return {
                active:
                    this.medicalStore.medicalData?.diseases?.filter(
                        (item) => !item.endDate
                    ) || [],
                closed:
                    this.medicalStore.medicalData?.diseases?.filter((item) => item.endDate) ||
                    [],
            };
        },
    },
};
</script>

<style scoped>
.table-container {
    height: 100%;
    display: grid;
    grid-template-rows: 50% 50%;
}
</style>