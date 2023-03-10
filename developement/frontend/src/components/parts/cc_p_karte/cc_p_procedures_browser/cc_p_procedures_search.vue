<template>
    <div>
        <cui-table 
            v-if="category.code === 31"
            :data="settingStore.settingData.vaccines" 
            style="height: 100%" 
            singleSelect 
            :loading="loading"
            @select="selectItem">
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2> {{ $lang.procedureCategoryLabels[category.label] }} </h2>
                </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.procedureName}} </cui-th>
                <cui-th> {{ $lang.points}} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.disease }} </td>
                <td> {{ row.cost }} </td>
            </template>
        </cui-table>
        <cui-table 
            v-else
            :data="search !== '' ? results : categoryFavourites" 
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

import {useSettingStore} from '@/stores/setting'
import {mapStores} from 'pinia'

export default {
    props: {
        category: {
            type: Object,
            default: null
        },
        favourites: {
            type: Array,
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
    methods: {
        async searchProcedures() {
            if (this.search === '') return;
            this.loading = true;
            if (this.category.code == 25 || this.category.code == 30) {
                this.results = await this.$api.get(
                    'medications/'
                    + this.category.code
                    + '/'
                    + this.search
                )
            }
            else this.results = await this.$api.get(
                'procedures/'
                + this.category.code
                + '/'
                + this.search
            );
            this.loading = false;
        },
        async getFavourites() {
            this.loading = true;
            this.results = await this.$api.get(
                'procedures/'
                + this.category
                + '/favourites'
            );
            this.loading = false;
        },
        selectItem(item) {
            if (!item) return;
            item.row.cat = this.category;
            this.$emit('select', item);
        }
    },
    computed: {
        ...mapStores(useSettingStore),
        categoryFavourites() {
            return this.favourites.filter(item => item.cat.code === this.category.code)                
        }
    }
}
</script>