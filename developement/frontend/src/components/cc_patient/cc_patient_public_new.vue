<template>
    <div class="cc-insurance-new-body">
        <div>
            <cui-input :label="$lang.insuranceSymbol"></cui-input>
            <cui-input :label="$lang.insuranceNumber"></cui-input>
            <div style="display: flex; align-items: center">
                <cui-input :label="$lang.insuranceInsuredName" :disabled="insurance.relation === $lang.thisPerson"></cui-input>
                <cui-radio style="margin-left: 10px" :label="$lang.thisPerson" :value="$lang.thisPerson"  v-model="insurance.relation"/>
                <cui-radio style="margin-left: 10px" :label="$lang.dependent" :value="$lang.dependent"  v-model="insurance.relation"/>
            </div>

            <cui-input :label="$lang.insuranceProviderNumber"></cui-input>
            <cui-input :label="$lang.insuranceProviderName"></cui-input>

        </div>
        <div style="margin-left: 20px">
            <cui-datepicker :label="$lang.insuranceGetDate"></cui-datepicker>
            <cui-datepicker :label="$lang.validUntil" range></cui-datepicker>
            <cui-file-upload :title="$lang.insurancePicture" :accept="['.png','.jpeg','.jpg']" />
        </div>
        <div class="cc-insurance-new-footer">
            <cui-button @click="$emit('close')" plain :label="$lang.cancel"></cui-button>
            <cui-button @click="addInsurance" :label="$lang.add"></cui-button>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['close', 'add'],
    data() {
        return {
            insurance: {
                relation: this.$lang.thisPerson
            }
        }
    },
    methods: {
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