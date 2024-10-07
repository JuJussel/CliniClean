<template>
    <div class="grid grid-cols-3 gap-4 pb-4 h-[480px]">
        <Fieldset :legend="$t('basic')">
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="name">{{ $t("name") }}</label>
                    <span v-if="errors.name" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.name }}</span>
                </div>
                <InputText id="name" v-model="patientData.name" :invalid="errors.name ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="nameKana">{{ $t("nameKana") }}</label>
                    <span v-if="errors.nameKana" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.nameKana }}</span>
                </div>
                <InputText id="nameKana" v-model="patientData.nameKana" :invalid="errors.nameKana ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="birthdate">{{ $t("birthdate") }}</label>
                    <span v-if="errors.birthdate" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.birthdate }}</span>
                </div>
                <DatePicker id="birthdate" v-model="patientData.birthdate" :dateFormat="locale.dateFormat" showIcon
                    :invalid="errors.birthdate ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <label for="gender">{{ $t("gender") }}</label>
                <div class="flex gap-3 h-[34px]">
                    <div class="flex items-center">
                        <RadioButton v-model="patientData.gender" inputId="gender1" name="gender" :value="1" />
                        <label for="gender1" class="ml-2">{{
                            $t("male")
                            }}</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton v-model="patientData.gender" inputId="gender2" name="gender" :value="2" />
                        <label for="gender2" class="ml-2">{{
                            $t("female")
                            }}</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton v-model="patientData.gender" inputId="gender3" name="gender" :value="3" />
                        <label for="gender3" class="ml-2">{{
                            $t("other")
                            }}</label>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <label>{{ $t("occupation") }}</label>
                <Select v-model="patientData.occupation" :options="listStore.listData.occupations" />
            </div>
        </Fieldset>
        <Fieldset :legend="$t('contactInfo')">
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="zip">{{ $t("zipCode") }}</label>
                    <span v-if="errors.addresszip" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.addresszip }}</span>
                </div>
                <InputText id="zip" v-model="patientData.address.zip" :invalid="errors.addresszip ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="addr">{{ $t("address") }}</label>
                    <span v-if="errors.addressaddr" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.addressaddr }}</span>
                </div>
                <InputText id="addr" v-model="patientData.address.addr" :invalid="errors.addressaddr ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="phone">{{ $t("telephone") }}</label>
                    <span v-if="errors.phone" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.phone }}</span>
                </div>
                <InputText id="phone" v-model="patientData.phone" :invalid="errors.phone ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="name">{{ $t("mailAddress") }}</label>
                    <span v-if="errors.mail" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.mail }}</span>
                </div>
                <InputText id="name" v-model="patientData.mail" :invalid="errors.mail ? true : false" />
            </div>
            <div class="mb-4">
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <label for="name">{{ $t("householder") }}</label>
                        <InputText id="name" v-model="patientData.householderName" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="name">{{ $t("relation") }}</label>
                        <Select v-model="patientData.relation" :options="listStore.listData.relations"
                            optionLabel="name" />
                    </div>
                </div>
            </div>
        </Fieldset>
        <Fieldset :legend="$t('workOrSchool')">
            <div class="flex flex-col gap-1 mb-4">
                <label for="name">{{ $t("workOrSchoolName") }}</label>
                <InputText id="name" v-model="patientData.company.name" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="name">{{ $t("zipCode") }}</label>
                    <span v-if="errors.companyzip" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.companyzip }}</span>
                </div>
                <InputText id="name" v-model="patientData.company.zip" :invalid="errors.companyzip ? true : false" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <label for="name">{{ $t("address") }}</label>
                <InputText id="name" v-model="patientData.company.addr" />
            </div>
            <div class="flex flex-col gap-1 mb-4">
                <div>
                    <label for="name">{{ $t("telephone") }}</label>
                    <span v-if="errors.companyphone" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                        id="name-help">{{ errors.companyphone }}</span>
                </div>
                <InputText id="name" v-model="patientData.company.phone"
                    :invlaid="errors.companyphone ? true : false" />
            </div>
        </Fieldset>
    </div>
</template>

<script setup>
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import Joi from "joi";
import locale from "@/lang/ja.json";

const listStore = useListStore();

// const patientData = reactive({
//     editSexOrBirthdate: false,
//     id: null,
//     name: "",
//     nameKana: "",
//     birthdate: "",
//     gender: 1,
//     householderName: "",
//     relation: listStore.listData.relations[18],
//     occupation: listStore.listData.occupations[0],
//     phone: "",
//     mail: "",
//     address: {
//         zip: "",
//         addr: "",
//     },
//     company: {
//         name: "",
//         zip: "",
//         addr: "",
//         phone: "",
//     },
//     insurance: [],
// });
const patientData = reactive({
    editSexOrBirthdate: false,
    id: null,
    name: "",
    nameKana: "",
    birthdate: "",
    gender: 1,
    householderName: "",
    relation: listStore.listData.relations[18],
    occupation: listStore.listData.occupations[0],
    phone: "",
    mail: "",
    address: {
        zip: "",
        addr: "",
    },
    company: {
        name: "",
        zip: "",
        addr: "",
        phone: "",
    },
    insurance: [],
});

const errors = reactive({
    id: false,
    name: false,
    nameKana: false,
    birthdate: false,
    gender: false,
    householderName: false,
    relation: false,
    occupation: false,
    phone: false,
    mail: false,
    addresszip: false,
    addressaddr: false,
    companyname: false,
    companyzip: false,
    companyaddr: false,
    companyphone: false,
    insurance: false,
});

const validateForm = () => {
    Object.keys(errors).forEach((key) => {
        errors[key] = false;
    });
    const schema = Joi.object({
        name: Joi.string().required(),
        nameKana: Joi.string().required(),
        birthdate: Joi.date().max("now").required(),
        householderName: Joi.string().allow(""),
        occupation: Joi.string().allow(""),
        phone: Joi.string()
            .pattern(/^[0-9]*$/)
            .allow(""),
        mail: Joi.string().email({ tlds: false }).allow(""),
        address: Joi.object({
            zip: Joi.string()
                .pattern(/^[0-9]*$/)
                .allow(""),
            addr: Joi.string(),
        }),
        company: Joi.object({
            name: Joi.string().allow(""),
            zip: Joi.string()
                .pattern(/^[0-9]*$/)
                .allow(""),
            addr: Joi.string().allow(""),
            phone: Joi.string()
                .pattern(/^[0-9]*$/)
                .allow(""),
        }),
        insurance: Joi.array(),
    });
    try {
        Joi.assert(patientData, schema, {
            abortEarly: false,
            allowUnknown: true,
            messages: locale.validationMessages,
        });
        return true;
    } catch (err) {
        err.details.forEach((e) => {
            let key = e.path[0];
            if (e.path.length > 1) {
                key = key + e.path[1];
            }
            errors[key] = null;
            setTimeout(function () {
                errors[key] = e.message;
            }, 50);
        });
        return false;
    }
};

defineExpose({
    validateForm,
    patientData,
});
</script>
