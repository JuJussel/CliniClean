<template>
    <div class="cc-patient-edit-main">
        <cui-card class="cc-patient-edit-header">
            <template #header>
                <h2>{{ editData ? $lang.patientEdit : $lang.patientNew }}</h2>
                <cui-button plain :label="$lang.cancel" @click="$emit('cancel')" :loading="loading"/>
                <cui-button primary :label=" editData ? $lang.save : $lang.register" @click="validateForm" :loading="loading"/>
            </template>
        </cui-card>
        <cui-card :loading="loading">
            <template #header>
                <div class="circle-number">1</div>
                <h2>{{ $lang.basic }}</h2>
                <div v-if="editData" style="margin-left: 10px">
                    <cui-checkbox v-model="patient.editSexOrBirthdate" :label="$lang.editSexOrBirthdate"></cui-checkbox>
                </div>
            </template>
            <div class="cc-patient-edit-form">
                <cui-input
                    :disabled="editData && patient.editSexOrBirthdate"
                    :note="errors.name"
                    v-model="patient.name"
                    required
                    @input="updateHouseholder"
                    :label="$lang.name"
                ></cui-input>
                <cui-input
                    :disabled="editData && patient.editSexOrBirthdate"
                    :note="errors.nameKana"
                    v-model="patient.nameKana"
                    required
                    :label="$lang.nameKana"
                ></cui-input>

                <cui-datepicker
                    :disabled="editData && !patient.editSexOrBirthdate"
                    :note="errors.birthdate"
                    v-model="patient.birthdate"
                    required
                    :label="$lang.birthdate"
                ></cui-datepicker>
                <div style="display: flex; align-items: flex-end">
                    <cui-radio
                        :disabled="editData && !patient.editSexOrBirthdate"
                        :caption="$lang.gender"
                        :label="$lang.male"
                        :value="1"
                        v-model="patient.gender"
                    />
                    <cui-radio
                        :disabled="editData && !patient.editSexOrBirthdate"
                        style="margin-left: 10px"
                        :label="$lang.female"
                        :value="2"
                        v-model="patient.gender"
                    />
                </div>
                <cui-select
                    :note="errors.occupation"
                    v-model="patient.occupation"
                    :label="$lang.occupation"
                    :data="$store.getters.occupations"
                ></cui-select>
            </div>
        </cui-card>
        <cui-card :loading="loading">
            <template #header>
                <div class="circle-number">2</div>
                <h2>{{ $lang.contactInfo }}</h2>
            </template>

            <cui-input
                :note="errors.addresszip"
                v-model="patient.address.zip"
                :label="$lang.zipCode"
                pattern="[0-9]*"
                @input="getAddress('address')"
            ></cui-input>
            <cui-input
                :note="errors.addressaddr"
                v-model="patient.address.addr"
                :label="$lang.address"
            ></cui-input>
            <cui-input
                :note="errors.phone"
                v-model="patient.phone"
                :label="$lang.telephone"
            ></cui-input>
            <cui-input
                :note="errors.mail"
                v-model="patient.mail"
                :label="$lang.mailAddress"
            ></cui-input>
            <div style="display: grid; grid-template-columns: 50% 50%">
                <cui-input v-model="patient.householderName" :label="$lang.householder"></cui-input>
                <cui-select 
                    :label="$lang.relation" style="padding-left: 10px"
                    :note="errors.relation"
                    @select="updateHouseholder"
                    displayValueProp="name"
                    returnValueProp="name"
                    v-model="patient.relation"
                    :data="$store.getters.relations"
                />
            </div>
        </cui-card>
        <cui-card :loading="loading">
            <template #header>
                <div class="circle-number">3</div>
                <h2>{{ $lang.workOrSchool }}</h2>
            </template>
            <cui-input
                :note="errors.companyname"
                v-model="patient.company.name"
                :label="$lang.workOrSchoolName"
            ></cui-input>
            <cui-input
                :note="errors.companyzip"
                v-model="patient.company.zip"
                :label="$lang.zipCode"
                @input="getAddress('company')"
            ></cui-input>
            <cui-input
                :note="errors.companyaddr"
                v-model="patient.company.addr"
                :label="$lang.address"
            ></cui-input>
            <cui-input
                :note="errors.companyphone"
                v-model="patient.company.phone"
                :label="$lang.telephone"
            ></cui-input>
        </cui-card>
        <cui-card noPadding :loading="loading">
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
import Joi from "joi";

export default {
    components: { insuranceNew, publicNew },
    emits: ['cancel', 'save', 'showPatient'],
    props: {
        editData: {default: null}
    },
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
                editSexOrBirthdate: false, 
                id: '',
                name: '',
                nameKana: '',
                birthdate: '',
                gender: 1,
                householderName: '',
                relation: '本人',
                occupation: '',
                phone: '',
                mail: '',
                address: {
                    zip: '',
                    addr: '',
                },
                company: {
                    name: '',
                    zip: '',
                    addr: '',
                    phone: '',
                },
                insurance: []
            },
            errors: {
                id: '',
                name: '',
                nameKana: '',
                birthdate: '',
                gender: '',
                householderName: '',
                relation: '',
                occupation: '',
                phone: '',
                mail: '',
                addresszip: '',
                addressaddr: '',
                companyname: '',
                companyzip: '',
                companyaddr: '',
                companyphone: '',
                insurance: ''
            }
        };
    },
    methods: {
        updateHouseholder() {
            if (this.patient.relation === "本人") {
                this.patient.householderName = this.patient.name                
            }
        },
        async populateData() {
            this.loading = true;
            if (this.editData) {
                let editData = JSON.parse(JSON.stringify(this.editData));
                editData.currentInsSets = editData.insurance;
                editData.insurance = []; 
                this.patient = editData;
                this.patient.householderName = this.patient.name;
            }
            await this.$dataService().get.lists.occupations();
            await this.$dataService().get.lists.relations();
            this.loading = false;
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
        },
        validateForm() {
            Object.keys(this.errors).forEach((key) => {
                this.errors[key] = "";
            });

            const schema = Joi.object({
                name: Joi.string().required(),
                nameKana: Joi.string().required(),
                birthdate: Joi.date().max('now').required(),
                gender: Joi.number().required(),
                householderName: Joi.string().allow(''),
                relation: Joi.string().allow(''),
                occupation: Joi.string().allow(''),
                phone: Joi.string().pattern(/^[0-9]*$/).allow(''),
                mail: Joi.string().email({ tlds: false }).allow(''),
                address: Joi.object({
                    zip: Joi.string().pattern(/^[0-9]*$/).allow(''),
                    addr: Joi.string(),
                }),
                company: Joi.object({
                    name: Joi.string().allow(''),
                    zip: Joi.string().pattern(/^[0-9]*$/).allow(''),
                    addr: Joi.string().allow(''),
                    phone: Joi.string().pattern(/^[0-9]*$/).allow(''),
                }),
                insurance: Joi.array()
            });
            try {
                Joi.assert(this.patient, schema, {
                    abortEarly: false,
                    allowUnknown: true,
                    messages: this.$lang.validationMessages,
                });
                this.save();
            } catch (err) {
                err.details.forEach((e) => {
                    let key = e.path[0];
                    if (e.path.length > 1) {
                        key = key + e.path[1]
                    }
                    this.errors[key] = null;
                    setTimeout(
                        function () {
                            this.errors[key] = e.message;
                        }.bind(this),
                        50
                    );
                });
            }
        },
        async save() {
            this.loading = true;
            let newPatientId = null;
            if (this.editData) {
                try {
                    newPatientId = await this.$dataService().put.patients(this.patient);
                }
                catch(err) {
                    this.loading = false;
                    return;
                }
            } else {
                try {
                    newPatientId = await this.$dataService().post.patients(this.patient);
                }
                catch(err) {
                    this.loading = false;
                    return;
                }
            }
            this.$cui.notification({
                text: this.$lang.saved,
                duration: 2000,
                color: 'primary'
            })
            this.$emit('showPatient', newPatientId);
            this.$emit('cancel');
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