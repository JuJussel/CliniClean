<template>
    <Stepper :value="activeStep" linear>
        <StepList>
            <Step value="1"> {{ $t("patientInfo") }}</Step>
            <Step value="2"> {{ $t("insurance") }}</Step>
            <Step value="3"> {{ $t("confirm") }}</Step>
        </StepList>
        <StepPanels class="!pb-0">
            <StepPanel value="1">
                <PatientDataBasicForm ref="patientDataBasicForm" class="h-[480px]" />
                <div class="flex justify-end gap-2">
                    <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')"
                        text></Button>
                    <Button type="button" :label="$t('next')" @click="nextStep()" raised></Button>
                </div>
            </StepPanel>
            <StepPanel value="2">
                <div class="h-[480px]" v-if="insuranceReady">
                    <PatientDataInsuranceForm ref="insuranceForm" :patient="patientDataBasicForm.patientData" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')"
                        text></Button>
                    <Button type="button" :label="$t('skip')" severity="secondary" @click="nextStep(true)"
                        text></Button>
                    <Button type="button" :label="$t('prev')" severity="secondary" @click="activeStep = '1'"
                        raised></Button>
                    <Button type="button" :label="$t('next')" @click="nextStep()" raised></Button>
                </div>
            </StepPanel>
            <StepPanel value="3" class="flex items-center justify-center">
                <ProgressSpinner v-if="loading" class="!absolute z-[10000] !w-[150px] !h-[150px]" />
                <BlockUI :blocked="loading" class="grow">
                    <div v-if="activeStep === '3'" class=" h-[480px] grid grid-cols-3 -1 gap-2">
                        <PatientInfo :patientDataBasic="patientDataBasicForm.patientData" />
                        <Fieldset v-if="!insuranceSkipped" :legend="$t('insurance')" class="col-span-3 h-36">
                            <PatientInsuranceView :insurance="insuranceForm.newInsuranceData" />
                        </Fieldset>
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')" text
                            :disabled="loading"></Button>
                        <Button type="button" :label="$t('prev')" severity="secondary" @click="activeStep = '2'" raised
                            :disabled="loading"></Button>
                        <Button type="button" :label="$t('register')" @click="submit" raised
                            :disabled="loading"></Button>
                    </div>
                </BlockUI>
            </StepPanel>
        </StepPanels>
    </Stepper>
</template>

<script setup>
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import PatientDataBasicForm from "@/comps/shared/forms/patient_data_basic.vue";
import PatientDataInsuranceForm from "@/comps/shared/forms/patient_data_insurance.vue";
import PatientInfo from "@/comps/shared/patient_info_basic.vue";
import PatientInsuranceView from "@/comps/shared/insurance_info.vue"
import useApi from "@/composables/apiComposable.js"
import fileTools from "@/composables/fileComposable.js"

const emit = defineEmits(["close", "commit"]);

const activeStep = ref("1");
const patientDataBasicForm = ref(null);
const insuranceForm = ref(null);
const insuranceSkipped = ref(false)
const insuranceReady = ref(false)
const loading = ref(false)

const nextStep = (skipInsurance = false) => {
    if (skipInsurance) {
        insuranceSkipped.value = true
        activeStep.value = "3";
    }
    if (activeStep.value === "1" && patientDataBasicForm.value.validateForm()) {
        insuranceReady.value = true
        activeStep.value = "2";
    } else if (activeStep.value === "2" && insuranceForm.value.validateForm()) {
        insuranceSkipped.value = false
        activeStep.value = "3";
    } else {
    }
}

const submit = async () => {
    loading.value = true
    try {
        let patientSendData = patientDataBasicForm.value.patientData
        if (insuranceSkipped.value) {
            patientSendData.insurance = []
        } else {
            patientSendData.insurance = [insuranceForm.value.newInsuranceData]
            patientSendData.insurance[0].files = await fileTools.objectURLtoBlob(patientSendData.insurance[0].files)
            console.log(patientSendData);
            const meta = {
                source: "insurance",
                symbol: patientSendData.insurance[0].symbol,
                number: patientSendData.insurance[0].number,
                provider: patientSendData.insurance[0].providerNumber,

            }
            patientSendData.insurance[0].files = await fileTools.blobToDataURL(patientSendData.insurance[0].files, meta)
        }

        await useApi.post('patients', patientSendData)
        emit('close')
    } catch (err) {
        console.log(err);

        return
    }
    loading.value = false
}
</script>
