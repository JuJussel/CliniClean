<template>
        <div>
            <cui-table :data="patientDetails" :loading="!patientData" :outline="outline" :square="square">
                <template #header>
                    <div style="display: flex; align-items: center">
                        <h2> {{ $lang.basic }} </h2>
                        <slot name="buttons" :patient="patientData?.id" v-bind="patient"></slot>
                    </div>
                </template>
                <template v-slot:row="row">
                    <td> {{row.label}} </td>
                    <td>{{ row.value }}</td>
                </template>
            </cui-table>
            <cui-table :data="patientData?.insurance[0][0] ? patientData?.insurance[0] : patientData?.insurance" :outline="outline" :square="square" :loading="!patientData" style="margin-top: 40px">
                <template #header>
                    <h2> {{ $lang.insurance }} </h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.insuranceCombinationNumber }} </cui-th>
                    <cui-th> {{ $lang.insurance }} </cui-th>
                    <cui-th> {{ $lang.publicInsurance }} 1 </cui-th>
                    <cui-th> {{ $lang.publicInsurance }} 2 </cui-th>
                    <cui-th> {{ $lang.publicInsurance }} 3 </cui-th>
                    <cui-th> {{ $lang.publicInsurance }} 4 </cui-th>
                    <cui-th> {{ $lang.validUntil }} </cui-th>
                </template>
                <template v-slot:row="row">
                    <td> {{row.Insurance_Combination_Number}} </td>
                    <td>{{ row.InsuranceProvider_WholeName }}</td>
                    <td>{{ buildPublicIns(0, row) }}</td>
                    <td>{{ buildPublicIns(1, row) }}</td>
                    <td>{{ buildPublicIns(2, row) }}</td>
                    <td>{{ buildPublicIns(3, row) }}</td>
                    <td>{{ $parseDate(row.Certificate_ExpiredDate) }}</td>
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
            this.loading
        },
        buildPublicIns(index, row) {
            if (index > 0) {
                if (row.PublicInsurance_Information?.PublicInsurance_Information_child?.[index]) {
                    return row.PublicInsurance_Information.PublicInsurance_Information_child[index].PublicInsurance_Name;                      
                }
            } else {
                if (row.PublicInsurance_Information?.PublicInsurance_Information_child?.PublicInsurance_Name) {
                    return row.PublicInsurance_Information.PublicInsurance_Information_child.PublicInsurance_Name;
                }
            }
            return '';
        }
    },
    computed: {
        patientDetails() {
            if (!this.patientData)  return [];
            let tableData = [
                {label: this.$lang.patientId, value: this.patientData?.id},
                {label: this.$lang.name, value: this.patientData?.name},
                {label: this.$lang.birthdate, value: this.$dayjs(this.patientData?.birthdate).format('YYYY年MM月DD日')},
                {label: this.$lang.gender, value: this.patientData?.gender == 1 ? this.$lang.male : this.$lang.female},
                {label: this.$lang.address, value: this.patientData?.address?.zip + " " + this.patientData?.address?.addr},
                {label: this.$lang.occupation, value: this.patientData?.occupation},
                {label: this.$lang.workOrSchoolName, value: this.patientData?.company?.name},
                {label: this.$lang.telephone, value: this.patientData?.phone},
                {label: this.$lang.mailAddress, value: this.patientData?.mail}
            ];
            return tableData;
        }
    },
    watch: {
        patientId() {
            this.getPatientData();
        }
    }
    
}
</script>