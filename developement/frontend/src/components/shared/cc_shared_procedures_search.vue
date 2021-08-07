<template>
    <div>
        <cui-table 
            :data="results" 
            style="height: 100%" 
            singleSelect 
            :loading="loading"
            @select="selectItem">
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2> {{ $lang.procedureCategoryLabels[category.label] }} </h2>
                    <cui-input
                        :placeholder="$lang.searchProcedure"
                        icon="fas fa-search"
                        darker
                        v-model="search"
                        @input="searchProcedures"
                        noNote
                        style="margin-left: 20px"
                    />
                </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.procedureName}} </cui-th>
                <cui-th> {{ $lang.points}} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.name }} </td>
                <td> {{ row.cost.split('.')[0] }} </td>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        category: {
            type: Object,
            default: null
        }
    },
    emits: [
        'select'
    ],
    data() {
        return {
            loading: false,
            results: [],
            search: ''
        }
    },
    created() {
        // this.getFavourites()
    },
    methods: {
        async searchProcedures() {
            if (this.search === '') return;
            this.loading = true;
            if (this.category.code == 25 || this.category.code == 30) {
                this.results = await this.$dataService().get.medications.search(this.category.code, this.search);
            }
            else this.results = await this.$dataService().get.procedures.search(this.category.code, this.search);
            this.loading = false;
        },
        async getFavourites() {
            this.loading = true;
            this.results = await this.$dataService().get.procedures.favourites(this.category);
            this.loading = false;
        },
        selectItem(item) {
            item.row.cat = this.category;
            this.$emit('select', item);
        }
    }
}
</script>