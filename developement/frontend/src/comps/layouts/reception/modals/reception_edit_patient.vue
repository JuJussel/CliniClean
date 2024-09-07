<template>
    <div>
        <div class="flex flex-col gap-1 mb-4">
            <label for="name">{{$t('name')}}</label>
            <InputText id="name" v-model="patientData.name" />
        </div>
        <div class="flex flex-col gap-1 mb-4">
            <label for="name">{{$t('nameKana')}}</label>
            <InputText id="name" v-model="patientData.nameKana" />
        </div>
        <div class="flex flex-col gap-1 mb-4">
            <label for="birthDate">{{$t('birthdate')}}</label>
            <DatePicker id="birthDate" v-model="patientData.birthDate" showIcon/>
        </div>
        <div class="flex flex-col gap-1 mb-4">
            <label for="gender">{{$t('gender')}}</label>
            <div class="flex gap-3">
                <div class="flex items-center">
                    <RadioButton v-model="patientData.gender" inputId="gender1" name="gender" value="1" />
                    <label for="gender1" class="ml-2">{{ $t('male') }}</label>
                </div>
                <div class="flex items-center">
                    <RadioButton v-model="patientData.gender" inputId="gender2" name="gender" value="2" />
                    <label for="gender2" class="ml-2">{{ $t('female') }}</label>
                </div>
                <div class="flex items-center">
                    <RadioButton v-model="patientData.gender" inputId="gender3" name="gender" value="3" />
                    <label for="gender3" class="ml-2">{{ $t('other') }}</label>
                </div>
            </div>


        </div>
        <div class="flex flex-col gap-1 mb-4">
            <label for="name">{{$t('occupation')}}</label>
            <InputText id="name" v-model="patientData.name" />
        </div>
    </div>


    <div class="flex justify-end gap-2">
        <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')" raised></Button>
        <Button type="button" :label="$t('save')" @click="commit()" raised></Button>
    </div>

</template>

<script setup>
import DatePicker from 'primevue/datepicker';

const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])

const patientData = ref({
    editSexOrBirthdate: false,
    id: null,
    name: "",
    nameKana: "",
    birthdate: "",
    gender: 1,
    householderName: "",
    relation: "本人",
    occupation: "",
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