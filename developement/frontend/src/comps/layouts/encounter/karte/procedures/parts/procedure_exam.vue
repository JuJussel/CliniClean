<template>
    <div>
        <!-- <cui-table :data="results">
            <template #header>
                <div style="display: flex; align-items: center">
                    {{ $lang.exam }} {{ $lang.results }}
                    <cui-select
                        v-if="filteredResults.length > 0"
                        :data="filteredResults"
                        :placeholder="$lang.exam + $lang.add"
                        noNote
                        @select="selectResult"
                        search
                        v-model="selectDummy"
                        @input="(value) => (filter = value)"
                        style="margin-left: 20px; width: 200px"
                        color="#37474f"
                        :disabled="!$aclService(2)"
                    >
                    </cui-select>
                </div>
            </template>
            <template v-slot:row="{ row }">
                <td>
                    <span
                        v-if="row.result.shared.name === '分析物固有結果コード'"
                    >
                        {{ row.result.single.name }}
                    </span>
                    <span v-else> {{ row.result.shared.name }} </span>
                </td>
                <td style="width: 150px">
                    <span v-if="item.order?.done">
                        <span style="margin-right: 5px">{{ row.value }}</span>
                        <span v-if="row.unit.name !== '＊未設定'">{{
                            row.unit.name
                        }}</span>
                    </span>
                    <cui-input
                        v-else
                        v-model="row.value"
                        noNote
                        :disabled="item.order?.locked || !$aclService(2)"
                        :placeholder="$lang.value + $lang.input"
                        :append="
                            row.unit.name !== '＊未設定' ? row.unit.name : null
                        "
                    />
                </td>
                <td class="cc-shared-procedure-exam-row-buttons">
                    <cui-button
                        icon="far fa-trash-alt"
                        danger
                        :disabled="
                            item.order?.done ||
                            item.order?.locked ||
                            !$aclService(2)
                        "
                        @click="removeResult(row)"
                    />
                </td>
            </template>
        </cui-table> -->
    </div>
</template>

<script setup>

const props = defineProps({
    item: {
        default: null,
        type: Object,
    }
})

const emit = defineEmits(['update'])

// Data //////////////////////////////////////////////////////
const resultsFull = ref([])
const filter = ref("")
const selectedResults = ref([])
const results = ref([])
const selectDummy = ref(null)
const timer = ref(null)

// Functions /////////////////////////////////////////////////
const getResults = async() => {
    this.resultsFull =
        await this.$api.get('procedures/' + this.item.srycd);
}
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
const items = computed(() => {
    return [...new Set(this.resultsFull.map((v) => v.item.name))];
})
const itemDetails = computed(() => {
    return [...new Set(this.resultsFull.map((v) => v.itemDetail.name))];
})
const samples = computed(() => {
    return [...new Set(this.resultsFull.map((v) => v.sample.name))];
})
const methods = computed(() => {
    return [...new Set(this.resultsFull.map((v) => v.method.name))];
})
const resultsSingle = computed(() => {
    return [
        ...new Set(this.resultsFull.map((v) => v.result.single.name)),
    ];
})
const resultsShared = computed(() => {
    let array = [
        ...new Set(this.resultsFull.map((v) => v.result.shared.name)),
    ];
    return array.filter((i) => i !== "分析物固有結果コード");
})
const combinedResults = computed(() => {
    return this.resultsSingle.concat(this.resultsShared);
})
const filteredResults = computed(() => {
    let selectedItems1 = [
        ...new Set(this.results.map((v) => v.result.single.name)),
    ];
    let selectedItems2 = [
        ...new Set(this.results.map((v) => v.result.shared.name)),
    ];
    let selectedItems = selectedItems1.concat(selectedItems2);
    let array = this.combinedResults.filter(
        (item) => !selectedItems.includes(item)
    );
    if (this.filter === "") {
        return array;
    } else {
        return array.filter((i) => i.includes(this.filter));
    }
})

// Watchers /////////////////////////////////////////////////
watch(
    results,
    () => {        
        this.$emit("update", this.results);
    },
    {deep: true}
)
</script>