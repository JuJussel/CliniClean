<template>
    <div class="cc-order-main-cont">
        <cui-card>
            <cui-table
                :data="ordersFull"
                singleSelect
                @select="selectOrder"
                :loading="loading.orders"
                ref="orderTable"
            >
                <template #header>
                    <h2>{{ $lang.order }} {{ $lang.list }}</h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.date }} </cui-th>
                    <cui-th> {{ $lang.patient }} </cui-th>
                    <cui-th> {{ $lang.patientId }} </cui-th>
                    <cui-th> {{ $lang.procedureType }} </cui-th>
                    <cui-th style="width: 50px"></cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td>{{ $parseDate(row.date) }} </td>
                    <td>{{ row.patient.name }} </td>
                    <td>{{ row.patient.id }} </td>
                    <td>{{ row.procedure?.cat?.label }} </td>
                    <td>
                        <i v-if="row.locked" class="fas fa-lock" />
                    </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card class="right-card">
            <entry
                v-if="selectedOrder"
                :order="selectedOrder.row"
                @update="updateData"
            />
            <div v-else> {{ $lang.orderChoose }} </div>
        </cui-card>
        <cui-card>
            <cui-table
                :data="examinationOrders"
                singleSelect
                @select="selectExam"
                :loading="loading.orders"
                ref="examTable"
            >
                <template #header>
                    <h2>
                        {{ $lang.procedureCategoryLabels.exam }}
                        {{ $lang.list }}
                    </h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.date }} </cui-th>
                    <cui-th> {{ $lang.patient }} </cui-th>
                    <cui-th> {{ $lang.patientId }} </cui-th>
                    <cui-th> {{ $lang.procedureType }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td>{{ $parseDate(row.date) }} </td>
                    <td>{{ row.patient.name }} </td>
                    <td>{{ row.patient.id }} </td>
                    <td>{{ row.procedure?.cat?.label }} </td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>
import entry from "./cc_order_entry.vue";

export default {
    components: {
        entry,
    },
    data() {
        return {
            ordersFull: [],
            selectedOrder: null,
            loading: {
                orders: false,
            },
        };
    },
    created() {
        this.updateData();
    },
    computed: {
        examinationOrders() {
            return this.ordersFull.filter(i => i.procedure.cat.code === 60)
        }
    },
    methods: {
        async updateData(reset) {
            let loader = setTimeout(
                function () {
                    this.loading.orders = true;
                }.bind(this),
                500
            );
            if (reset) this.selectedOrder = null;
            this.ordersFull = (await this.$dataService().get.orders()) || [];
            this.loading.orders = false;
            clearTimeout(loader);
        },
        selectOrder(order) {
            this.$refs.examTable.clearSelection();
            order.row.provider = { name: "inhouse", label: this.$lang.inhouse };
            this.selectedOrder = order;
        },
        selectExam(order) {
            this.$refs.orderTable.clearSelection();
            order.row.provider = { name: "inhouse", label: this.$lang.inhouse };
            this.selectedOrder = order;
        }
    },
};
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