<template>
    <div>
        <cui-table :data="pendingOrders">
            <template #header>
                <h2>{{ $lang.order }} {{ $lang.pending }}</h2>
                <cui-button
                    icon="fas fa-arrow-up-right-from-square"
                    plain
                />
            </template>
            <template #thead>
                <cui-th> {{ $lang.procedureType }} </cui-th>
                <cui-th>
                    {{ $lang.procedure }}
                </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ parseType(row.procedure?.cat?.label) }} </td>
                <td> {{ row.procedure.name }} </td>
            </template>

        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        pendingOnly: {
            default: false,
            type: Boolean
        }
    },
    methods: {
        parseType(type) {
            return this.$lang.procedureCategoryLabels[type]
        }
    },
    computed: {
        pendingOrders() {
            let orders = this.$store.getters.layoutData.medical.patient.orders || []
            return orders.filter(order => order.status !== 0)
        }
    }
}
</script>