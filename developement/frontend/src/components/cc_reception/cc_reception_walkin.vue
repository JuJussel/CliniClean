<template>
    <div style="position: relative">
        <div class="loader" v-if="loading.all"></div>
        <cui-select 
            :label="$lang.selectPatient"
            :placeholder="$lang.searchByNameodID"
            search
            :loading="loading.patientSearch"
            @input="searchPatient"
            @select="getInsurances"
            :data="searchResults"
            displayValueProp='name'
            v-model="walkin.patient"
        >
            <template v-slot:dropdownItem="{ item }">
              <span style="margin-right: 20px">{{$lang.number}}: {{ item.id }}</span>
              <span>{{ item.name }}</span>
            </template>
        </cui-select>

        <cui-select
            :label="$lang.encounterType"
            :placeholder="$lang.searchByNameodID"
            :data="$store.getters.encounterTypes"
            displayValueProp="name"
            returnValueProp="id"
            v-model="walkin.encouterType"
         />

        <cui-input 
            :label="$lang.memo"
            v-model="walkin.note"
        />

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
                @click="registerWalkin"
            />
        </div>
    </div>
</template>

<script>
export default {
    created() {
        if (this.$store.getters.transferData.reception) {
            this.walkin = this.$store.getters.transferData.reception
        }
    },
    emits: ['close', 'created'],
    data() {
        return {
            searchResults: [],
            insuranceResults: [],
            loading: {
                patientSearch: false,
                insurances: false,
                all: false
            },
            walkin: {
                patient: null,
                insurance: null,
                encouterType: 1,
                note: ''
            }
        }
    },
    methods: {
        getInsurances() {
            this.loading.insurances = true
            this.insuranceResults = []
            this.$api.patients.get.insuranceSets(this.walkin.patient.id)
            .then(res => {
                this.loading.insurances = false
                this.insuranceResults = res
            })
            .catch(res => {
                this.loading.insurances = false
                this.$apiError(res.statusText)
            })

        },
        searchPatient(input) {
            if (input === '') {
                this.walkin.patient = null
                this.searchResults = []
                return
            }
            this.loading.patientSearch = true
            this.$api.patients.search({name: input, id: input})
            .then(res => {
                this.loading.patientSearch = false
                this.searchResults = res
            })
            .catch(res => {
                this.loading.patientSearch = false
                this.$apiError(res.statusText)
            })
        },
        setInsurance(data) {
            this.walkin.insurance = data.row
        },
        registerWalkin() {
            this.loading.all = true
            this.$api.encounters.post(this.walkin)
            .then(() => {
                this.$emit('created')
                this.$emit('close')
            })
            .catch((res) => {
                this.loading.all =false
                this.$apiError(res.statusText)
            })

        }
    },
    computed: {
        inputOK() {
            if (this.walkin.patient && this.walkin.insurance) {
                return true
            }
            return false
        }
    }
}
</script>