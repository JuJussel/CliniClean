<template>
    <div>
        From karte / registert new

    </div>
</template>

<script>

import { useEncounterStore } from '@/stores/encounter';
import { mapStores } from 'pinia';

export default {
    computed: {
        ...mapStores(useEncounterStore),
        kartePersc() {
            return this.encounterStore.encounterData.karte.procedures.filter(item => item.cat.code === 25)
        }
    }
}

</script>