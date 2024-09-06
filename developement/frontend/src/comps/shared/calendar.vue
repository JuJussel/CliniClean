<template>
    <div class="h-full p-2">
        <div class="flex gap-2 -mb-7">
            <div>
                <InputGroup>
                    <Button :label="$t('prev')" icon="pi pi-angle-left" severity="secondary" @click="navigateView(1)" />
                    <Button :label="$t('today')" severity="secondary" @click="navigateView(2)" />
                    <Button :label="$t('next')" icon="pi pi-angle-right" iconPos="right" severity="secondary"
                        @click="navigateView(3)" />
                </InputGroup>
            </div>
            <div>
                <InputGroup>
                    <Button :label="$t('day')" severity="secondary" @click="changeView('timeGridDay')" />
                    <Button :label="$t('week')" severity="secondary" @click="changeView('timeGridWeek')" />
                    <Button :label="$t('month')" severity="secondary" @click="changeView('dayGridMonth')" />
                </InputGroup>
            </div>
        </div>
        <FullCalendar ref='fullCalendar' :options="calendarOptions" />
    </div>
</template>

<script setup>

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "dayjs"
import useApi from "@/composables/apiComposable.js"

const emit = defineEmits(['selectDate'])

const fullCalendar = ref(null)
const eventsLoading = ref(false)
let calApi = ref(null)

onMounted(() => {
    calApi = fullCalendar.value.getApi();
    setTimeout(function () {
        calApi.render();
    }, 350)
})

const refetchEvents = () => {
    // this.cal.refetchEvents();
}

const selectDate = (date) => {
    emit('selectDate', date)
}

const eventClick = (data) => {
    emit('eventSelect', data)
}

const navigateView = (action) => {
    if (action === 1) {
        calApi.prev();
    } else if (action === 2) {
        calApi.today();
    } else if (action === 3) {
        calApi.next();
    }
}

const changeView = (view) => {
    calApi.changeView(view)
}

const getEvents = async (i, successCallback) => {
    
    eventsLoading.value = true
    const range = 'start=' + dayjs(i.startStr).$d + '&end=' + dayjs(i.endStr).$d;

    let events = await useApi.get("encounters/range?" + range)
    events = events.filter((item) => item.status === 0)
    events = events.map(function (event) {
            return {
                id: event.id,
                title: event.patient.name,
                start: event.date,
                end: event.shinsatu_end,
                meta: event,
            };
        });        
    eventsLoading.value = false
    successCallback(events)
}

const calendarOptions = reactive({
    headerToolbar: {
        left: "",
        center: "",
        right: "title",
    },
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    firstDay: 1,
    displayEventTime: false,
    fixedWeekCount: false,
    navLinks: true,
    height: "100%",
    slotMinTime: "09:00:00",
    slotMaxTime: "20:00:00",
    allDaySlot: false,
    editable: false,
    locale: "ja",
    selectable: true,
    select: selectDate,
    eventClick: eventClick,
    businessHours: [
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "09:00",
            endTime: "12:00",
        },
        {
            daysOfWeek: [1, 2, 3, 5],
            startTime: "16:00",
            endTime: "20:00",
        },
        { daysOfWeek: [6], startTime: "09:00", endTime: "12:00" },
    ],
    navLinkDayClick: "timeGridDay",
    eventSources: [
        {
            events: getEvents,
            color: "rgb(44, 62, 80)",
        },
    ],

})

</script>
