<template>
    <div>
        <div v-if="!loading.categories" class="cc-shared-procedures-browser-button-cont">
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
        <procedures-search v-for="(cat, index) in categories" :key="index" v-show="activeCategory === cat.code" :category="cat"/>
    </div>
</template>

<script>

import proceduresSearch from "../shared/cc_shared_procedures_search.vue"

export default {
    components: {
        proceduresSearch
    },
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
            this.categories = await this.$dataService().get.lists.procedures.categories();
            this.activeCategory = this.categories[0].code;
            this.loading.categories = false;
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
    .cc-shared-procedures-browser-button-cont .cui-button-group {
        margin: 0!important;
    }
    .cc-shared-procedures-browser-button-cont .cui-button-group .cui-button-group-item {
        flex-grow: 1;
    }
</style>