<template>
    <div v-if="ready" class="flex gap-4 flex-wrap">
        <div class="field">
            <label>{{ $t('shotLocation') }}</label>
            <Select v-model="props.item.varData.location" :options="listStore.listData.shotLocations || []" :placeholder="$t('shotLocation')" class="w-[160px]"/>
        </div>
        <div class="field w-24">
            <label>{{ $t('shotAmount') }}</label>
            <InputGroup>
                <InputNumber :disabled="!props.item.varData.location" v-model="props.item.varData.amount" inputId="integeronly" fluid/>
                <InputGroupAddon v-if="item.taniname">{{ $t('vial') }}</InputGroupAddon>
            </InputGroup>
        </div>
        <div class="field w-24">
            <label>{{ $t('shotLot') }}</label>
            <InputNumber :disabled="!props.item.varData.location" v-model="props.item.varData.lot" inputId="integeronly" fluid/>
        </div>
    </div>
</template>

<script setup>
// Imports /////////////////////////////////////////////////////
import Select from 'primevue/select';
const listStore = useListStore()

// Props //////////////////////////////////////////////////////

const props = defineProps({
        item: {    default: null,
        type: Object,
    }
})
const ready = ref(false)

// Functions /////////////////////////////////////////////////
onMounted(() => {
    if (!props.item.varData) {
        props.item.varData = {
            location: null,
            amount: null,
            lot: null
        }
    }
    ready.value = true

})

</script>