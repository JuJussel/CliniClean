<template>
    <div class="cc-shared-procedures-browser-cont">
        <div class="cc-shared-procedures-browser-buttons">
            <cui-button-group v-model="activeCategory">
                <cui-button-group-item
                    v-for="(cat, index) in filteredProcedureCategories[0]" :key="index"
                    :label="$lang.procedureCategoryLabels[cat.label]"
                    :value="cat.code"
                    :icon="cat.icon"
                    :index="index"
                />
            </cui-button-group>
            <cui-button-group v-model="activeCategory">
                <cui-button-group-item
                    v-for="(cat, index) in filteredProcedureCategories[1]" :key="index"
                    :label="$lang.procedureCategoryLabels[cat.label]"
                    :value="cat.code"
                    :icon="cat.icon"
                    :index="index"
                />
            </cui-button-group>
        </div>
        <procedures-search 
            v-for="(cat, index) in categories" 
            :key="index" 
            v-show="activeCategory === cat.code" 
            :category="cat"
            style="margin: -10px"
            @select="selectProcedure"
            :favourites="favourites"
        />
    </div>
</template>

<script>

import proceduresSearch from "../shared/cc_shared_procedures_search.vue"

export default {
    components: {
        proceduresSearch
    },
    emits: [
        'select'
    ],
    created() {
        this.activeCategory = this.categories[0].code;
        this.getFavourites()
    },
    data() {
        return {
            categories: this.$store.getters.config.procedureCategories,
            activeCategory: null,
            favourites: []
        }
    },
    methods: {
        async selectProcedure(item) {
            this.$emit('select', item)
            this.favourites = await this.$dataService().put.user.favourites(
                this.$store.getters.user.id,
                item.row
            );
        },
        async getFavourites() {
            this.favourites = await this.$dataService().get.users.favourites(
                this.$store.getters.user.id
            )
        }
    },
    computed: {
        filteredProcedureCategories() {
            const n = 4;
            let arr = this.categories;
            arr = arr.filter(item => item.code != 90);
            arr = new Array(Math.ceil(arr.length / n))
                .fill()
                .map(() => arr.splice(0, n));
            return arr;
        }
    }
}
</script>

<style>
    .cc-shared-procedures-browser-cont {
        display: grid;
        grid-template-rows: 100px calc(100% - 100px);
        height: 100%
    }
    .cc-shared-procedures-browser-buttons {
        margin-bottom: 20px
    }
    .cc-shared-procedures-browser-buttons .cui-button-group {
        margin: 0!important;
    }
    .cc-shared-procedures-browser-buttons .cui-button-group .cui-button-group-item {
        flex-grow: 1;
    }
    .cc-shared-procedures-browser-search {

    }
</style>