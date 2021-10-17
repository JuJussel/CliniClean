<template>
    <div>
        <div style="padding: 10px; display: flex; align-items: center">
            <h2> Entry </h2>
            <cui-button :disabled="isUser" v-if="orderLocal.locked" @click="toggleLock(false)" plain icon="fas fa-lock" :loading="loading.lock" style="margin-left: 10px" />
            <cui-button :disabled="isUser" v-else @click="toggleLock(true)" plain icon="fas fa-lock-open" :loading="loading.lock" style="margin-left: 10px" />
            <cui-button :disabled="isUser" @click="submit" :label="$lang.finish" primary />
        </div>
        <h2>
            <i :class="procedureIcon" />
            <span style="margin-left: 10px"> {{ orderLocal.procedure.name }} </span>
        </h2>
        <div>Requester: Name</div>
        <h4 style="margin: 10px">Comment</h4>
        <cui-tag style="max-width: 250px; height: auto">Hellolkcre vieropvrnvvnr oforjfrn rejrenre revjren relrjenferljfnr fournfroufrnfweorjfrjnf oerjf oer foejfn erofn erpojf nerpof</cui-tag>
        <h4 style="margin: 10px">Comment add</h4>
        <cui-textarea :disabled="isUser" style="width: 250px" rows="3" cols="30"/>
    </div>
</template>

<script>
export default {
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
            this.orderLocal = JSON.parse(JSON.stringify(this.order))
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