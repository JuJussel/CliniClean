<template>
    <div>
        <Fieldset>
            <template #legend>
                <div class="flex  items-center gap-6">
                    <div>{{ $t('insurance')+$t('register') }}</div>
                    <div class="flex items-center gap-2">
                        <ToggleSwitch id="isPublic" v-model="isPublic" />
                        <label for="isPublic">{{ $t('publicInsurance') }}</label>
                    </div>
                </div>
            </template>
            <div class="grid grid-cols-4 gap-4" v-if="!isPublic">
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceSymbol') }}</label>
                        <span v-if="errors.symbol" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                            id="name-help">{{ errors.symbol }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.symbol" :invalid="errors.symbol ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceNumber') }}</label>
                        <span v-if="errors.number" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                            id="name-help">{{ errors.number }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.number" :invalid="errors.number ? true : false" />
                </div>
                    <div class="flex flex-col gap-1">
                        <label for="name">{{ $t('insuranceInsuredName') }}</label>
                        <InputText id="name" v-model="newInsuranceData.insuredName" />
                    </div>
                    <div class="flex flex-col gap-1 mb-4">
                        <label for="name">{{ $t('relation') }}</label>
                        <Select v-model="newInsuranceData.relation" :options="listStore.listData.relations"
                            optionLabel="name" />
                    </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceProviderNumber') }}</label>
                        <span v-if="errors.providerNumber"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.providerNumber }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.providerNumber"
                        :invalid="errors.providerNumber ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="name">{{ $t('insuranceProviderName') }}</label>
                        <span v-if="errors.providerName"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.providerName }}</span>
                    </div>
                    <InputText id="name" v-model="newInsuranceData.providerName"
                        :invalid="errors.providerName ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="getDate">{{ $t('insuranceGetDate') }}</label>
                        <span v-if="errors.getDate" class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]"
                            id="name-help">{{ errors.getDate }}</span>
                    </div>
                    <DatePicker id="getDate" v-model="newInsuranceData.getDate" :dateFormat="locale.dateFormat" showIcon
                        :invalid="errors.getDate ? true : false" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <div>
                        <label for="validDate">{{ $t('validUntil') }}</label>
                        <span v-if="errors.validDate"
                            class="ml-2 text-xs text-[var(--p-inputtext-invalid-border-color)]" id="name-help">{{
                                errors.validDate }}</span>
                    </div>
                    <DatePicker id="validDate" v-model="newInsuranceData.validDate" :dateFormat="locale.dateFormat"
                        showIcon :invalid="errors.validDate ? true : false" />
                </div>
                <div>
                    <FileUpload :multiple="true" mode="basic" @select="updateFiles" customUpload auto severity="secondary" class="p-button-outlined" />
                    <DataView :value="filesRaw">
                        <template #list="slotProps">
                            <div v-for="(item, index) in slotProps.items" :key="index"> 
                                {{ item[0].name }}</div>
                        </template>
                    </DataView>
                </div>
            </div>
        </Fieldset>
    </div>
</template>

<script setup>
import ToggleSwitch from 'primevue/toggleswitch';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Joi from "joi";
import locale from "@/lang/ja.json"

const listStore = useListStore()

const isPublic = ref(false)
const filesRaw = ref([])
const newInsuranceData = reactive({
    symbol: "",
    number: "",
    insuredName: "",
    relation: listStore.listData.relations[18],
    providerNumber: "",
    providerName: "",
    getDate: "",
    validDate: ""
})
const errors = reactive({
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
})

const updateFiles = (event) => {
    console.log(event.files);
        
    filesRaw.value.push(event.files)
}


</script>