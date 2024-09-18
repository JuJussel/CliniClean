<template>
    <div>
        <Fieldset>
            <template #legend>
                <div class="flex  items-center gap-6">
                    <div>{{ $t('insurance') + $t('register') }}</div>
                    <div class="flex items-center gap-2">
                        <ToggleSwitch id="isPublic" v-model="isPublic" />
                        <label for="isPublic">{{ $t('publicInsurance') }}</label>
                    </div>
                </div>
            </template>
            <div class="grid grid-cols-4 gap-4" v-if="!isPublic">
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceSymbol') }}</label>
                        <span v-if="errors.symbol" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                            id="name-help">{{ errors.symbol }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.symbol" :invalid="errors.symbol ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceNumber') }}</label>
                        <span v-if="errors.number" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                            id="name-help">{{ errors.number }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.number" :invalid="errors.number ? true : false" />
                </div>
                <div class="flex flex-col gap-1">
                    <div>
                        <label for="name">{{ $t('insuranceInsuredName') }}</label>
                        <span v-if="errors.insuredName"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.insuredName }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.insuredName" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <label for="name">{{ $t('relation') }}</label>
                    <Select v-model="newInsuranceData.relation" :options="listStore.listData.relations"
                        optionLabel="name" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceProviderNumber') }}</label>
                        <span v-if="errors.providerNumber"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.providerNumber }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.providerNumber"
                        :invalid="errors.providerNumber ? true : false" @update:modelValue="getInsuranceName" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceProviderName') }}</label>
                        <span v-if="errors.providerName"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.providerName }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.providerName"
                        :invalid="errors.providerName ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="getDate">{{ $t('insuranceGetDate') }}</label>
                        <span v-if="errors.getDate" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                            id="name-help">{{ errors.getDate }}</span>
                    </div>
                    <DatePicker id="getDate" v-model="newInsuranceData.getDate" :dateFormat="locale.dateFormat" showIcon
                        :invalid="errors.getDate ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="validDate">{{ $t('validUntil') }}</label>
                        <span v-if="errors.validDate"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.validDate }}</span>
                    </div>
                    <DatePicker id="validDate" v-model="newInsuranceData.validDate" :dateFormat="locale.dateFormat"
                        showIcon :invalid="errors.validDate ? true : false" />
                </div>
            </div>
        </Fieldset>
        <div class="grid grid-cols-2 gap-4">
            <Fieldset :legend="$t('files')">
                <FileUploadList ref="fileUpload" />
            </Fieldset>
        </div>
    </div>
</template>

<script setup>
import FileUploadList from '@/comps/shared/forms/file_upload_list.vue'
import ToggleSwitch from 'primevue/toggleswitch';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Joi from "joi";
import locale from "@/lang/ja.json"
import useApi from "@/composables/apiComposable.js"


const listStore = useListStore()
const fileUpload = ref(null)


const isPublic = ref(false)
const insuranceNameLoading = ref(false)
const insuranceNameTimeout = ref(null)

const newInsuranceData = reactive({
    symbol: "",
    number: "",
    insuredName: "",
    relation: listStore.listData.relations[18],
    providerNumber: "",
    providerName: "",
    getDate: "",
    validDate: "",
    files: []
})
const errors = reactive({
    insuredName: "",
    symbol: "",
    number: "",
    providerNumber: "",
    providerName: "",
    getDate: "",
    validDate: "",
    files: "",
    provider: "",
    recepient: "",
    provider: "",
    recepient: ""
})

const validateForm = () => {

    Object.keys(errors).forEach((key) => {
        errors[key] = false;
    });
    newInsuranceData.files = fileUpload.value.filesRaw
    console.log(newInsuranceData);

    let schema = Joi.object({
        insuredName: Joi.string().required(),
        symbol: Joi.string()
            .required()
            .pattern(/^[0-9]*$/),
        number: Joi.string()
            .required()
            .pattern(/^[0-9]*$/),
        providerNumber: Joi.string()
            .required()
            .pattern(/^[0-9]*$/)
            .custom(checkInsuranceNumber),
        providerName: Joi.string().required(),
        getDate: Joi.date().max("now").iso().required().messages({
            "date.max": "本日以下の日付を選択してください",
        }),
        validDate: Joi.array().items(Joi.date().required()),
        files: Joi.array()
            .min(1)
            .messages({ "array.min": "保険証写真を選択してください" }),
    });

    if (isPublic.value) {
        schema = Joi.object({
            provider: Joi.string()
                .required()
                .pattern(/^[0-9]*$/)
                .custom(checkProvider),
            recepient: Joi.string()
                .required()
                .pattern(/^[0-9]*$/)
                .custom(checkRecepient),
            validDate: Joi.array().items(Joi.date().required()),
            files: Joi.array().min(1).messages({
                "array.min": "保険証写真を選択してください",
            }),
        });
    }

    try {
        Joi.assert(newInsuranceData, schema, {
            abortEarly: false,
            allowUnknown: true,
            messages: locale.validationMessages,
        });
        return true
    } catch (err) {
        err.details.forEach((e) => {
            let key = e.path[0];
            if (e.path.length > 1) {
                key = key + e.path[1];
            }
            errors[key] = null;
            setTimeout(
                function () {
                    errors[key] = e.message;
                }, 50
            );
        });
        return false
    }
}

const getInsuranceName = async () => {
    clearTimeout(insuranceNameTimeout.value)
    insuranceNameLoading.value = true;
    const number = newInsuranceData.providerNumber;
    if (number.length === 6 || number.length === 8) {
        insuranceNameTimeout.value = setTimeout(async () => {
            insuranceNameLoading.value = true;
            const data = await useApi.get("lists/insuranceProviders?number=" + number)
            if (data.Insurance_Number_Name && data.InsuranceProvider_WholeName) {
                newInsuranceData.value.providerName =
                    data.Insurance_Number_Name +
                    " - " +
                    data.InsuranceProvider_WholeName;
            }
            insuranceNameLoading.value = false;
        }, 1000)
    }
}

const checkInsuranceNumber = (value, helpers) => {
    if (value.length != 8 && value.length != 6) {
        return helpers.error("any.invalid");
    }
    var ns = value.toString(10);
    if (ns.length == 6) {
        ns = "00" + ns;
    }
    ns = ns.split("");
    var x1 = ns[0] * 2;
    if (x1 > 9) {
        x1 = x1 - 9;
    }
    var x2 = ns[1];
    var x3 = ns[2] * 2;
    if (x3 > 9) {
        x3 = x3 - 9;
    }
    var x4 = ns[3];
    var x5 = ns[4] * 2;
    if (x5 > 9) {
        x5 = x5 - 9;
    }
    var x6 = ns[5];
    var x7 = ns[6] * 2;
    if (x7 > 9) {
        x7 = x7 - 9;
    }
    var x8 = ns[7];
    if (x8 !== "") {
        var check =
            x1 * 1 +
            x2 * 1 +
            x3 * 1 +
            x4 * 1 +
            x5 * 1 +
            x6 * 1 +
            x7 * 1;
        var check_str = check.toString();
        var check_pos = check_str.length - 1;
        var check_number = 10 - check_str[check_pos];

        if (check_str[check_pos] == 0) {
            check_number = 0;
        }
    }
    if (check_number != x8) {
        return helpers.error("any.invalid");
    } else {
        return value;
    }
}

const checkProvider = (data, helpers) => {
    let check_number = 0;
    if (data.length != 8) {
        return helpers.error("any.invalid");
    }
    var ns = data.toString(10);
    ns = ns.split("");
    var x1 = ns[0] * 2;
    if (x1 > 9) {
        x1 = x1 - 9;
    }
    var x2 = ns[1];
    var x3 = ns[2] * 2;
    if (x3 > 9) {
        x3 = x3 - 9;
    }
    var x4 = ns[3];
    var x5 = ns[4] * 2;
    if (x5 > 9) {
        x5 = x5 - 9;
    }
    var x6 = ns[5];
    var x7 = ns[6] * 2;
    if (x7 > 9) {
        x7 = x7 - 9;
    }
    var x8 = ns[7];
    if (x8 !== "") {
        var check =
            x1 * 1 +
            x2 * 1 +
            x3 * 1 +
            x4 * 1 +
            x5 * 1 +
            x6 * 1 +
            x7 * 1;
        var check_str = check.toString();
        var check_pos = check_str.length - 1;
        check_number = 10 - check_str[check_pos];
        if (check_str[check_pos] == 0) {
            check_number = 0;
        }
    }
    if (check_number != x8) {
        return helpers.error("any.invalid");
    } else {
        return data;
    }
}

const checkRecepient = (data, helpers) => {
    let check_number = 0;
    if (data.length != 7) {
        helpers.error("any.invalid");
    }
    var ns = data.toString(10);
    ns = ns.split("");
    var x1 = ns[0];
    var x2 = ns[1] * 2;
    if (x2 > 9) {
        x2 = x2 - 9;
    }
    var x3 = ns[2];
    var x4 = ns[3] * 2;
    if (x4 > 9) {
        x4 = x4 - 9;
    }
    var x5 = ns[4];
    var x6 = ns[5] * 2;
    if (x6 > 9) {
        x6 = x6 - 9;
    }
    var x7 = ns[6];
    if (x7 !== "") {
        var check = x1 * 1 + x2 * 1 + x3 * 1 + x4 * 1 + x5 * 1 + x6 * 1;
        var check_str = check.toString();
        var check_pos = check_str.length - 1;
        check_number = 10 - check_str[check_pos];
        if (check_str[check_pos] == 0) {
            check_number = 0;
        }
    }
    if (check_number != x7) {
        return helpers.error("any.invalid");
    } else {
        return data;
    }
}

defineExpose({
    validateForm
})

</script>