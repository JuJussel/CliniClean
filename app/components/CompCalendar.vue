<template>
    <div class="h-full p-2">
        <div class="flex gap-2 -mb-7">
            <UFieldGroup>
                <UButton
                    color="neutral"
                    variant="soft"
                    :label="$t('prev')"
                    @click="navigateView(1)"
                />
                <UButton
                    color="neutral"
                    variant="soft"
                    :label="$t('today')"
                    @click="navigateView(2)"
                />
                <UButton
                    color="neutral"
                    variant="soft"
                    :label="$t('next')"
                    @click="navigateView(3)"
                />
            </UFieldGroup>
            <UFieldGroup>
                <UButton
                    color="neutral"
                    variant="soft"
                    :label="$t('day')"
                    @click="changeView('timeGridDay')"
                />
                <UButton
                    color="neutral"
                    variant="soft"
                    :label="$t('week')"
                    @click="changeView('timeGridWeek')"
                />
                <UButton
                    color="neutral"
                    variant="soft"
                    :label="$t('month')"
                    @click="changeView('dayGridMonth')"
                />
            </UFieldGroup>
        </div>
        <FullCalendar
            ref="fullCalendar"
            :options="calendarOptions"
            :events="props.events"
        />
    </div>
</template>

<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayjs from "#build/dayjs.imports.mjs";

const emit = defineEmits(["selectDate"]);
const props = defineProps({
    events: {
        type: Array,
        default: () => [],
    },
});

const fullCalendar = ref(null);
const eventsLoading = ref(false);
let calApi = ref(null);

onMounted(() => {
    calApi = fullCalendar.value.getApi();
    setTimeout(function () {
        calApi.render();
    }, 350);
});

const refetchEvents = () => {
    this.cal.refetchEvents();
};

const selectDate = (date) => {
    emit("selectDate", date);
};

const eventClick = (data) => {
    emit("eventSelect", data);
};

const navigateView = (action) => {
    if (action === 1) {
        calApi.prev();
    } else if (action === 2) {
        calApi.today();
    } else if (action === 3) {
        calApi.next();
    }
};

const changeView = (view) => {
    calApi.changeView(view);
};

const getEvents = async (i, successCallback) => {
    eventsLoading.value = true;
    const start = dayjs(i.startStr).$d;
    const end = dayjs(i.endStr).$d;

    const response = await fetch(
        `/api/encounter/range?start=${start}&end=${end}`,
    );

    eventsLoading.value = false;
    successCallback(await response.json());
};

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
});
</script>
