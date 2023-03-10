<template>
    <div>
        <cui-table :data="procedures" square>
            <template v-slot:row="{ row }">
                <td
                    style="width: 20px; border-top: 5px solid var(--cui-gray-2)"
                >
                    <i :class="row.cat.icon"></i>
                </td>
                <td style="border-top: 5px solid var(--cui-gray-2)">
                    <b>{{ row.name || row.disease }}</b>
                    <i v-if="row.varData" class="fas fa-clipboard-list"></i>
                </td>
                <td
                    style="width: 60px; border-top: 5px solid var(--cui-gray-2)"
                >
                    <div
                        class="cc-shared-procedures-list-row-buttons"
                        @click.stop=""
                    >
                        <cui-button
                            :disabled="
                                Boolean(row.order?.locked || row.order?.done)
                            "
                            icon="fas fa-shopping-cart"
                            :dark="row.order"
                            :white="!row.order"
                            v-bind:class="{ visibleOverride: row.order }"
                            @click="toggleOrder(row)"
                        />
                        <i
                            v-if="row.order?.done"
                            class="fas fa-check super-hack-check"
                        ></i>
                        <cui-button icon="fas fa-yen-sign" white />
                        <cui-button
                            icon="far fa-trash-alt"
                            danger
                            :disabled="
                                Boolean(row.order?.locked || row.order?.done)
                            "
                            @click="removeProcedure(row)"
                        />
                    </div>
                </td>
            </template>
            <template v-slot:expand="{ expand }">
                <div>
                    <component
                        :is="expand.cat.label"
                        :item="expand"
                        :random="random"
                        @update="(item) => (expand.varData = item)"
                        v-if="
                            expand.cat.code !== '40' || expand.cat.code !== '50'
                        "
                    />
                    <div>
                        <cui-input
                            :label="$lang.comment"
                            v-model="expand.comment"
                        />
                    </div>
                </div>
            </template>
        </cui-table>
        <cui-modal
            :visible="confirmOrderDelete"
            @close="confirmOrderDelete = false"
        >
            <cui-card style="width: 250px; height: 180px">
                <template #header> {{ $lang.confirm }} </template>
                <h4>{{ $lang.confirmOrderDelete }}</h4>
                <div style="display: flex; justify-content: flex-end">
                    <cui-button
                        plain
                        :label="$lang.cancel"
                        @click="confirmOrderDelete = false"
                    />
                    <cui-button
                        danger
                        :label="$lang.delete"
                        @click="deleteOrder"
                    />
                </div>
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

import exam from "./cc_p_procedure_exam.vue";
import shot from "./cc_p_procedure_shot.vue";
import prevVac from "./cc_p_procedure_prevVac.vue";
import perscription from "./cc_p_procedure_perscription.vue";
import healthCheck from "./cc_p_procedure_health_check.vue";

export default {
    components: {
        exam,
        shot,
        prevVac,
        perscription,
        healthCheck,
    },
    emits: ["remove"],
    props: {
        procedures: {
            default: null,
            type: Array,
        },
        encounter: {
            default: null,
        },
        random: {
            default: 1,
        },
    },
    data() {
        return {
            confirmOrderDelete: false,
            orderBuffer: null,
        };
    },
    computed: {
        ...mapStores(useUserStore)
    },
    methods: {
        removeProcedure(procedure) {
            this.$emit("remove", procedure._index);
        },
        async toggleOrder(item) {
            if (item.order) {
                this.orderBuffer = item;
                this.confirmOrderDelete = true;
            } else {
                let requestData = {
                    encounterId: this.encounter._id,
                    patient: this.encounter.patient._id,
                    procedure: item,
                    requester: this.userStore.userData.id,
                };
                let order = await this.$api.post('orders', requestData);
                item.order = { id: order._id, done: false, locked: false };
            }
        },
        async deleteOrder() {
            await this.$api.delete('orders/' + this.orderBuffer.order.id);
            this.orderBuffer.order = null;
            this.orderBuffer = null;
            this.confirmOrderDelete = false;
        },
    },
};
</script>

<style>
.cui-table
    tbody
    tr:not(.selected, .expanded, .noHover):hover
    .cc-shared-procedures-list-row-buttons
    .cui-button-wrapper {
    opacity: 1;
}
.cc-shared-procedures-list-row-buttons {
    transition: all 0.2s ease;
    display: flex;
    position: relative;
}
.cc-shared-procedures-list-row-buttons .cui-button-wrapper {
    opacity: 0;
}
.cc-shared-procedures-list-row-buttons .cui-button {
    margin: 0 5px !important;
}
.cc-shared-procedures-list-row-buttons .visibleOverride {
    opacity: 1 !important;
}
</style>
<style scoped>
.super-hack-check {
    position: absolute;
    margin-left: 27px;
    margin-top: 9px;
    font-size: 13px;
}
</style>