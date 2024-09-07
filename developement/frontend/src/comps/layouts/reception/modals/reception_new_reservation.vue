<template>
    <BlockUI :blocked="uiLoading">
        <div class="flex gap-16 mb-8">
            <div>
                <Tag :value="patient.name" severity="secondary" class="h-8 mb-4" />
                <div class="flex flex-col gap-1 mb-4 ">
                    <label>{{ $t('encounterType') }}</label>
                    <Select v-model="reservationData.encounterType" :options="listStore.listData.encounterTypes"
                        optionLabel="name" placeholder="Select a City" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <label>{{ $t('date') }}</label>
                    <DatePicker v-model="reservationData.date" showIcon manualInput fluid
                        :dateFormat="locale.dateFormat" />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <label>{{ $t('time') }}</label>
                    <DatePicker v-model="reservationData.time" timeOnly manualInput hourFormat="24" :stepMinute="30"
                        fluid />
                </div>
                <div class="flex flex-col gap-1 mb-4">
                    <label>{{ $t('memo') }}</label>
                    <Textarea v-model="reservationData.note" rows="5" cols="30" />
                </div>


            </div>

            <div class="grow h-[500px]">
                <Calendar ref="calendar" :reRender="350" @selectDate="selectDate" />
            </div>
        </div>
    </BlockUI>
    <div class="flex justify-end gap-2">
        <Button type="button" :label="$t('cancel')" severity="secondary" @click="$emit('close')" :disabled="uiLoading"
            raised></Button>
        <Button type="button" :label="$t('save')" @click="commit()" :disabled="uiLoading || !inputOK" raised></Button>
    </div>

</template>

<script setup>
import Select from 'primevue/select';
import DatePicker from 'primevue/datepicker';
import Calendar from '../../../shared/calendar.vue'
import dayjs from "dayjs"
import useApi from "@/composables/apiComposable.js"
import locale from "@/lang/ja.json"

const listStore = useListStore()

const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])
const uiLoading = ref(false)
const reservationData = reactive({
    date: null,
    time: null,
    encounterType: ref(listStore.listData.encounterTypes[0]),
    note: ''
})

const selectDate = (i) => {
    reservationData.date = i.start //dayjs(i.start);
    if (!reservationData.date.allDay) {
        reservationData.time = i.start;
    }
}

const inputOK = computed(() => {
    if (
        reservationData.date &&
        reservationData.time
    ) {
        return true;
    }
    return false
})

const commit = async () => {
    uiLoading.value = true
    const postData = {
        patient: props.patient,
        date: dayjs(reservationData.date).format("YYYY-MM-DD"),
        time: dayjs(reservationData.time).format("HH:mm:ss"),
        encounterType: reservationData.encounterType.id,
        note: reservationData.note

    }
    await useApi.post('encounters', postData);
    uiLoading.value = false
    emit('commit')
    emit('close')
}

</script>