<template>
    <MultiSelect 
        v-model="selectedResults" 
        :options="resultsFull" 
        optionLabel="resultName" 
        filter 
        :placeholder="$t('exam') + $t('add')"
        :maxSelectedLabels="0" 
        class="w-full" />
    <DataTable v-if="selectedResults.length > 0" size="small" :value="selectedResults" showGridlines class="mt-2">
        <Column field="resultName" :header="$t('resultName')"></Column>
        <Column field="value" :header="$t('value')" class="!w-[100px]">
            <template #body="slotProps">
                    <div v-if="slotProps.data.order?.done"></div>
                    <div v-else>
                        <InputGroup class="!w-[120px]">
                            <InputText type="text" v-model="slotProps.data.value"/>
                            <InputGroupAddon v-if="slotProps.data.unit.name && slotProps.data.unit.name !== '＊未設定'">
                                {{ slotProps.data.unit.name }}
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
// Imports /////////////////////////////////////////////////////
import useApi from "@/composables/apiComposable.js";

// Props //////////////////////////////////////////////////////
const props = defineProps({
    item: {
        default: null,
        type: Object,
    }
})

// Emits //////////////////////////////////////////////////////
const emit = defineEmits(['update'])

// Data //////////////////////////////////////////////////////
const resultsFull = ref([])
const filter = ref("")
const selectedResults = ref([])
const results = ref([])
const selectDummy = ref(null)
const timer = ref(null)

// Functions /////////////////////////////////////////////////
// Get Results on mounted
onMounted(async () => {
    let resultsList = await useApi.get('procedures/' + props.item.srycd);
    let resultsListWithResultName = resultsList.map((item) => {
        item.resultName = item.result.shared.name
        if (item.resultName === "分析物固有結果コード") {
            item.resultName = item.result.single.name
        }
        return item
    })
    resultsListWithResultName = resultsListWithResultName.filter((value, index, self) =>
    index === self.findIndex((t) => (
        t.resultName === value.resultName
    ))
)
    resultsFull.value = resultsListWithResultName
})

const selectResult = (result) => {
    this.selectedResults.push(result);
    let fullResult = this.resultsFull.find(
        (i) =>
            i.result.single.name === result ||
            i.result.shared.name === result
    );
    fullResult.value = "";
    this.results.push(fullResult);
    this.selectDummy = this.$lang.results + this.$lang.add;
}
const removeResult = (result) => {
    this.results.splice(result._index, 1);
}

// Computes /////////////////////////////////////////////////
// const items = computed(() => {
//     return [...new Set(resultsFull.value.map((v) => v.item.name))];
// })
// const itemDetails = computed(() => {
//     return [...new Set(resultsFull.value.map((v) => v.itemDetail.name))];
// })
// const samples = computed(() => {
//     return [...new Set(resultsFull.value.map((v) => v.sample.name))];
// })
// const methods = computed(() => {
//     return [...new Set(resultsFull.value.map((v) => v.method.name))];
// })
// const resultsSingle = computed(() => {
//     return [
//         ...new Set(resultsFull.value.map((v) => v.result.single.name)),
//     ];
// })
// const resultsShared = computed(() => {
//     let array = [
//         ...new Set(resultsFull.value.map((v) => v.result.shared.name)),
//     ];
//     return array.filter((i) => i !== "分析物固有結果コード");
// })
// const combinedResults = computed(() => {
//     return resultsSingle.value.concat(resultsShared.value);
// })
// const filteredResults = computed(() => {
//     let selectedItems1 = [
//         ...new Set(results.value.map((v) => v.result.single.name)),
//     ];
//     let selectedItems2 = [
//         ...new Set(results.value.map((v) => v.result.shared.name)),
//     ];
//     let selectedItems = selectedItems1.concat(selectedItems2);
//     let array = combinedResults.filter(
//         (item) => !selectedItems.includes(item)
//     );
//     if (this.filter === "") {
//         return array;
//     } else {
//         return array.filter((i) => i.includes(this.filter));
//     }
// })

// Watchers /////////////////////////////////////////////////
watch(
    results,
    () => {        
        this.$emit("update", this.results);
    },
    {deep: true}
)
</script>