<template>
    <div>
        <div v-if="loading.all" class="loader"></div>
        <div style="padding: 10px; display: flex; align-items: center">
            <h2>{{ $lang.order }}</h2>
            <cui-button
                :disabled="isUser || order.procedure.cat.code === 90"
                v-if="orderLocal.locked"
                @click="toggleLock(false)"
                plain
                icon="fas fa-lock"
                :loading="loading.lock"
                style="margin-left: 10px"
            />
            <cui-button
                :disabled="isUser"
                v-else
                @click="toggleLock(true)"
                plain
                icon="fas fa-lock-open"
                :loading="loading.lock"
                style="margin-left: 10px"
            />
            <cui-button
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
            {{ $lang.requester }}: {{ order.requester.nameFull }}
        </div>
        <div v-if="order.procedure.cat.code === 60">
            <div style="display: flex; align-items: baseline; padding: 10px">
                <span style="width: 70px"> {{ $lang.examProvider }} </span>
                <cui-select
                    :data="examProviders"
                    displayValueProp="label"
                    v-model="orderLocal.provider"
                    style="width: 200px; margin-left: 20px"
                ></cui-select>
            </div>
            <exam-Input
                @update="updateLocalOrderVar"
                :item="orderLocal.procedure"
                style="max-width: 600px"
            />
        </div>
        <div v-if="order.procedure.cat.code === 30">
            <shot-input
                @update="updateLocalOrderVar"
                :item="orderLocal.procedure"
            />
        </div>
        <div v-if="order.procedure.cat.code === 90">
            <health-check />
        </div>
        <div v-if="order.procedure.comment">
            <h4 style="margin: 10px">{{ $lang.comment }}</h4>
            <cui-tag style="max-width: 250px; height: auto">
                {{ order.procedure.comment }}
            </cui-tag>
        </div>
        <h4 style="margin: 10px">{{ $lang.comment }} {{ $lang.add }}</h4>
        <cui-textarea
            v-model="comment"
            :disabled="isUser"
            style="width: 250px"
            rows="3"
            cols="30"
        />
    </div>
</template>

<script>
import examInput from "../shared/cc_shared_procedures_list/cc_shared_procedure_exam.vue";
import shotInput from "../shared/cc_shared_procedures_list/cc_shared_procedure_shot.vue";
import healthCheck from "../shared/cc_shared_healt_check.vue" 

export default {
    components: {
        examInput,
        shotInput,
        healthCheck
    },
    props: {
        order: {
            default: null,
        },
    },
    emits: ["update"],
    data() {
        return {
            loading: {
                lock: false,
                all: false,
            },
            orderLocal: JSON.parse(JSON.stringify(this.order)),
            comment: "",
        };
    },
    watch: {
        order() {
            this.orderLocal = JSON.parse(JSON.stringify(this.order));
        },
    },
    computed: {
        procedureIcon() {
            let code = this.order?.procedure.cat.code || null;
            return (
                this.$store.getters.staticLists.procedureCategories.find(
                    (item) => item.code === code
                )?.icon || null
            );
        },
        isUser() {
            if (!this.order.locked) return false;
            return this.order.locked !== this.$store.getters.user.id;
        },
        examProviders() {
            return [{ name: "inhouse", label: this.$lang.inhouse }].concat(
                this.$store.getters.settings.examinationProviders.public
            );
        },
    },
    methods: {
        updateLocalOrderVar(data) {
            this.orderLocal.procedure.var = data;
        },
        async toggleLock(locked) {
            if (this.isUser) return;
            this.loading.lock = true;
            this.orderLocal.locked = locked
                ? this.$store.getters.user.id
                : null;
            await this.$dataService().put.orders(this.orderLocal);
            if (this.orderLocal.procedure.cat.code === 90) {
                let encounter = {
                    id: this.orderLocal.encounterId,
                    status: 3
                }
                await this.$dataService().put.encounters(encounter)
            }
            this.loading.lock = false;
            this.$emit("update", false);
        },
        async submit() {
            if (this.isUser) return;
            this.loading.all = true;
            this.orderLocal.status = 0;
            if (this.comment !== "") {
                let addComment =
                    " " +
                    this.$store.getters.userFullName +
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
                this.$emit("update", true);
            } catch {
                this.loading.all = false;
            }
        },
    },
};
</script>