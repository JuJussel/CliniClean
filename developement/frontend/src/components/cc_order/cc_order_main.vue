<template>
    <div class="cc-order-main-cont">
        <cui-card>
            <cui-table :data="ordersFull" singleSelect @select="selectOrder" :loading="loading.orders">
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
        <cui-card class="right-card">
            <template #header>
                <h2> Entry </h2>
            </template>

            <entry v-if="selectedOrder" :order="selectedOrder.row" />
        </cui-card>
        <cui-card>
            <cui-table :data="ordersFull" singleSelect :loading="loading.orders">
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

import entry from "./cc_order_entry.vue"

export default {
    components: {
        entry
    },
    data() {
        return {
            ordersFull: [],
            selectedOrder: null,
            loading: {
                orders: false
            }
        }
    },
    created() {
        this.updateData()
    },
    methods: {
        async updateData() {
            this.loading.orders = true;
            this.ordersFull = await this.$dataService().get.orders() || [];
            this.loading.orders = false;
        },
        selectOrder(order) {
            this.selectedOrder = order;
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