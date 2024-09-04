<template>
    <div class="h-full p-2">
        <div>
            <!-- <cui-button-group @change="changeView">
                <cui-button-group-item
                    :label="$lang.prev"
                    :value="1"
                ></cui-button-group-item>
                <cui-button-group-item
                    :label="$lang.today"
                    :value="2"
                ></cui-button-group-item>
                <cui-button-group-item
                    :label="$lang.next"
                    :value="3"
                ></cui-button-group-item>
            </cui-button-group>
            <cui-button-group @change="changeView">
                <cui-button-group-item
                    :label="$lang.day"
                    value="timeGridDay"
                ></cui-button-group-item>
                <cui-button-group-item
                    :label="$lang.week"
                    value="timeGridWeek"
                ></cui-button-group-item>
                <cui-button-group-item
                    :label="$lang.month"
                    value="dayGridMonth"
                ></cui-button-group-item>
            </cui-button-group> -->
            <ButtonGroup>
                <Button :label="$t('prev')" icon="pi pi-angle-left" />
                <Button :label="$t('today')" />
                <Button :label="$t('next')" icon="pi pi-angle-right" iconPos="right" />
            </ButtonGroup>
            <ButtonGroup>
                <Button label="Save" icon="pi pi-check" />
                <Button label="Delete" icon="pi pi-trash" />
                <Button label="Cancel" icon="pi pi-times" />
            </ButtonGroup>

        </div>
        <div ref="calendar"></div>
    </div>
</template>

<script>
import "@fullcalendar/core/vdom";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
    props: {
        config: {
            default: null,
        },
        reRender: {
            default: null,
            type: Number,
        },
    },
    mounted() {
        let calEl = this.$refs.calendar;
        let calendar = new Calendar(calEl, this.options);
        calendar.render();
        this.cal = calendar;
        if (this.reRender) {
            setTimeout(
                function () {
                    this.cal.render();
                }.bind(this),
                this.reRender
            );
        }
    },
    created() {
        if (this.config) {
            this.options = Object.assign(this.options, this.config);
        }
    },
    data() {
        return {
            view: "",
            cal: null,
            options: {
                headerToolbar: {
                    left: "title",
                    center: "",
                    right: "",
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
                select: this.selectDate,
                eventClick: this.eventClick,
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
                        events: this.getEvents,
                        color: "rgb(44, 62, 80)",
                    },
                ],
            },
        };
    },
    methods: {
        refetchEvents() {
            this.cal.refetchEvents();
        },
        selectDate(date) {
            this.$emit("selectDate", date);
        },
        eventClick(data) {
            this.$emit("eventClick", data);
        },
        changeView(view) {
            if (view === 1) {
                this.cal.prev();
            } else if (view === 2) {
                this.cal.today();
            } else if (view === 3) {
                this.cal.next();
            } else {
                this.cal.changeView(view);
            }
        },
        async getEvents(i, successCallback) {
            console.log(i);
            let start = this.$dayjs(i.start.valueOf()).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            let end = this.$dayjs(i.end.valueOf()).format(
                "YYYY-MM-DD HH:mm:ss"
            );
            let range = "start=" + start + "&end=" + end;
            let events = await this.$api.get("encounters/range?" + range);
            events = events
                .filter((item) => item.status === 0)
                .map(function (event) {
                    return {
                        id: event.id,
                        title: event.patient.name,
                        start: event.date,
                        end: event.shinsatu_end,
                        meta: event,
                    };
                });
            successCallback(events);
        },
    },
    watch: {
        view() {
            this.$refs.calendar.fireMethod("changeView", this.view);
        },
        height() {
            this.$refs.calendar.fireMethod("updateSize");
        },
    },
};
</script>
