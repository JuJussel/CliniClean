<template>
    <div style="position: relative">
        <div class="loader" v-if="loading.all"></div>
        <cui-table
            :data="insuranceResults"
            style="height: 350px"
            :loading="loading.insurances"
            singleSelect
            @select="setInsurance"
        >
            <template #emptyImage>
                <img src="../../assets/img/empty2.jpg" style="width: 300px">
            </template>
            <template #header>
                <h2> {{ $lang.selectInsurance }} </h2>
            </template>
            <template #thead>
                <cui-th sort="name"> {{ $lang.setNumber }} </cui-th>
                <cui-th sort="age"> {{ $lang.insurance }} </cui-th>
                <cui-th> {{ $lang.publicInsurance }} 1</cui-th>
                <cui-th> {{ $lang.publicInsurance }} 2</cui-th>
                <cui-th> {{ $lang.publicInsurance }} 3</cui-th>
                <cui-th> {{ $lang.publicInsurance }} 4</cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.Insurance_Combination_Number }} </td>
                <td> {{ row.InsuranceProvider_WholeName }} </td>
                <td> {{ row.PublicInsurance_Information?.[0]?.PublicInsurance_Name }} </td>
                <td> {{ row.PublicInsurance_Information?.[1]?.PublicInsurance_Name }} </td>
                <td> {{ row.PublicInsurance_Information?.[2]?.PublicInsurance_Name }} </td>
                <td> {{ row.PublicInsurance_Information?.[3]?.PublicInsurance_Name }} </td>
            </template>
        </cui-table>
        <div style="flex-grow: 1; display: flex; justify-content: flex-end">
            <cui-button
                :label="$lang.cancel"
                @click="$emit('close')"
                plain
            />
            <cui-button
                :label="$lang.register"
                primary
                :disabled="!inputOK"
                @click="acceptEncounter"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            default: null,
            type: Object
        }
    },
    emits: ['close', 'accepted'],
    created() {
        this.getInsurances()
    },
    data() {
        return {
            insuranceResults: [],
            loading: {
                insurances: false,
                all: false
            },
            selectedData: {
                insurance: null,
                note: null
            }
        }
    },
    methods: {
        async getInsurances() {
            this.loading.insurances = true
            this.insuranceResults = []
            const insurances = await this.$dataService().get.patient.insuranceSets(this.data.patient.id)
            this.loading.insurances = false
            this.insuranceResults = insurances
        },
        setInsurance(data) {
            this.selectedData.insurance = data.row
        },
        async acceptEncounter() {
            this.loading.all = true;
            await this.$dataService().post.encounters(this.walkin);
            this.loading.all = false;
            this.$emit('created');
            this.$emit('close');
        }
    },
    computed: {
        inputOK() {
            if (this.insurance) {
                return true
            }
            return false
        }
    }
}
</script>