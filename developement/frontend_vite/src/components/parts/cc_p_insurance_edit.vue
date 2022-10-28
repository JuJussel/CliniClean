<template>
    <div class="cc-insurance-main">
        <div class="loader cc_reception_payment_loader" v-if="loading.all" />

        <div>
            <cui-switch
                :label="$lang.publicInsurance"
                v-model="isPublic"
                :trueLabel="$lang.publicInsurance"
                falseLabel=""
            />
            <div class="cc-insurance-new-body" v-if="!isPublic">
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
                            :disabled="insurance.relation === 1"
                        ></cui-input>
                        <cui-radio
                            style="margin-left: 10px"
                            :label="$lang.thisPerson"
                            :value="1"
                            v-model="insurance.relation"
                            @select="
                                insurance.insuredName =
                                    $store.getters.activePatient.name
                            "
                        />
                        <cui-radio
                            style="margin-left: 10px"
                            :label="$lang.dependent"
                            :value="2"
                            v-model="insurance.relation"
                            @select="
                                insurance.insuredName = insurance.insuredName
                            "
                        />
                    </div>
                    <cui-input
                        :note="errors.providerNumber"
                        v-model="insurance.providerNumber"
                        :label="$lang.insuranceProviderNumber"
                        @input="getInsuranceName"
                    ></cui-input>
                    <div>
                        <cui-input
                            :note="errors.providerName"
                            v-model="insurance.providerName"
                            :label="$lang.insuranceProviderName"
                            :disabled="loading.provider"
                        ></cui-input>
                    </div>
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
            </div>
            <div class="cc-public-new-body" v-else>
                <div>
                    <cui-input
                        :label="$lang.publicInsuranceProvider"
                        :note="errors.provider"
                        v-model="pub.provider"
                    ></cui-input>
                    <cui-input
                        :label="$lang.publicInsuranceRecepient"
                        :note="errors.recepient"
                        v-model="pub.recepient"
                    ></cui-input>
                    <cui-datepicker
                        :label="$lang.validUntil"
                        range
                        :note="errors.validDate"
                        v-model="pub.validDate"
                    ></cui-datepicker>
                </div>
                <div style="margin-left: 20px; height: 210px">
                    <cui-file-upload
                        :title="$lang.insurancePicture"
                        :accept="['.png', '.jpeg', '.jpg']"
                        :note="errors.files"
                        @change="updateFiles"
                    />
                </div>
            </div>
        </div>
        <div class="cc-insurance-new-footer">
            <cui-button
                @click="
                    $store.commit('SET_LAYOUT_DATA', [
                        'reception',
                        { receptionModalInsuranceEdit: false },
                    ])
                "
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
    emits: ["close", "confirm"],
    data() {
        return {
            isPublic: false,
            loading: {
                all: false,
                provider: false,
            },
            pub: {
                type: "pub",
                provider: "",
                recepient: "",
                validDate: [],
                files: [],
            },
            insurance: {
                type: "ins",
                relation: 1,
                insuredName: this.$store.getters.activePatient.name,
                symbol: "",
                number: "",
                providerNumber: "",
                providerName: "",
                getDate: "",
                validDate: [],
                files: [],
            },
            filesRaw: [],
            patient: this.$store.getters.activePatient,
            errors: {
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
            },
        };
    },
    methods: {
        updateFiles(files) {
            this.filesRaw = files;
        },
        async getInsuranceName() {
            this.loading.provider = true;
            const number = this.insurance.providerNumber;
            if (number.length === 6 || number.length === 8) {
                const data =
                    await this.$dataService().get.lists.insuranceProviders(
                        number
                    );
                this.insurance.providerName =
                    data.Insurance_Number_Name +
                    " - " +
                    data.InsuranceProvider_WholeName;
                this.loading.provider = false;
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
        checkProvider(data, helpers) {
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
        },
        checkRecepient(data, helpers) {
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
        },

        async convertFiles(files) {
            let that = this;
            return Promise.all(
                files.map((file) => {
                    return readAsDataURL(file);
                })
            );
            function readAsDataURL(file) {
                return new Promise((resolve) => {
                    let fileReader = new FileReader();
                    fileReader.onload = function () {
                        return resolve({
                            data: fileReader.result,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            meta: {
                                source: "insurance",
                                symbol: that.insurance.symbol,
                                number: that.insurance.number,
                                provider: that.insurance.providerNumber,
                            },
                        });
                    };
                    fileReader.readAsDataURL(file);
                });
            }
        },
        async validate() {
            this.loading.all = true;
            Object.keys(this.errors).forEach((key) => {
                this.errors[key] = "";
            });

            if (this.isPublic) {
                this.pub.files = this.filesRaw;
            } else {
                this.insurance.files = this.filesRaw;
            }

            var schema = Joi.object({
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
                    .custom(this.checkInsuranceNumber),
                providerName: Joi.string().required(),
                getDate: Joi.date().max("now").iso().required().messages({
                    "date.max": "本日以下の日付を選択してください",
                }),
                validDate: Joi.array().items(Joi.date().required()),
                files: Joi.array()
                    .min(1)
                    .messages({ "array.min": "保険証写真を選択してください" }),
            });

            if (this.isPublic) {
                schema = Joi.object({
                    provider: Joi.string()
                        .required()
                        .pattern(/^[0-9]*$/)
                        .custom(this.checkProvider),
                    recepient: Joi.string()
                        .required()
                        .pattern(/^[0-9]*$/)
                        .custom(this.checkRecepient),
                    validDate: Joi.array().items(Joi.date().required()),
                    files: Joi.array().min(1).messages({
                        "array.min": "保険証写真を選択してください",
                    }),
                });
            }

            try {
                let sendData = this.isPublic ? this.pub : this.insurance;
                Joi.assert(sendData, schema, {
                    abortEarly: false,
                    allowUnknown: true,
                    messages: this.$lang.validationMessages,
                });

                sendData.files = await this.convertFiles(this.filesRaw);
                sendData.patient = this.patient;

                try {
                    await this.$dataService().post.insurance([sendData]);
                    this.$store.commit("SET_ACTIVE_PATIENT", "loading");
                    const patientData =
                        await this.$dataService().get.patient.details(
                            this.patient.id
                        );
                    this.loading.all = false;
                    this.$store.commit(
                        "SET_ACTIVE_PATIENT",
                        patientData.patientData
                    );
                    this.$store.commit("SET_LAYOUT_DATA", [
                        "reception",
                        { receptionModalInsuranceEdit: false },
                    ]);
                } catch (err) {
                    this.loading.all = false;
                    return;
                }
            } catch (err) {
                this.loading.all = false;
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
    },
};
</script>

<style scoped>
.cc-insurance-main {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.cc-insurance-new-body {
    display: grid;
    grid-template-columns: 50% 50%;
    overflow: hidden;
}
.cc-public-new-body {
    display: grid;
    grid-template-columns: 50% 50%;
    overflow: hidden;
}
.cc-insurance-new-footer {
    grid-area: footer;
    display: flex;
    justify-content: flex-end;
}
</style>
