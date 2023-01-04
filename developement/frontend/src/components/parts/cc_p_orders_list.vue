<template>
    <div class="cc-order-list-cont">
        <cui-card>
            <cui-table
                :data="ordersFull"
                singleSelect
                @select="selectOrder"
                :loading="ordersFull === 'loading'"
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
                    <td>{{ $parseDate(row.date) }}</td>
                    <td>{{ row.patient.name }}</td>
                    <td>{{ row.patient.id }}</td>
                    <td>{{ parseType(row.procedure?.cat?.label) }}</td>
                    <td>
                        <i v-if="row.locked" class="fas fa-lock" />
                    </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card>
            <cui-table
                :data="examinationOrders"
                singleSelect
                @select="selectExam"
                :loading="ordersFull === 'loading'"
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
                    <td>{{ $parseDate(row.date) }}</td>
                    <td>{{ row.patient.name }}</td>
                    <td>{{ row.patient.id }}</td>
                    <td>{{ parseType(row.procedure?.cat?.label) }}</td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>
export default {
    computed: {
        examinationOrders() {
            if (!this.ordersFull.isArray) {
                return [];
            }
            return this.ordersFull.filter((i) => i.procedure.cat.code === 60);
        },
        ordersFull() {
            return this.$store.getters.layoutData.orders.ordersFull;
        },
    },
    methods: {
        parseType(type) {
            return this.$lang.procedureCategoryLabels[type]
        },
        selectOrder(order) {
            order = JSON.parse(JSON.stringify(order));
            this.$refs.examTable.clearSelection();
            order.row.provider = { name: "inhouse", label: this.$lang.inhouse };
            this.$store.commit("SET_LAYOUT_DATA", [
                "orders",
                { selectedOrder: order },
            ]);
        },
        selectExam(order) {
            order = JSON.parse(JSON.stringify(order));
            this.$refs.orderTable.clearSelection();
            order.row.provider = { name: "inhouse", label: this.$lang.inhouse };
            this.$store.commit("SET_LAYOUT_DATA", [
                "orders",
                { selectedOrder: order },
            ]);
        },
    },
};
</script>

<style scoped>
.cc-order-list-cont {
    display: grid;
    grid-template-rows: 50% 50%;
}
</style>