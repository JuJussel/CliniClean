<template>
    <div>
        Component Template
    </div>
</template>

<script>
export default {
    data() {
        return {
            localData: null,
            viewData: null,
            workingViewData: null
        }
    },
    created() {
        // this.viewData = this.$store.getters.viewData || null;
        // this.workingViewData = JSON.parse(JSON.stringify(this.$store.getters.viewData));
    },
    methods: {
        commitworkingViewData() {
            this.$store.commit('SET_VIEW_DATA', this.workingViewData)
        }
    }
}
</script>