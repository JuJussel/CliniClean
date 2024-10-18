<template>
    <div v-if="ready" class="flex gap-4 flex-wrap">
        <div class="field">
            <label>{{ $t('perscriptionType') }}</label>
            <Select v-model="props.item.varData.type" :options="types" optionLabel="name" :placeholder="$t('perscriptionType')"/>
        </div>
        <div class="field">
            <label>{{ $t('perscriptionTiming') }}</label>
            <Select :disabled="!props.item.varData.type" v-model="props.item.varData.timing" :options="filteredTimings" optionLabel="name" :placeholder="$t('perscriptionTiming')" class="w-[160px]"/>
        </div>
        <div class="field w-24">
            <label>{{ $t('perscriptionAmount') }}</label>
            <InputGroup>
                <InputNumber :disabled="!props.item.varData.type" v-model="props.item.varData.amount" inputId="integeronly" fluid/>
                <InputGroupAddon v-if="item.taniname">{{ item.taniname }}</InputGroupAddon>
            </InputGroup>
        </div>
        <div class="field w-24">
            <label>{{ $t('perscriptionDuration') }}</label>
            <InputGroup>
                <InputNumber :disabled="!props.item.varData.type" v-model="props.item.varData.duration" inputId="integeronly" fluid />
                <InputGroupAddon v-if="props.item.varData.timing?.unit">{{ props.item.varData.timing?.unit }}</InputGroupAddon>
            </InputGroup>
        </div>

    </div>
</template>

<script setup>


// Imports /////////////////////////////////////////////////////
const listStore = useListStore()
import Select from 'primevue/select';

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
            type: null,
            timing: [],
            amount: null,
            duration: null
        }
    }
    ready.value = true

})

// Computes /////////////////////////////////////////////////

const filteredTimings = computed(() => {
    if (props.item.varData.type?.code) {
        return timings.value.filter(item => item.typeCode === props.item.varData.type.code)
    } else {
        return []
    }
})
const types = computed(() => {
    return listStore.listData.perscriptionTypes || []
})
const timings = computed(() => {
    return listStore.listData.perscriptionTimings || []
})



</script>