<template>
    <div>
        <div class="cc-patient-edit-main">
            <cui-card :loading="loading">
                <template #header>
                    <div class="circle-number">1</div>
                    <h2>{{ $lang.basic }}</h2>
                    <div v-if="editData" style="margin-left: 10px">
                        <cui-checkbox
                            v-model="patient.editSexOrBirthdate"
                            :label="$lang.editSexOrBirthdate"
                        ></cui-checkbox>
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
                        :data="$store.getters.staticLists.occupations"
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
                    <cui-input
                        v-model="patient.householderName"
                        :label="$lang.householder"
                    ></cui-input>
                    <cui-select
                        :label="$lang.relation"
                        style="padding-left: 10px"
                        :note="errors.relation"
                        @select="updateHouseholder"
                        displayValueProp="name"
                        returnValueProp="name"
                        v-model="patient.relation"
                        :data="$store.getters.staticLists.relations"
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
        </div>
        <div style="flex-grow: 1; display: flex; justify-content: flex-end">
            <cui-button
                :label="$lang.cancel"
                @click="
                    $store.commit('SET_LAYOUT_DATA', {
                        receptionModalPatientEdit: false
                    })
                "
                plain
            />
            <cui-button
                primary
                :label="editData ? $lang.save : $lang.register"
                @click="validateForm"
                :loading="loading"
            />
        </div>
    </div>
</template>

<script>
import Joi from "joi";

export default {
    emits: ["cancel", "save", "showPatient"],
    created() {
        this.editData = this.$store.getters.activePatient;
        this.populateData();
    },
    data() {
        return {
            loading: false,
            modals: {
                insuranceNew: false,
                newInsuranceType: "insuranceNew"
            },
            editData: null,
            patient: {
                editSexOrBirthdate: false,
                id: "",
                name: "",
                nameKana: "",
                birthdate: "",
                gender: 1,
                householderName: "",
                relation: "本人",
                occupation: "",
                phone: "",
                mail: "",
                address: {
                    zip: "",
                    addr: ""
                },
                company: {
                    name: "",
                    zip: "",
                    addr: "",
                    phone: ""
                },
                insurance: []
            },
            errors: {
                id: "",
                name: "",
                nameKana: "",
                birthdate: "",
                gender: "",
                householderName: "",
                relation: "",
                occupation: "",
                phone: "",
                mail: "",
                addresszip: "",
                addressaddr: "",
                companyname: "",
                companyzip: "",
                companyaddr: "",
                companyphone: "",
                insurance: ""
            }
        };
    },
    methods: {
        updateHouseholder() {
            if (this.patient.relation === "本人") {
                this.patient.householderName = this.patient.name;
            }
        },
        populateData() {
            this.loading = true;
            if (this.editData) {
                let editData = JSON.parse(JSON.stringify(this.editData));
                editData.currentInsSets = editData.insurance;
                this.patient = editData;
                this.patient.householderName = this.patient.name;
            }
            this.loading = false;
        },
        addInsurance(ins) {
            this.patient.insurance.push(ins);
            console.log(ins);
        },
        removeInsurance(index) {
            this.patient.insurance.splice(index, 1);
        },
        async getAddress(target) {
            let zip = this.patient[target].zip;
            if (zip.length === 7) {
                const addr = await this.$dataService().get.lists.addresses(zip);
                this.patient[target].addr = addr.addr;
            }
        },
        validateForm() {
            Object.keys(this.errors).forEach(key => {
                this.errors[key] = "";
            });

            const schema = Joi.object({
                name: Joi.string().required(),
                nameKana: Joi.string().required(),
                birthdate: Joi.date()
                    .max("now")
                    .required(),
                gender: Joi.number().required(),
                householderName: Joi.string().allow(""),
                relation: Joi.string().allow(""),
                occupation: Joi.string().allow(""),
                phone: Joi.string()
                    .pattern(/^[0-9]*$/)
                    .allow(""),
                mail: Joi.string()
                    .email({ tlds: false })
                    .allow(""),
                address: Joi.object({
                    zip: Joi.string()
                        .pattern(/^[0-9]*$/)
                        .allow(""),
                    addr: Joi.string()
                }),
                company: Joi.object({
                    name: Joi.string().allow(""),
                    zip: Joi.string()
                        .pattern(/^[0-9]*$/)
                        .allow(""),
                    addr: Joi.string().allow(""),
                    phone: Joi.string()
                        .pattern(/^[0-9]*$/)
                        .allow("")
                }),
                insurance: Joi.array()
            });
            try {
                Joi.assert(this.patient, schema, {
                    abortEarly: false,
                    allowUnknown: true,
                    messages: this.$lang.validationMessages
                });
                this.save();
            } catch (err) {
                err.details.forEach(e => {
                    let key = e.path[0];
                    if (e.path.length > 1) {
                        key = key + e.path[1];
                    }
                    this.errors[key] = null;
                    setTimeout(
                        function() {
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
                    newPatientId = await this.$dataService().put.patients(
                        this.patient
                    );
                } catch (err) {
                    this.loading = false;
                    return;
                }
            } else {
                try {
                    newPatientId = await this.$dataService().post.patients(
                        this.patient
                    );
                } catch (err) {
                    this.loading = false;
                    return;
                }
            }
            this.$cui.notification({
                text: this.$lang.saved,
                duration: 2000,
                color: "primary"
            });
            this.$emit("showPatient", newPatientId);

            this.$store.commit("SET_ACTIVE_PATIENT", this.patient);

            this.$store.commit("SET_LAYOUT_DATA", {
                receptionModalPatientEdit: false
            });
        }
    }
};
</script>

<style scoped>
.cc-patient-edit-main {
    display: grid;
    grid-template-columns: 33% 33% auto;
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