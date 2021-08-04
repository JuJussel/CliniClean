<template>
    <div class="cc-shared-procedures-browser-cont">
        <div v-if="!loading.categories" class="cc-shared-procedures-browser-buttons">
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
        this.getCategories()
    },
    data() {
        return {
            loading: {
                categories: true
            },
            categories: [],
            activeCategory: null
        }
    },
    methods: {
        async getCategories() {
            this.loading.categories = true;
            this.categories = await this.$dataService().get.procedures.categories();
            this.activeCategory = this.categories[0].code;
            this.loading.categories = false;
        },
        selectProcedure(item) {
            this.$emit('select', item)
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