<template>
    <div class="cc-l-orders-main">
        <div>
            <orderList style="height: 100%" />
        </div>
        <cui-card>
            <entry v-if="$store.getters.layoutData.orders?.selectedOrder" />
            <div v-else>{{ $lang.orderChoose }}</div>
        </cui-card>
    </div>
</template>

<script>
import entry from "../parts/cc_p_orders_entry.vue";
import orderList from "../parts/cc_p_orders_list.vue";

export default {
    components: {
        orderList,
        entry,
    },
    created() {
        this.getOrders()
    },
    methods: {
        async getOrders() {
            this.$store.commit('SET_LAYOUT_DATA', ['orders', {ordersFull: 'loading'}])
            let orders = (await this.$dataService().get.orders()) || [];
            this.$store.commit('SET_LAYOUT_DATA', ['orders', {ordersFull: orders}])
        }
    }
};
</script>

<style scoped>
.cc-l-orders-main {
    display: grid;
    grid-template-columns: 50% 50%;
}
</style>