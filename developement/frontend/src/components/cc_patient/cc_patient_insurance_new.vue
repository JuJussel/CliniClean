<template>
    <div class="cc-insurance-new-body">
        <div>
            <cui-input
                :note="errors.symbol"
                v-model="insurance.symbol"
                :label="$lang.insuranceSymbol"
            ></cui-input>
            <cui-input
                :note="errors.number"
                v-model="insurance.number"
                :label="$lang.insuranceNumber"
            ></cui-input>
            <div style="display: flex; align-items: center">
                <cui-input
                    :note="errors.insuredName"
                    v-model="insurance.insuredName"
                    :label="$lang.insuranceInsuredName"
                    :disabled="insurance.relation === $lang.thisPerson"
                ></cui-input>
                <cui-radio
                    style="margin-left: 10px"
                    :label="$lang.thisPerson"
                    :value="$lang.thisPerson"
                    v-model="insurance.relation"
                    @select="insurance.insuredName = patientName"
                />
                <cui-radio
                    style="margin-left: 10px"
                    :label="$lang.dependent"
                    :value="$lang.dependent"
                    v-model="insurance.relation"
                    @select="insurance.insuredName = insurance.insuredName"
                />
            </div>

            <cui-input
                :note="errors.providerNumber"
                v-model="insurance.providerNumber"
                :label="$lang.insuranceProviderNumber"
                @input="getInsuranceName"
            ></cui-input>
            <cui-input
                :note="errors.providerName"
                v-model="insurance.providerName"
                :label="$lang.insuranceProviderName"
            ></cui-input>
        </div>
        <div style="margin-left: 20px">
            <cui-datepicker
                :note="errors.getDate"
                v-model="insurance.getDate"
                :label="$lang.insuranceGetDate"
            ></cui-datepicker>
            <cui-datepicker
                :note="errors.validDate"
                v-model="insurance.validDate"
                :label="$lang.validUntil"
                range
            ></cui-datepicker>
            <cui-file-upload
                style="height: 205px"
                :title="$lang.insurancePicture"
                :accept="['.png', '.jpeg', '.jpg']"
                :note="errors.files"
                @change="updateFiles"
            />
        </div>
        <div class="cc-insurance-new-footer">
            <cui-button
                @click="$emit('close')"
                plain
                :label="$lang.cancel"
            ></cui-button>
            <cui-button @click="validate()" :label="$lang.add"></cui-button>
        </div>
    </div>
</template>

<script>
import Joi from "joi";

export default {
    name: 'ccPatientInsuranceNew',
    props: {
        patientName: { default: "", type: String },
    },
    emits: ["close", "confirm"],
    data() {
        return {
            insurance: {
                type: 'ins',
                relation: this.$lang.thisPerson,
                insuredName: this.patientName,
                symbol: "",
                number: "",
                providerNumber: "",
                providerName: "",
                getDate: "",
                validDate: [],
                files: [],
            },
            errors: {
                insuredName: '',
                symbol: '',
                number: '',
                providerNumber: '',
                providerName: '',
                getDate: '',
                validDate: '',
                files: ''
            },
        };
    },
    methods: {
        updateFiles(files) {
            this.insurance.files = files;
        },
        async getInsuranceName() {
            const number = this.insurance.providerNumber;
            if(number.length === 6 || number.length === 8){
                const data= await this.$dataService().get.lists.insuranceProviders(number)
                this.insurance.providerName = data.name;
            }
        },
        checkInsuranceNumber(value, helpers) {
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
        },
        validate() {
            Object.keys(this.errors).forEach((key) => {
                this.errors[key] = "";
            });

            const schema = Joi.object({
                insuredName: Joi.string().required(),
                symbol: Joi.string().required().pattern(/^[0-9]*$/),
                number: Joi.string().required().pattern(/^[0-9]*$/),
                providerNumber: Joi.string()
                    .required()
                    .pattern(/^[0-9]*$/)
                    .custom(this.checkInsuranceNumber),
                providerName: Joi.string().required(),
                getDate: Joi.date().max('now').required().messages({'date.max': '本日以下の日付を選択してください'}),
                validDate: Joi.array().items(Joi.date().required()),
                files: Joi.array().min(1).messages({'array.min': '保険証写真を選択してください'})
            });
            try {
                Joi.assert(this.insurance, schema, {
                    abortEarly: false,
                    allowUnknown: true,
                    messages: this.$lang.validationMessages,
                });
                this.$emit('confirm', this.insurance);
                this.$emit('close');
            } catch (err) {
                err.details.forEach((e) => {
                    this.errors[e.context.label] = null;
                    setTimeout(
                        function () {
                            this.errors[e.context.label] = e.message;
                        }.bind(this),
                        50
                    );
                });
            }
        },
    }
};
</script>

<style scoped>
.cc-insurance-new-body {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto 60px;
    grid-template-areas: "main main" "footer footer";
    overflow: hidden;
}
.cc-insurance-new-footer {
    grid-area: footer;
    display: flex;
    justify-content: flex-end;
}
</style>
