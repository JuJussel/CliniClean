<template>
    <div>
        <div v-if="loading.all" class="loader"></div>
        <div>
            <div style="padding: 10px; display: flex; align-items: center">
                <h2>{{ $lang.order }}</h2>
                <cui-button
                    :disabled="
                        isUser ||
                        orderLocal.procedure.cat.code === 90 ||
                        !$aclService(2)
                    "
                    v-if="orderLocal?.locked"
                    @click="toggleLock(false)"
                    plain
                    icon="fas fa-lock"
                    :loading="loading.lock"
                    style="margin-left: 10px"
                />
                <cui-button
                    :disabled="isUser || !$aclService(2)"
                    v-else
                    @click="toggleLock(true)"
                    plain
                    icon="fas fa-lock-open"
                    :loading="loading.lock"
                    style="margin-left: 10px"
                />
                <cui-button
                    v-if="$aclService(2)"
                    :disabled="isUser"
                    @click="submit"
                    :label="$lang.finish"
                    primary
                />
            </div>
            <h2>
                <i :class="procedureIcon" />
                <span style="margin-left: 10px">
                    {{ orderLocal.procedure.name }}
                </span>
            </h2>
            <div style="margin-bottom: 20px">
                {{ $lang.requester }}: {{ orderLocal.requester.nameFull }}
            </div>
        </div>
        <div>
            <div v-if="orderLocal.procedure.cat.code === 60">
                <div
                    style="display: flex; align-items: baseline; padding: 10px"
                >
                    <span style="width: 70px"> {{ $lang.examProvider }} </span>
                    <cui-select
                        :data="examProviders"
                        displayValueProp="label"
                        v-model="orderLocal.provider"
                        style="width: 200px; margin-left: 20px"
                        :disabled="!$aclService(2)"
                    ></cui-select>
                </div>
                <examInput
                    @update="updateLocalOrderVar"
                    :item="orderLocal.procedure"
                    style="max-width: 600px"
                />
            </div>
            <div v-if="orderLocal.procedure.cat.code === 30">
                <shot-input
                    @update="updateLocalOrderVar"
                    :item="orderLocal.procedure"
                />
            </div>
            <div
                v-if="orderLocal.procedure.cat.code === 90"
                style="height: 50%"
            >
                <health-check ref="healthCheck" />
            </div>
            <div v-if="orderLocal.procedure.comment">
                <h4 style="margin: 10px">{{ $lang.comment }}</h4>
                <cui-tag style="max-width: 250px; height: auto">
                    {{ orderLocal.procedure.comment }}
                </cui-tag>
            </div>
            <h4 style="margin: 10px">{{ $lang.comment }} {{ $lang.add }}</h4>
            <cui-textarea
                v-model="comment"
                :disabled="isUser || !$aclService(2)"
                style="width: 250px"
                rows="3"
                cols="30"
            />
        </div>
    </div>
</template>

<script>

import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

import examInput from "../parts/cc_p_karte/cc_p_procedures_list/cc_p_procedure_exam.vue";
import shotInput from "../parts/cc_p_karte/cc_p_procedures_list/cc_p_procedure_shot.vue";
import healthCheck from "../parts/cc_p_health_check";

export default {
    components: {
        examInput,
        shotInput,
        healthCheck,
    },
    emits: ["update"],
    beforeUnmount() {
        this.$store.commit("SET_LAYOUT_DATA", [
            "orders",
            { selectedOrder: null },
        ]);
    },
    data() {
        return {
            loading: {
                lock: false,
                all: false,
            },
            comment: "",
        };
    },
    watch: {},
    computed: {
        ...mapStores(useUserStore),
        orderLocal() {
            return this.$store.getters.layoutData.orders.selectedOrder?.row;
        },
        procedureIcon() {
            let code = this.orderLocal?.procedure.cat.code || null;
            return (
                this.$store.getters.staticLists.procedureCategories.find(
                    (item) => item.code === code
                )?.icon || null
            );
        },
        isUser() {
            if (!this.orderLocal?.locked) return false;
            return this.orderLocal.locked !== this.userStore.userData.id;
        },
        examProviders() {
            return [{ name: "inhouse", label: this.$lang.inhouse }].concat(
                this.$store.getters.settings.examinationProviders.public
            );
        },
    },
    methods: {
        updateLocalOrderVar(data) {
            this.orderLocal.procedure.varData = data;
        },
        async toggleLock(locked) {
            if (this.isUser) return;
            this.loading.lock = true;
            this.orderLocal.locked = locked
                ? this.userStore.userData.id
                : null;
            await this.$dataService().put.orders(this.orderLocal);
            if (this.orderLocal.procedure.cat.code === 90) {
                let encounter = {
                    id: this.orderLocal.encounterId,
                    status: 3,
                };
                await this.$dataService().put.encounters(encounter);
            }
            this.loading.lock = false;
            this.updateStoreOrders();
        },
        async submit() {
            if (this.isUser) return;
            this.loading.all = true;
            // If Healtcheck
            if (this.orderLocal.procedure.cat.code == 90) {
                this.orderLocal.procedure.varData =
                    await this.$refs.healthCheck.getData();
                let schemaData = {
                    file: this.orderLocal.procedure.varData.xRay.schema,
                    meta: {
                        source: "schema",
                        patient: this.orderLocal.patient.id,
                        encounter: this.orderLocal.encounterId,
                    },
                };
                this.orderLocal.procedure.varData.xRay.schema =
                    await this.$dataService().post.uploads.single(schemaData);
            }

            this.orderLocal.status = 0;
            if (this.comment !== "") {
                let addComment =
                    " " +
                    this.userStore.fullName +
                    "：" +
                    this.comment;
                let existingComment = this.orderLocal.procedure.comment || "";
                this.orderLocal.procedure.comment =
                    existingComment + addComment;
            }
            try {
                await this.$dataService().put.orders(this.orderLocal);
                this.$cui.notification({
                    text: this.$lang.saved,
                    duration: 3000,
                    color: "primary",
                });
                this.loading.all = false;
                this.updateStoreOrders();
                this.$store.commit("SET_LAYOUT_DATA", [
                    "orders",
                    { selectedOrder: null },
                ]);
            } catch {
                this.loading.all = false;
            }
            return;
        },
        async updateStoreOrders() {
            let orders = (await this.$dataService().get.orders()) || [];
            this.$store.commit("SET_LAYOUT_DATA", [
                "orders",
                { ordersFull: orders },
            ]);
        },
    },
};
</script>