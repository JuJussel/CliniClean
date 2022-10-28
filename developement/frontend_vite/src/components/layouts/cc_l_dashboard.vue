<template>
    <div class="cc-dashboard-main">
        <cui-card no-padding>
            <cui-table
                :data="$store.getters.notifications"
                singleSelect
                @select="showNews"
                ref="orderTable"
            >
                <template #header>
                    <h2> {{ $lang.news }} </h2>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ $parseDate(row.created) }} </td>
                    <td> {{ $lang[row.content.meta.type] }} </td>
                    <td> {{ row.content.meta.order.patient.name }} </td>
                    <td> {{ row.content.meta.order.procedure.name }} </td>
                    <td><cui-button icon="fas fa-times"  class="cui-table-hover-button"/></td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>
export default {
    methods: {
        showNews() {

        }
    }
}
</script>

<style>
    .cc-dashboard-main {
        display: grid;
        grid-template-columns: 33% 33% 34%;
        grid-template-rows: 50% 50%;
    }
</style>