<template>
        <div>
            <cui-table :data="patientDetails" square>
                <template #header>
                    <h2> {{ $lang.basic }} </h2>
                </template>
                <template v-slot:row="row">
                    <td> {{row.label}} </td>
                    <td>{{ row.value }}</td>
                </template>
            </cui-table>
            <cui-table :data="patient" square :loading="!patientData">
                <template #header>
                    <h2> {{ $lang.insurance }} </h2>
                </template>
                <template v-slot:row="row">
                    <td> {{row.label}} </td>
                    <td>{{ row.value }}</td>
                </template>
            </cui-table>

        </div>
</template>

<script>
export default {
    props: {
        patientId: {
            default: null,
            type: Number
        }
    },
    data() {
        return {
            patientData: null,
            patient: [
            ]
        }
    },
    created() {
        this.getPatientData()
    },
    methods: {
        async getPatientData() {
            const patientData = await this.$dataService().get.patient.details(this.patientId);
            this.patientData = patientData.patientData;
        }
    },
    computed: {
        patientDetails() {
            if (!this.patientData)  return [];
            let tableData = [
                {label: this.$lang.name, value: this.patientData?.name},
                {label: this.$lang.birthdate, value: this.$moment(this.patientData?.birthdate).format('YYYY年MM月DD日')},
                {label: this.$lang.gender, value: this.patientData?.gender},
                {label: this.$lang.address, value: this.patientData?.address?.zip + " " + this.patientData?.address?.addr},
                {label: this.$lang.occupation, value: this.patientData?.occupation},
                {label: this.$lang.workOrSchoolName, value: this.patientData?.company?.name},
                {label: this.$lang.telephone, value: this.patientData?.phone},
                {label: this.$lang.mailAddress, value: this.patientData?.mail}
            ];
            return tableData;
        }
    }
    
}
</script>