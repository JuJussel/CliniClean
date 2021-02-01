<template>
    <div style="height: 100%">
        <div class="cal-header">
            <vs-button-group>
                <vs-button @click="changeDate('prev')" shadow icon>
                    <i class="fas fa-angle-left"></i>前
                </vs-button>
                <vs-button @click="changeDate('today')" shadow icon>今日</vs-button>
                <vs-button @click="changeDate('next')" shadow icon>
                    次<i class="fas fa-angle-right"></i>
                </vs-button>
            </vs-button-group>
            <vs-button-group>
                <vs-button @click="view = 'agendaDay'" shadow>日</vs-button>
                <vs-button @click="view = 'agendaWeek'" shadow>週</vs-button>
                <vs-button @click="view = 'month'" shadow>月</vs-button>
            </vs-button-group>
        </div>
        <FullCalendar @event-selected="eventClick" ref='calendar' :options="config" style="margin-top: -59px"></FullCalendar>
    </div>

</template>

<script>
export default {
    props: [
        'config',
    ],
    data() {
        return {
            view: ""
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
