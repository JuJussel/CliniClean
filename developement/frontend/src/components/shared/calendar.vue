<template>
    <div style="height: 100%">
        <div class="cal-header">
            <vs-button-group>
                <vs-button @click="$refs.calendar.getApi().prev()" shadow icon>
                    <i class="fas fa-angle-left"></i>前
                </vs-button>
                <vs-button @click="$refs.calendar.getApi().today()" shadow icon>今日</vs-button>
                <vs-button @click="$refs.calendar.getApi().next()" shadow icon>
                    次<i class="fas fa-angle-right"></i>
                </vs-button>
            </vs-button-group>
            <vs-button-group>
                <vs-button @click="$refs.calendar.getApi().changeView('timeGridDay')" shadow>日</vs-button>
                <vs-button @click="$refs.calendar.getApi().changeView('timeGridWeek')" shadow>週</vs-button>
                <vs-button @click="$refs.calendar.getApi().changeView('dayGridMonth')" shadow>月</vs-button>
            </vs-button-group>
        </div>
        <FullCalendar @event-selected="eventClick" ref='calendar' :options="options" style="margin-top: -59px"></FullCalendar>
    </div>

</template>

<script>

import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timegrid from '@fullcalendar/timegrid'

export default {
    props: {
        config: {
            default: null
        }
    },
    data() {
        return {
            view: "",
            options: {
                headerToolbar: {
                    left: "title",
                    center: "",
                    right: "",
                },
                initialView: 'dayGridMonth',
                plugins: [ dayGridPlugin, interactionPlugin, timegrid ],
                firstDay: 1,
                displayEventTime: false,
                fixedWeekCount: false,
                navLinks: true,
                height: '100%',
                slotMinTime: "09:00:00",
                slotMaxTime: "20:00:00",
                allDaySlot: false,
                editable: false,
                locale: "ja",
                businessHours: [
                    { daysOfWeek: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "12:00" },
                    { daysOfWeek: [1, 2, 3, 5], startTime: "16:00", endTime: "20:00" },
                    { daysOfWeek: [6], startTime: "09:00", endTime: "12:00" },
                ],
                eventSources: [
                    {
                        events: this.getEvents,
                        color: 'rgb(44, 62, 80)'
                    }
                ]
            }
        }
    },
    created() {
        if(this.config) {
            this.options = Object.assign(this.options, this.config)
        }
    },
    methods: {
        changeDate(mode) {
            this.$refs.calendar.fireMethod(mode)
        },
        eventClick(item, jsEvent, view) {
            this.$emit("eventClick", [item, jsEvent, view])
        },
        refresh() {
            this.$refs.calendar.$emit('refetch-events')
        },
        getEvents(i, successCallback) {

            let start =this.$moment(i.start.valueOf()).format("YYYY-M-D HH:mm:ss")
            let end =this.$moment(i.end.valueOf()).format("YYYY-M-D HH:mm:ss")
            let range = {start: start, end: end}
            this.$get('encounters', {range: range})
            .then(result => {
                let events = result.data.map(function(event) {
                return {
                    id: event.id,
                    title: event.name,
                    start: event.date,
                    end: event.shinsatu_end,
                    meta: event
                }
                })
                successCallback(events)
            })
            .catch(result => {
                this.$apiError(result)
            })

        }
    },
    watch: {
        view() {
            this.$refs.calendar.fireMethod('changeView', this.view)
        },
        height() {
            this.$refs.calendar.fireMethod('updateSize')
        }
    }
}
</script>

<style scoped>
 .cal-header {
    margin-bottom: -20px;
    display: flex;
    justify-content: flex-end;
    background-color: #f4f7f8;
    border-radius: 20px 20px 0 0;
    height: 55px;
    padding: 10px;
 }
</style>
