<template>
    <div class="cc-order-main-cont">
        <cui-card>
            <cui-table :data="ordersFull">
                <template #header>
                    <h2> {{ $lang.order }} {{ $lang.list }} </h2>
                </template>
                <template #thead>
                    <cui-th>Date</cui-th>
                    <cui-th>Patient</cui-th>
                    <cui-th>Type</cui-th>
                </template>
                <template v-slot:row=" { row } ">
                    <td> {{ row.date }} </td>
                    <td> {{ row.patientId }} </td>
                    <td> {{ row.procedure?.cat?.label }} </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card class="right-card">Editor</cui-card>
        <cui-card>
            <cui-table :data="ordersFull">
                <template #header>
                    <h2> {{ $lang.procedureCategoryLabels.exam }} {{ $lang.list }} </h2>
                </template>
                <template #thead>
                    <cui-th>Date</cui-th>
                    <cui-th>Patient</cui-th>
                    <cui-th>Type</cui-th>
                </template>
                <template v-slot:row=" { row } ">
                    <td> {{ row.date }} </td>
                    <td> {{ row.patientId }} </td>
                    <td> {{ row.procedure?.cat?.label }} </td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            ordersFull: []
        }
    },
    created() {
        this.updateData()
    },
    methods: {
        async updateData() {
            this.ordersFull = await this.$dataService().get.orders() || [];
        }
    },
    
}
</script>

<style scoped>
    .cc-order-main-cont {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 50%;
    }
    .right-card {
        grid-row: 1 / 3;
        grid-column: 2;
    }
</style>