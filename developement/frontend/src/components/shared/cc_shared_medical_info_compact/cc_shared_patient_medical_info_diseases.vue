<template>
    <div style="height: 100%">
        <div class="table-container">
            <cui-table :data="diseases.active" style="max-height:610px">
                <template #header>
                    <h2> {{ $lang.diseaseName }} {{ $lang.valid }} </h2>
                    <cui-button icon="fas fa-plus" :label="$lang.register" @click="openDiseaseEditor(null)"/>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.diseaseName }} </cui-th>
                    <cui-th style="width: 130px"> {{ $lang.startDate  }} </cui-th>
                    <cui-th style="width: 100px"> {{ $lang.diseaseSuspectOrAcute }} </cui-th>
                    <cui-th style="width: 50px"> {{ $lang.diseaseMain }} </cui-th>
                    <cui-th></cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.disease.name }} </td>
                    <td> {{ $parseDate(row.startDate) }} </td>
                    <td> {{ parseSuspectLabel(row) }} </td>
                    <td>
                        <span v-if="row.primaryDisease"> {{ $lang.diseaseMain }} </span>
                    </td>
                    <td>
                        <cui-button icon="fas fa-edit" plain @click="openDiseaseEditor(row)"></cui-button>
                    </td>
                </template>
            </cui-table>
            <cui-table :data="diseases.closed" style="max-height:610px">
                <template #header>
                    <h2> {{ $lang.diseaseName }} {{ $lang.history }} </h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.diseaseName }} </cui-th>
                    <cui-th style="width: 130px"> {{ $lang.startDate  }} </cui-th>
                    <cui-th style="width: 130px"> {{ $lang.diseaseEndDate }} </cui-th>
                    <cui-th style="width: 60px"> {{ $lang.diseaseOutcome }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.disease.name }} </td>
                    <td> {{ $parseDate(row.startDate) }} </td>
                    <td> {{ $parseDate(row.endDate) }} </td>
                    <td> {{ parseOutcomeLabel(row) }} </td>
                </template>
            </cui-table>
        </div>
        <cui-modal :visible="diseaseEditor.visible" :closable="!diseaseEditor.loading" @close="diseaseEditor.visible = false">
            <cui-card style="width: 600px; height: 640px" v-if="diseaseEditor.visible">
                <template #header> {{ $lang.diseaseName }} {{ diseaseEditor.data ? $lang.edit : $lang.register }} </template>
                <disease-editor
                    :diseaseData="diseaseEditor.data"
                    :patientData="patientData"
                    @close="diseaseEditor.visible = false"
                    @submitting="diseaseEditor.loading = true"
                    @submitted="diseaseEditSubmitted"
                />
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import diseaseEditor from "../cc_shared_disease_editor.vue"

export default {
    components: {
        diseaseEditor
    },
    props: {
        patientData: {
            default: null
        },
        outline: {
            default: false,
            type: Boolean
        },
        square: {
            default: true,
            type: Boolean
        }

    },
    emits: [
        'update'
    ],
    data() {
        return {
            diseaseEditor: {
                visible: false,
                loading: false,
                data: null
            }
        }
    },
    methods: {
        parseSuspectLabel(row) {
            if(!row.suspectOrAcuteFlag) return "";
            return this.$store.getters.diseaseFlags.suspectFlags.find(item => item.value === row.suspectOrAcuteFlag).label
        },
        parseOutcomeLabel(row) {
            if(!row.outcome) return "";
            return this.$store.getters.diseaseFlags.outcomeFlags.find(item => item.value === row.outcome).label
        },

        openDiseaseEditor(data) {
            this.diseaseEditor.data = data;
            this.diseaseEditor.visible = true;
        },
        diseaseEditSubmitted() {
            this.diseaseEditor.loading = false;
            this.$cui.notification({
                text: this.$lang.saved,
                duration: 2000,
                color: 'primary'
            })
            this.$emit('update');
        }
    },
    computed: {
        diseases() {
            return {
                active: this.patientData.diseases?.filter(item => !item.endDate) || [],
                closed: this.patientData.diseases?.filter(item => item.endDate) || []
            }
        }
    }

}
</script>

<style scoped>
    .table-container {
        height: 100%;
        display: grid;
        grid-template-rows: 50% 50%;
    }
</style>