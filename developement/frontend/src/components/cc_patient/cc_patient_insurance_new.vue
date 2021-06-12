<template>
    <div class="cc-insurance-new-body">
        <div>
            <cui-input :note="errors.symbol" v-model="insurance.symbol" :label="$lang.insuranceSymbol"></cui-input>
            <cui-input :note="errors.number" v-model="insurance.number" :label="$lang.insuranceNumber"></cui-input>
            <div style="display: flex; align-items: center">
                <cui-input :note="errors.insuredName" v-model="insurance.insuredName" :label="$lang.insuranceInsuredName" :disabled="insurance.relation === $lang.thisPerson"></cui-input>
                <cui-radio style="margin-left: 10px" :label="$lang.thisPerson" :value="$lang.thisPerson"  v-model="insurance.relation"/>
                <cui-radio style="margin-left: 10px" :label="$lang.dependent" :value="$lang.dependent"  v-model="insurance.relation"/>
            </div>

            <cui-input :note="errors.providerNumber" v-model="insurance.providerNumber" :label="$lang.insuranceProviderNumber"></cui-input>
            <cui-input :note="errors.providerName" v-model="insurance.providerName" :label="$lang.insuranceProviderName"></cui-input>

        </div>
        <div style="margin-left: 20px">
            <cui-datepicker :note="errors.getDate" v-model="insurance.getDate" :label="$lang.insuranceGetDate"></cui-datepicker>
            <cui-datepicker :note="errors.validDate" v-model="insurance.validDate" :label="$lang.validUntil" range></cui-datepicker>
            <cui-file-upload :title="$lang.insurancePicture" :accept="['.png','.jpeg','.jpg']" />
        </div>
        <div class="cc-insurance-new-footer">
            <cui-button @click="$emit('close')" plain :label="$lang.cancel"></cui-button>
            <cui-button @click="validate()" :label="$lang.add"></cui-button>
        </div>
    </div>
</template>

<script>

import Joi from "joi";

export default {
    emits: ['close', 'add'],
    data() {
        return {
            insurance: {
                relation: this.$lang.thisPerson,
                insuredName: '',
                symbol: '',
                number: '',
                providerNumber: '',
                providerName: '',
                getDate: '',
                validDate: [],
                files: []
            },
            errors: {
                insuredName: '',
                symbol: '',
                number: '',
                providerNumber: '',
                providerName: '',
                getDate: '',
                validDate: ''
            }
        }
    },
    methods: {
         validate() {
            const schema = Joi.object({
                insuredName: Joi.string().required(),
                symbol: Joi.number().required(),
                number: Joi.number().required(),
                providerNumber: Joi.number().required(),
                providerName: Joi.string().required(),
                getDate: Joi.date().required(),
                validDate: Joi.array().items(Joi.date().required())
            });
            try {
                Joi.assert(this.insurance, schema, {abortEarly: false, allowUnknown: true, messages: this.$lang.validationMessages})
            }
            catch (err) {
                console.dir(err)
                err.details.forEach(e => {
                    this.errors[e.context.label] = e.message
                });
            }
            
            
        },
        addInsurance() {

        }
    }
    
}
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