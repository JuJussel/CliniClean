<template>

    <Stepper :value="activeStep" linear>
        <StepList>
            <Step value="1"> {{ $t('patientInfo') }}</Step>
            <Step value="2"> {{ $t('insurance') }}</Step>
            <Step value="3"> {{ $t('confirm') }}</Step>
        </StepList>
        <StepPanels class="pb-0!">
            <StepPanel v-slot="{ activateCallback }" value="1">
                <div class="grid grid-cols-3 gap-4 pb-4">
                    <Fieldset :legend="$t('basic')">
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('name') }}</label>
                            <InputText id="name" v-model="patientData.name" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('nameKana') }}</label>
                            <InputText id="name" v-model="patientData.nameKana" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="birthDate">{{ $t('birthdate') }}</label>
                            <DatePicker id="birthDate" v-model="patientData.birthDate" :dateFormat="locale.dateFormat"
                                showIcon />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="gender">{{ $t('gender') }}</label>
                            <div class="flex gap-3 h-[34px]">
                                <div class="flex items-center">
                                    <RadioButton v-model="patientData.gender" inputId="gender1" name="gender"
                                        value="1" />
                                    <label for="gender1" class="ml-2">{{ $t('male') }}</label>
                                </div>
                                <div class="flex items-center">
                                    <RadioButton v-model="patientData.gender" inputId="gender2" name="gender"
                                        value="2" />
                                    <label for="gender2" class="ml-2">{{ $t('female') }}</label>
                                </div>
                                <div class="flex items-center">
                                    <RadioButton v-model="patientData.gender" inputId="gender3" name="gender"
                                        value="3" />
                                    <label for="gender3" class="ml-2">{{ $t('other') }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1 mb-4 ">
                            <label>{{ $t('occupation') }}</label>
                            <Select v-model="patientData.occupation" :options="listStore.listData.occupations" />
                        </div>
                    </Fieldset>
                    <Fieldset :legend="$t('contactInfo')">
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="zip">{{ $t('zipCode') }}</label>
                            <InputText id="zip" v-model="patientData.address.zip" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="addr">{{ $t('address') }}</label>
                            <InputText id="addr" v-model="patientData.address.addr" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="phone">{{ $t('telephone') }}</label>
                            <InputText id="phone" v-model="patientData.phone" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('mailAddress') }}</label>
                            <InputText id="name" v-model="patientData.mail" />
                        </div>
                        <div class=" mb-4">
                            <div class="grid grid-cols-2 gap-2">
                                <div class="flex flex-col gap-1">
                                    <label for="name">{{ $t('householder') }}</label>
                                    <InputText id="name" v-model="patientData.householderName" />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <label for="name">{{ $t('relation') }}</label>
                                    <Select v-model="patientData.relation" :options="listStore.listData.relations"
                                        optionLabel="name" />
                                </div>
                            </div>
                        </div>
                    </Fieldset>
                    <Fieldset :legend="$t('workOrSchool')">
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('workOrSchoolName') }}</label>
                            <InputText id="name" v-model="patientData.company.name" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('zipCode') }}</label>
                            <InputText id="name" v-model="patientData.company.zip" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('address') }}</label>
                            <InputText id="name" v-model="patientData.company.addr" />
                        </div>
                        <div class="flex flex-col gap-1 mb-4">
                            <label for="name">{{ $t('telephone') }}</label>
                            <InputText id="name" v-model="patientData.company.phone" />
                        </div>
                    </Fieldset>
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')"
                        raised></Button>
                    <Button type="button" :label="$t('next')" @click="activeStep = '2'" raised></Button>
                </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="2">
                <div class="flex justify-end gap-2">
                    <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')"
                        raised></Button>
                    <Button type="button" :label="$t('prev')" @click="activeStep = '1'" raised></Button>
                    <Button type="button" :label="$t('next')" @click="activeStep = '3'" raised></Button>
                </div>

            </StepPanel>
        </StepPanels>
    </Stepper>



</template>

<script setup>
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';

import locale from "@/lang/ja.json"


const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])
const listStore = useListStore()

const activeStep = ref("1")
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
})

function commit() {

}
</script>