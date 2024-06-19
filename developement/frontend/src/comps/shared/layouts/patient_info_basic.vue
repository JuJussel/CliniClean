<template>
    <Panel>
        <template #header>
            <div class="flex items-center gap-2">
                <Tag severity="success" :value="props.patientData.id"></Tag>
                <span class="font-bold">{{ props.patientData.name }}</span>
            </div>
        </template>
        <ul>
            <li class="flex p-2" v-for="(item, index) in listDataBasic" :key="index">
                <div class="w-24 leading-8">{{ item.title }}</div>
                <tag severity="secondary">{{ item.value }}</tag>
            </li>
        </ul>
    </Panel>
</template>

<script setup>
import parseDate from '@/composables/dateComposable.js'
const { t } = useI18n();

const props = defineProps(['patientData'])
const listDataBasic = [
    { title: t('birthdate'), value: parseDate(props.patientData.birthdate) },
    { title: t('gender'), value: props.patientData.gender == 1 ? t('male') : t('female') },
    { title: t('address'), value: props.patientData.address.zip + " " + props.patientData.address.addr },
    { title: t('occupation'), value: props.patientData.occupation },
    { title: t('workOrSchoolName'), value: props.patientData.workOrSchoolName },
    { title: t('telephone'), value: props.patientData.phone },
    { title: t('mailAddress'), value: props.patientData.mail },
]

</script>