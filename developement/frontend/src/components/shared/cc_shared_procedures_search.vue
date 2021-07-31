<template>
    <div>
        <cui-input :placeholder="$lang.searchProcedure" icon="fas fa-search" style="margin: 20px"></cui-input>
        <cui-table></cui-table>
    </div>
</template>

<script>
export default {
    props: {
        category: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            loading: false,
            results: [],
            search: ''
        }
    },
    created() {
        this.getFavourites()
    },
    methods: {
        async searchProcedures() {
            this.loading = true;
            this.results = await this.$dataService().get.lists.procedures.search(this.search);
            this.loading = false;
        },
        async getFavourites() {
            this.loading = true;
            this.results = await this.$dataService().get.lists.procedures.favourites(this.category);
            this.loading = false;
        }
    }
}
</script>