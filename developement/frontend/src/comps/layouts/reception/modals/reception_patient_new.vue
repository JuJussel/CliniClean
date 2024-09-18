<template>

    <Stepper :value="activeStep" linear>
        <StepList>
            <Step value="1"> {{ $t('patientInfo') }}</Step>
            <Step value="2"> {{ $t('insurance') }}</Step>
            <Step value="3"> {{ $t('confirm') }}</Step>
        </StepList>
        <StepPanels class="!pb-0 ">
            <StepPanel value="1">
                <PatientDataBasicForm ref="patientDataBasicForm" class=" h-[480px]" />
                <div class=" flex justify-end gap-2">
                    <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')"
                        raised></Button>
                    <Button type="button" :label="$t('next')" @click="nextStep()" raised></Button>
                </div>
            </StepPanel>
            <StepPanel value="2">
                <div class=" h-[480px]">
                    <PatientDataInsuranceForm ref="insuranceForm" />
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')"
                        raised></Button>
                    <Button type="button" :label="$t('prev')" severity="secondary" @click="activeStep = '1'"
                        raised></Button>
                    <Button type="button" :label="$t('next')" @click="nextStep" raised></Button>
                </div>
            </StepPanel>
        </StepPanels>
    </Stepper>



</template>

<script setup>
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import PatientDataBasicForm from '@/comps/shared/forms/patient_data_basic.vue'
import PatientDataInsuranceForm from '@/comps/shared/forms/patient_data_insurance.vue'

const emit = defineEmits(['close', 'commit'])

const activeStep = ref("2")
const patientDataBasicForm = ref(null)
const insuranceForm = ref(null)


const nextStep = () => {

    if (activeStep.value === "1" && patientDataBasicForm.value.validateForm()) {
        activeStep.value = "2"
    } else if (activeStep.value === "2" && insuranceForm.value.validateForm()) {
        console.log("OK");

        activeStep.value = "2"
    } else {

    }

}

</script>