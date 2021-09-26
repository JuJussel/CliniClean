<template>
    <div>
        <cui-table :data="diseases.active" style="max-height:610px">
            <template #header>
                <h2> {{ $lang.diseaseName }} {{ $lang.valid }} </h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.diseaseName }} </cui-th>
                <cui-th> {{ $lang.startDate  }} </cui-th>
                <cui-th> {{ $lang.diseaseEndDate }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.Disease_Name }} </td>
                <td> {{ parseDate(row.Disease_StartDate) }} </td>
                <td> {{ parseDate(row.Disease_EndDate) }} </td>
            </template>
        </cui-table>
        <cui-table :data="diseases.closed" style="max-height:610px">
            <template #header>
                <h2> {{ $lang.diseaseName }} {{ $lang.history }} </h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.diseaseName }} </cui-th>
                <cui-th> {{ $lang.startDate  }} </cui-th>
                <cui-th> {{ $lang.diseaseEndDate }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.Disease_Name }} </td>
                <td> {{ parseDate(row.Disease_StartDate) }} </td>
                <td> {{ parseDate(row.Disease_EndDate) }} </td>
            </template>
        </cui-table>    

    </div>
</template>

<script>
export default {
    props: {
        patientData: {
            default: null
        }
    },
    emits: [
        'update'
    ],
    methods: {
        parseDate(date) {
            if(!date) return;
            return this.$dayjs(date, "YYYY-MM-DD").format(
                'YYYY' + this.$lang.dateLocals.yearSeparator +
                'MM' + this.$lang.dateLocals.monthSeparator +
                'DD' + this.$lang.dateLocals.daySeparator
            )
        }
    },
    computed: {
        diseases() {
            return {
                active: this.patientData.diseases?.filter(item => !item.Disease_EndDate) || [],
                closed: this.patientData.diseases?.filter(item => item.Disease_EndDate) || []
            }
        }
    }

}
</script>