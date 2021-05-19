<template>
    <div class="cc-reception-main-cont">
        <cui-card class="cc-reception-patient-list" noPadding>
            <cui-table :data="encounters">
                <template #header>
                <h2>{{ $lang.reception }}</h2>
                </template>
                <template #thead>
                    <cui-th sort="name">{{ $lang.name }}</cui-th>
                    <cui-th sort="examType">{{ $lang.examType }}</cui-th>
                    <cui-th sort="status">{{ $lang.status }}</cui-th>
                    <cui-th sort="waitTime">{{ $lang.wait + $lang.time }}</cui-th>
                    <cui-th sort="recTime">{{ $lang.reception + $lang.time }}</cui-th>
                </template>
            </cui-table>
        </cui-card>
        <cui-card class="cc-reception-calendar">
            Calendar
        </cui-card>
        <cui-card>
            Done
        </cui-card>
        <cui-card>
            Doctors
        </cui-card>

    </div>
</template>

<script>
export default {
    name: "ReceptionMainView",
    created() {
        this.$api.encounters.get(1)
    },
    data() {
        return {
            encounters: []
        }
    },
    computed: {
    }
}
</script>

<style scoped>
    .cc-reception-main-cont {
        display: grid;
        grid-template-columns: 50% 25% auto;
        grid-template-rows: 70% 30%;
    }
    .cc-reception-patient-list {
        grid-row: 1 / 3;
        grid-column: 1
    }
    .cc-reception-calendar {
        grid-column: 2 / 4;
    }
</style>