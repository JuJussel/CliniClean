<template>
    <div class="cc-shared-procedures-browser-cont">
        <div class="cc-shared-procedures-browser-buttons">
            <cui-button-group v-model="activeCategory">
                <cui-button-group-item
                    v-for="(cat, index) in filteredProcedureCategories" :key="index"
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
            style="overflow: auto"
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
            return this.categories.filter(item => item.code != 90);
        }
    }
}
</script>

<style>
    .cc-shared-procedures-browser-cont {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
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