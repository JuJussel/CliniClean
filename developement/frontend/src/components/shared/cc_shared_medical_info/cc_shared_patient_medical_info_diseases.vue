<template>
    <div>
        <cui-table :data="diseases.active" style="max-height:610px">
            <template #header>
                <h2> {{ $lang.diseaseName }} {{ $lang.valid }} </h2>
                <cui-button icon="fas fa-plus" :label="$lang.register" @click="openDiseaseEditor(null)"/>    
            </template>
            <template #thead>
                <cui-th> {{ $lang.diseaseName }} </cui-th>
                <cui-th> {{ $lang.startDate  }} </cui-th>
                <cui-th>Suspect</cui-th>
                <cui-th>Main</cui-th>
                <cui-th></cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.Disease_Name }} </td>
                <td> {{ parseDate(row.Disease_StartDate) }} </td>
                <td> {{ row.Disease_SuspectedFlag }} </td>
                <td> {{ row.Disease_Category }} </td>
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
                <cui-th> {{ $lang.startDate  }} </cui-th>
                <cui-th> {{ $lang.diseaseEndDate }} </cui-th>
                <cui-th> {{ $lang.diseaseEndDate }} </cui-th>
                <cui-th> {{ $lang.startDate  }} </cui-th>
                <cui-th> {{ $lang.diseaseEndDate }} </cui-th>

            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.Disease_Name }} </td>
                <td> {{ parseDate(row.Disease_StartDate) }} </td>
                <td> {{ row.Disease_Name }} </td>
                <td> {{ row.Disease_Name }} </td>
                <td> {{ parseDate(row.Disease_EndDate) }} </td>
                <td> {{ row.Disease_Name }} </td>
            </template>
        </cui-table>    
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
        parseDate(date) {
            if(!date) return;
            return this.$dayjs(date, "YYYY-MM-DD").format(
                'YYYY' + this.$lang.dateLocals.yearSeparator +
                'MM' + this.$lang.dateLocals.monthSeparator +
                'DD' + this.$lang.dateLocals.daySeparator
            )
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
                active: this.patientData.diseases?.filter(item => !item.Disease_EndDate) || [],
                closed: this.patientData.diseases?.filter(item => item.Disease_EndDate) || []
            }
        }
    }

}
</script>