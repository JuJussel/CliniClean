<template>
    <div class="cc-public-new-body">
        <div>
            <cui-input :label="$lang.publicInsuranceProvider" :note="errors.provider" v-model="insurance.provider"></cui-input>
            <cui-input :label="$lang.publicInsuranceRecepient" :note="errors.recepient" v-model="insurance.recepient"></cui-input>
            <cui-datepicker :label="$lang.validUntil" range :note="errors.validDate" v-model="insurance.validDate"></cui-datepicker>
        </div>
        <div style="margin-left: 20px; height: 210px">
            <cui-file-upload 
                :title="$lang.insurancePicture" 
                :accept="['.png','.jpeg','.jpg']" 
                :note="errors.files"
                @change="updateFiles"
            />
        </div>
        <div class="cc-public-new-footer">
            <cui-button @click="$emit('close')" plain :label="$lang.cancel"></cui-button>
            <cui-button @click="validate" :label="$lang.add"></cui-button>
        </div>
    </div>
</template>

<script>

import Joi from "joi";

export default {
    emits: ['close', 'confirm'],
    data() {
        return {
            insurance: {
                type: 'pup',
                provider: '',
                recepient: '',
                validDate: [],
                files: []
            },
            errors: {
                provider: '',
                recepient: '',
                validDate: '',
                files: ''
            }
        }
    },
    methods: {
        updateFiles(files) {
            this.insurance.files = files;
        },
		validateProvider(data, helpers) {
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
                x1 * 1 + x2 * 1 + x3 * 1 + x4 * 1 + x5 * 1 + x6 * 1 + x7 * 1;
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
                return data
            }
        },
        validateRecepient(data, helpers) {
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
                return data
            }
        },
        validate() {
            Object.keys(this.errors).forEach((key) => {
                this.errors[key] = '';
            });

            const schema = Joi.object({
                provider: Joi.string().required().pattern(/^[0-9]*$/).custom(this.validateProvider),
                recepient: Joi.string().required().pattern(/^[0-9]*$/).custom(this.validateRecepient),
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
        }
    }
    
}
</script>

<style scoped>
    .cc-public-new-body {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: auto 60px;
        grid-template-areas: "main main" "footer footer";
        overflow: hidden;
        height: 100%
    }
    .cc-public-new-footer {
        grid-area: footer;
        display: flex;
        justify-content: flex-end;
    }
</style>