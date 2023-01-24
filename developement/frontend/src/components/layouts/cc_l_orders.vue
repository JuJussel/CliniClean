<template>
    <div class="cc-l-orders-main">
        <div>
            <orderList style="height: 100%" />
        </div>
        <cui-card style="overflow: hidden">
            <entry v-if="orderStore.activeOrder" />
            <div v-else>{{ $lang.orderChoose }}</div>
        </cui-card>
    </div>
</template>

<script>

import { useOrderStore } from "@/stores/order";
import { mapStores } from "pinia";
import entry from "../parts/cc_p_orders_entry.vue";
import orderList from "../parts/cc_p_orders_list.vue";

export default {
    components: {
        orderList,
        entry,
    },
    created() {
        this.getOrders();
    },
    computed: {
        ...mapStores(useOrderStore)
    },
    methods: {
        async getOrders() {
            this.orderStore.loading = true
            let orders = (await this.$dataService().get.orders()) || [];
            this.orderStore.getOrders()
        },
    },
};
</script>

<style scoped>
.cc-l-orders-main {
    display: grid;
    grid-template-columns: 50% 50%;
}
</style>