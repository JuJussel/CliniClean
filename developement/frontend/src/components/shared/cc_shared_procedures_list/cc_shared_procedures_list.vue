<template>
    <div>
        <cui-table :data="procedures">
            <template v-slot:row="{ row }">
                <td style="width: 20px">
                    <i :class="row.cat.icon"></i>
                </td>
                <td> 
                    <b>{{ row.name }}</b>
                    <i v-if="row.varData" class="fas fa-clipboard-list"></i>
                </td>
                <td style="width: 60px">
                    <div class="cc-shared-procedures-list-row-buttons" @click.stop="">
                        <cui-button
                            icon="fas fa-shopping-basket"
                            :dark="row.order"
                            :white="!row.order"
                            v-bind:class="{visibleOverride: row.order}"
                            @click="toggleOrder(row)"
                        />
                        <cui-button
                            icon="fas fa-yen-sign"
                            white
                        />
                        <cui-button
                            icon="far fa-trash-alt"
                            danger
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
                        @update="item => expand.varData = item"
                        v-if="expand.cat.code !== '40' || expand.cat.code !== '50'"
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
        <cui-modal :visible="confirmOrderDelete" @close="confirmOrderDelete = false">
            <cui-card style="width: 250px; height: 180px">
                <template #header> {{ $lang.confirm }} </template>
                <h4> {{ $lang.confirmOrderDelete }} </h4>
                <div style="display: flex; justify-content: flex-end">
                    <cui-button plain :label="$lang.cancel" @click="confirmOrderDelete = false"/>
                    <cui-button danger :label="$lang.delete" @click="deleteOrder"/>
                </div>
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import exam from "./cc_shared_procedure_exam.vue"
import shot from "./cc_shared_procedure_shot.vue"
import perscription from "./cc_shared_procedure_perscription.vue"

export default {
    components: {
        'exam': exam,
        'shot': shot,
        'perVac': shot,
        'perscription': perscription
    },
    emits: ['remove'],
    props: {
        procedures: {
            default: null,
            type: Array
        },
        encounter: {
            default: null
        }
    },
    data() {
        return {
            confirmOrderDelete: false,
            orderBuffer: null
        }
    },
    methods: {
        removeProcedure(procedure) {
            this.$emit('remove', procedure._index)
        },
        async toggleOrder(item) {
            if (item.order) {
                this.orderBuffer = item;
                this.confirmOrderDelete = true;
            } else {
                let requestData = {
                    encounterId: this.encounter._id,
                    patientId: this.encounter.patient._id,
                    procedure: item,
                    requester: this.$store.getters.user.id
                }
                let order = await this.$dataService().post.orders(requestData);
                item.order = order._id
            }
        },
        async deleteOrder() {
            await this.$dataService().delete.orders(this.orderBuffer.order);
            this.orderBuffer.order = null;
            this.orderBuffer = null;
            this.confirmOrderDelete = false;
        }
    }
}
</script>

<style>
    .cui-table tbody tr:not(.selected, .expanded, .noHover):hover
    .cc-shared-procedures-list-row-buttons .cui-button-wrapper {
        opacity: 1;
    }
    .cc-shared-procedures-list-row-buttons {
        transition: all .2s ease;
        display: flex
    }
    .cc-shared-procedures-list-row-buttons .cui-button-wrapper {
        opacity: 0;
    }
    .cc-shared-procedures-list-row-buttons .cui-button {
        margin: 0 5px!important
    }
    .cc-shared-procedures-list-row-buttons .visibleOverride {
        opacity: 1!important;
    }
</style>