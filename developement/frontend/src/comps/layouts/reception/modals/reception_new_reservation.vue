<template>
    <div class="grid grid-cols-2 gap-16">
        <div>
            <div class="flex flex-col gap-1 mb-4">
                <label>{{ $t('encounterType') }}</label>
                <Select v-model="encounterType" :options="listStore.listData.encounterTypes" optionLabel="name" placeholder="Select a City" class="w-full md:w-56" />
            </div>
        </div>
        <div style="height: 500px">
            <Calendar ref="calendar" :reRender="350" @selectDate="selectDate" />
        </div>
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" :label="('cancel')" severity="secondary" @click="$emit('close')" raised></Button>
        <Button type="button" :label="('save')" @click="commit()" raised></Button>
    </div>

</template>

<script setup>
import Select from 'primevue/select';
import Calendar from '../../../shared/calendar.vue'
import dayjs from "dayjs"
import useApi from "@/composables/apiComposable.js"

const listStore = useListStore()

const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])
const date = ref(null)
const time = ref(null)
const encounterType = ref(listStore.listData.encounterTypes[0])
const note = ref('')

const selectDate = (i) => {
    console.log(i);
    date.value = dayjs(i.start).format("YYYY-MM-DD");
    if (!date.allDay) {
        time.value = dayjs(i.start).format("HH:mm:ss");
    }
}
</script>