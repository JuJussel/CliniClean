<template>
    <div class="grid grid-cols-3 gap-4">
        <div>
            <h1 class="mb-2">Select from Karte</h1>
            <div class="h-56">
                <cui-table :data="kartePersc" singleSelect outline @select="selectItem">
                    <template v-slot:row="{ row }">
                        <td>{{ row.name }}</td>
                    </template>
                </cui-table>
            </div>
        </div>
        <div>
            <h1 class="mb-2">Register New</h1>
            <perscSearch class="h-56" :category="perscCat" @select="selectItem" />
        </div>
        <div>
            <h1 class="mb-2">Selection</h1>
            <div>{{ perscription?.name || null }}</div>
            <perscInput v-if="perscription" :item="perscription" @update="(item) => (perscription.varData = item)" />
        </div>
    </div>
</template>

<script>

import { useEncounterStore } from '@/stores/encounter';
import { useListStore } from '@/stores/list';
import { mapStores } from 'pinia';
import perscInput from '../../cc_p_karte/cc_p_procedures_list/cc_p_procedure_perscription.vue'
import perscSearch from '../../cc_p_karte/cc_p_procedures_browser/cc_p_procedures_search.vue'

export default {
    components: {
        perscInput,
        perscSearch
    },
    computed: {
        ...mapStores(useEncounterStore, useListStore),
        kartePersc() {
            return this.encounterStore.encounterData.karte.procedures.filter(item => item.cat.code === 25)
        },
        perscCat() {
            return this.listStore.listData.procedureCategories.find(item => item.code === 25)
        }
    },
    methods: {
        selectItem(item) {
            this.perscription = null
            if (item) {
                this.perscription = this.$copy(item.row)
            }
        },
    },
    data() {
        return {
            perscription: null
        }
    }
}

</script>