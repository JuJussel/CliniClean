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
            <cui-datepicker :label="$lang.insuranceGetDate"></cui-datepicker>
            <cui-datepicker :label="$lang.validUntil" range></cui-datepicker>

        </div>
        <div style="margin-left: 20px">
            <h4> {{ $lang.insurancePicture }} </h4>
            <cui-button :label="$lang.select"></cui-button>
        </div>
        <div class="cc-insurance-new-footer"></div>
    </div>
</template>

<script>
export default {

    data() {
        return {
            insurance: {
                relation: this.$lang.thisPerson
            }
        }
    }
    
}
</script>

<style scoped>
    .cc-insurance-new-body {
        display: grid;
        grid-template-columns: 350px 400px;
        grid-template-rows: auto 30px;
        grid-template-areas: "main main" "footer footer"
    }
    .cc-insurance-new-footer {
        grid-area: footer;
    }
</style>