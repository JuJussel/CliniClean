<template>
    <div style="height: 100%; overflow: hidden">
        <div class="cal-header">
            <cui-button-group @change="changeView">
                <cui-button-group-item :label="$lang.prev" :value="1"></cui-button-group-item>
                <cui-button-group-item :label="$lang.today" :value="2"></cui-button-group-item>
                <cui-button-group-item :label="$lang.next" :value="3"></cui-button-group-item>
            </cui-button-group>
            <cui-button-group @change="changeView">
                <cui-button-group-item :label="$lang.day" value="timeGridDay"></cui-button-group-item>
                <cui-button-group-item :label="$lang.week" value="timeGridWeek"></cui-button-group-item>
                <cui-button-group-item :label="$lang.month" value="dayGridMonth"></cui-button-group-item>
            </cui-button-group>
        </div>
        <div ref='calendar' style="margin-top: -59px"></div>
    </div>

</template>

<script>
import {Calendar} from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
    props: {
        config: {
            default: null
        }
    },
    mounted() {
        let calEl = this.$refs.calendar
        let calendar = new Calendar(calEl, this.options);
        calendar.render()
        this.cal = calendar
    },
    created() {
        if(this.config) {
            this.options = Object.assign(this.options, this.config)
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
                initialView: 'dayGridMonth',
                plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
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
                selectable: true,
                select: this.selectDate,
                eventClick: this.eventClick,
                businessHours: [
                    { daysOfWeek: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "12:00" },
                    { daysOfWeek: [1, 2, 3, 5], startTime: "16:00", endTime: "20:00" },
                    { daysOfWeek: [6], startTime: "09:00", endTime: "12:00" },
                ],
                navLinkDayClick: 'timeGridDay',
                eventSources: [
                    {
                        events: this.getEvents,
                        color: 'rgb(44, 62, 80)'
                    }
                ]
            }
        }
    },
    methods: {
        refetchEvents() {
            this.cal.refetchEvents()
        },
        selectDate(date) {
            this.$emit('selectDate', date)
        },
        eventClick(data) {
            this.$emit('eventClick', data)
        },
        changeView(view) {
            if (view === 1) {
                this.cal.prev()           
            } else if (view === 2) {
                this.cal.today()
            } else if (view === 3) {
                this.cal.next()   
            } else {
                this.cal.changeView(view)
            }
        },
        getEvents(i, successCallback) {

            let start =this.$moment(i.start.valueOf()).format("YYYY-M-D HH:mm:ss")
            let end =this.$moment(i.end.valueOf()).format("YYYY-M-D HH:mm:ss")
            let range = {start: start, end: end}
            this.$api.encounters.get.range(range)
            .then(result => {
                let events = result
                .filter(item => item.status === 0)
                .map(function(event) {
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
    height: 55px;
    padding: 10px;
 }
 .cal-header .fc-toolbar-title {
     margin-left: 20px!important
 }
</style>

<style>
    .fc-toolbar-chunk {
        margin-left: 20px!important
    }
    .fc .fc-toolbar.fc-header-toolbar {
        margin-bottom: 1.1em!important
    }
</style>