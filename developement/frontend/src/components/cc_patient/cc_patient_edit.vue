<template>
    <div class="cc-patient-edit-main">
        <cui-card class="cc-patient-edit-header">
            <template #header>
                <h2>{{ $lang.patientNew }}</h2>
                <cui-button plain :label="$lang.cancel" />
                <cui-button primary :label="$lang.register" />
            </template>
        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">1</div>
                <h2>{{ $lang.basic }}</h2>
            </template>
            <div class="cc-patient-edit-form">
                <cui-input
                    v-model="patient.name"
                    required
                    :label="$lang.name"
                ></cui-input>
                <cui-datepicker
                    v-model="patient.birthdate"
                    required
                    :label="$lang.birthdate"
                ></cui-datepicker>
                <div style="display: flex; align-items: flex-end">
                    <cui-radio
                        :caption="$lang.gender"
                        :label="$lang.male"
                        :value="1"
                        v-model="patient.gender"
                    />
                    <cui-radio
                        style="margin-left: 10px"
                        :label="$lang.female"
                        :value="2"
                        v-model="patient.gender"
                    />
                </div>
                <cui-select
                    v-model="patient.occupation"
                    :label="$lang.occupation"
                    :data="$store.getters.occupations"
                ></cui-select>
            </div>
        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">2</div>
                <h2>{{ $lang.contactInfo }}</h2>
            </template>

            <cui-input
                v-model="patient.address.zip"
                :label="$lang.zipCode"
                pattern="[0-9]*"
                @input="getAddress('address')"
            ></cui-input>
            <cui-input
                v-model="patient.address.addr"
                :label="$lang.address"
            ></cui-input>
            <cui-input
                v-model="patient.phone"
                :label="$lang.telephone"
            ></cui-input>
            <cui-input
                v-model="patient.mail"
                :label="$lang.mailAddress"
            ></cui-input>
        </cui-card>
        <cui-card>
            <template #header>
                <div class="circle-number">3</div>
                <h2>{{ $lang.workOrSchool }}</h2>
            </template>
            <cui-input
                v-model="patient.company.name"
                :label="$lang.workOrSchoolName"
            ></cui-input>
            <cui-input
                v-model="patient.company.zip"
                :label="$lang.zipCode"
                @input="getAddress('company')"
            ></cui-input>
            <cui-input
                v-model="patient.company.addr"
                :label="$lang.address"
            ></cui-input>
            <cui-input
                v-model="patient.company.tel"
                :label="$lang.telephone"
            ></cui-input>
        </cui-card>
        <cui-card noPadding>
            <cui-table :data="patient.insurance">
                <template #header>
                    <div style="display: flex; align-items: center">
                        <div class="circle-number">4</div>
                        <h2>{{ $lang.insurance }} ・ {{ $lang.publicInsurance }}</h2>
                        <cui-button
                            @click="modals.insuranceNew = true"
                            :label="$lang.add"
                            icon="far fa-plus-square"
                        />
                    </div>
                </template>
                <template #thead>
                    <cui-th></cui-th>
                    <cui-th style="width: 200px"> {{ $lang.insuranceSymbol }}・{{ $lang.publicInsuranceProvider }} </cui-th>
                    <cui-th style="width: 200px"> {{ $lang.insuranceNumber }}・{{ $lang.publicInsuranceRecepient }} </cui-th>
                    <cui-th> {{ $lang.insuranceProviderNumber }} </cui-th>
                    <cui-th> {{ $lang.insuranceProviderName }} </cui-th>
                    <cui-th> {{ $lang.insuranceInsuredName }} </cui-th>
                    <cui-th> {{ $lang.validUntil }} </cui-th>
                    <cui-th></cui-th>
                </template>
                <template v-slot:row="row">
                    <td>
                        <cui-tag v-if="row.type === 'pub'">公</cui-tag>
                        <cui-tag v-else>保</cui-tag>
                    </td>
                    <td>{{ row.symbol }} {{ row.provider }}</td>
                    <td>{{ row.number }} {{ row.recepient }}</td>
                    <td>{{ row.providerNumber }}</td>
                    <td>{{ row.providerNumber }}</td>
                    <td>{{ row.insuredName }}</td>
                    <td>{{ $moment(row.validDate[1]).format('YYYY年MM月DD日') }}</td>
                    <td>
                        <cui-button icon="far fa-trash-alt" danger @click="removeInsurance(row._index)" />
                    </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-modal
            :visible="modals.insuranceNew"
            @close="modals.insuranceNew = false"
            @add="addInsurance"
        >
            <cui-card style="height: 540px; width: 850px">
                <template #header>
                    {{ $lang.insuranceAdd }}
                    <cui-button-group v-model="modals.newInsuranceType">
                        <cui-button-group-item
                            :label="$lang.insurance"
                            value="insuranceNew"
                        ></cui-button-group-item>
                        <cui-button-group-item
                            :label="$lang.publicInsurance"
                            value="publicNew"
                        ></cui-button-group-item>
                    </cui-button-group>
                </template>
                <component
                    :is="modals.newInsuranceType"
                    :patientName="patient.name"
                    @close="modals.insuranceNew = false"
                    @confirm="addInsurance"
                >
                </component>
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>
import insuranceNew from "./cc_patient_insurance_new.vue";
import publicNew from "./cc_patient_public_new.vue";

export default {
    components: { insuranceNew, publicNew },
    created() {
        this.populateData();
    },
    data() {
        return {
            loading: false,
            modals: {
                insuranceNew: false,
                newInsuranceType: "insuranceNew",
            },
            patient: {
                id: 0,
                name: "TestPatient2",
                nameKana: "TestPatient2",
                birthdate: "1990-01-01",
                gender: 1,
                householderName: "本人",
                relation: 1,
                occupation: "学生",
                phone: "08000326702",
                mail: "test@mail.com",
                address: {
                    zip: "1232232",
                    addr: "東京千代田区",
                },
                company: {
                    name: "Cordeos",
                    zip: "1234323",
                    addr: "東京千代田区",
                    tel: "032345677",
                },
                insurance: [],
            },
        };
    },
    methods: {
        populateData() {
            this.loading = true;
            this.$dataService().get.lists.occupations();
        },
        addInsurance(ins) {
            this.patient.insurance.push(ins)
            console.log(ins);
        },
        removeInsurance(index) {
            this.patient.insurance.splice(index, 1)
        },
        async getAddress(target) {
            let zip = this.patient[target].zip;
            if (zip.length === 7) {
                const addr = await this.$dataService().get.lists.addresses(zip);
                this.patient[target].addr = addr.addr;
            }
        }
    },
};
</script>

<style scoped>
.cc-patient-edit-main {
    height: 100%;
    display: grid;
    grid-template-rows: 85px 500px;
    grid-template-columns: 15% 15% 15% 55%;
    grid-template-areas: "header header header header";
}
.cc-patient-edit-header {
    grid-area: header;
}
.circle-number {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 20px;
    font-weight: bold;
    margin-right: 5px;
    padding: 2px;
    background: var(--cui-font-color);
    color: white;
}
</style>