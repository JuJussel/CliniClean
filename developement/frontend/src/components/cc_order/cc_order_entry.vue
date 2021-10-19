<template>
    <div>
        <div style="padding: 10px; display: flex; align-items: center">
            <h2> {{ $lang.order }} </h2>
            <cui-button :disabled="isUser" v-if="orderLocal.locked" @click="toggleLock(false)" plain icon="fas fa-lock" :loading="loading.lock" style="margin-left: 10px" />
            <cui-button :disabled="isUser" v-else @click="toggleLock(true)" plain icon="fas fa-lock-open" :loading="loading.lock" style="margin-left: 10px" />
            <cui-button :disabled="isUser" @click="submit" :label="$lang.finish" primary />
        </div>
        <h2>
            <i :class="procedureIcon" />
            <span style="margin-left: 10px"> {{ orderLocal.procedure.name }} </span>
        </h2>
        <div style="margin-bottom: 20px"> {{ $lang.requester }}: {{ order.requester.nameFull }} </div>
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
            <exam-Input :item="orderLocal.procedure" style="max-width: 600px" />
        </div>
        <div v-if="order.procedure.comment">
            <h4 style="margin: 10px"> {{ $lang.comment }} </h4>
            <cui-tag style="max-width: 250px; height: auto">
                {{ order.procedure.comment }}
            </cui-tag>
        </div>
        <h4 style="margin: 10px"> {{ $lang.comment }} {{ $lang.add }}</h4>
        <cui-textarea :disabled="isUser" style="width: 250px" rows="3" cols="30"/>
    </div>
</template>

<script>

import examInput from '../shared/cc_shared_procedures_list/cc_shared_procedure_exam.vue'

export default {
    components: {
        examInput
    },
    props: {
        order: {
            default: null
        }
    },
    emits: [
        'update'
    ],
    data() {
        return {
            loading: {
                lock: false,
                all: false
            },
            orderLocal: JSON.parse(JSON.stringify(this.order))
        }
    },
    watch: {
        order() {
            this.orderLocal = JSON.parse(JSON.stringify(this.order));
        }
    },
    computed: {
        procedureIcon() {
            let code = this.order?.procedure.cat.code || null;
            return this.$store.getters.config.procedureCategories.find(item => item.code === code)?.icon || null;
        },
        isUser() {
            if (!this.order.locked) return false;
            return this.order.locked !== this.$store.getters.user.id;
        },
        examProviders() {
            return [{name: "inhouse", label: this.$lang.inhouse}].concat(this.$store.getters.settings.examinationProviders.public)
        }
    },
    methods: {
        async toggleLock(locked) {
            if(this.isUser) return;
            this.loading.lock = true;
            this.orderLocal.locked = locked ? this.$store.getters.user.id : null;
            await this.$dataService().put.orders(this.orderLocal);
            this.loading.lock = false;
            this.$emit('update');
        },
        async submit() {
            if(this.isUser) return;
            this.loading.all = true;
            this.orderLocal.status = 0;
            await this.$dataService().put.orders(this.orderLocal);
            this.loading.all = false;
            this.$emit('update');
        }
    }
}
</script>