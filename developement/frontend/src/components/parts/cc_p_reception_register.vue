<template>
    <div class="main-cont">
        <div class="loader" v-if="loading.all"></div>
        <div>
            <cui-select
                :label="$lang.encounterType"
                :placeholder="$lang.searchByNameodID"
                :data="$store.getters.staticLists.encounterTypes"
                displayValueProp="name"
                returnValueProp="id"
                v-model="walkin.encouterType"
            />
            <cui-textarea
                cols="20"
                rows="5"
                :label="$lang.memo"
                v-model="walkin.note"
            />
        </div>

        <cui-table
            :data="insuranceResults"
            :loading="loading.insurances"
            singleSelect
            @select="setInsurance"
            outline
            style="height: 250px"
        >
            <template #header>
                <h2>{{ $lang.selectInsurance }}</h2>
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
                <td>{{ row.Insurance_Combination_Number }}</td>
                <td>{{ row.InsuranceProvider_WholeName }}</td>
                <td>
                    {{
                        row.PublicInsurance_Information?.[0]
                            ?.PublicInsurance_Name
                    }}
                </td>
                <td>
                    {{
                        row.PublicInsurance_Information?.[1]
                            ?.PublicInsurance_Name
                    }}
                </td>
                <td>
                    {{
                        row.PublicInsurance_Information?.[2]
                            ?.PublicInsurance_Name
                    }}
                </td>
                <td>
                    {{
                        row.PublicInsurance_Information?.[3]
                            ?.PublicInsurance_Name
                    }}
                </td>
            </template>
        </cui-table>
        <div></div>
        <div style="flex-grow: 1; display: flex; justify-content: flex-end">
            <cui-button
                :label="$lang.cancel"
                @click="
                    $store.commit('SET_LAYOUT_DATA', [
                        'reception',
                        { receptionModalRegister: false },
                    ])
                "
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
        this.getInsurances();
    },
    emits: ["close", "created"],
    data() {
        return {
            insuranceResults: [],
            loading: {
                insurances: false,
                all: false,
            },
            walkin: {
                patient: this.$store.getters.activePatient,
                insurance: null,
                encouterType: 1,
                note: "",
            },
        };
    },
    methods: {
        async getInsurances() {
            this.loading.insurances = true;
            this.insuranceResults = [];

            const res = await this.$dataService().get.patient.insuranceSets(
                this.walkin.patient.id
            );
            this.loading.insurances = false;
            this.insuranceResults = res;
        },
        setInsurance(data) {
            this.walkin.insurance = data.row;
        },
        async registerWalkin() {
            this.loading.all = true;
            await this.$dataService().post.encounters(this.walkin);
            this.loading.all = false;
            this.$store.commit("SET_LAYOUT_DATA", [
                "reception",
                { receptionModalRegister: false },
            ]);
        },
    },
    computed: {
        inputOK() {
            if (this.walkin.patient && this.walkin.insurance) {
                return true;
            }
            return false;
        },
    },
};
</script>

<style scoped>
.main-cont {
    display: grid;
    grid-template-columns: 200px auto;
    grid-gap: 20px;
    position: relative;
}
</style>