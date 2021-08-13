<template>
    <div>
        <cui-table
            :data="results"
        >
            <template #header>
                <div style="display: flex; align-items: center">
                    {{ $lang.exam }} {{ $lang.results }}
                    <cui-select
                        :data="filteredResults"
                        :placeholder="$lang.exam + $lang.add"
                        noNote
                        @select="selectResult"
                        search
                        v-model="selectDummy"
                        @input="value => filter = value"
                        style="margin-left: 20px; width: 200px"
                        color="#37474f"
                    >
                    </cui-select>
                </div>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.result.single.name }} </td>
                <td>
                    <span v-if="row.unit.name !== '＊未設定'"> {{ row.unit.name }}</span>
                </td>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            default: null,
            type: Object
        }
    },
    created() {
        this.getResults();
    },
    data() {
        return {
            resultsFull: [],
            filter: "",
            selectedResults: [],
            results: [],
            selectDummy: null
        }
    },
    methods: {
       async getResults() {
           this.resultsFull = await this.$dataService().get.procedures.examresults(this.item.srycd)
       },
       selectResult(result) {
            this.selectedResults.push(result);
            let fullResult = this.resultsFull.find(i => i.result.single.name === result || i.result.shared.name === result)
            this.results.push(fullResult);
            this.selectDummy = this.$lang.results + this.$lang.add;
       }
    },
    computed: {
        items() {
            return [...new Set(this.resultsFull.map(v => v.item.name))];
        },
        itemDetails() {
            return [...new Set(this.resultsFull.map(v => v.itemDetail.name))];
        },
        samples() {
            return [...new Set(this.resultsFull.map(v => v.sample.name))];
        },
        methods() {
            return [...new Set(this.resultsFull.map(v => v.method.name))];
        },
        resultsSingle() {
            return [...new Set(this.resultsFull.map(v => v.result.single.name))];
        },
        resultsShared() {
            let array = [...new Set(this.resultsFull.map(v => v.result.shared.name))];
            return array.filter(i => i !== "分析物固有結果コード");
        },
        combinedResults() {
            return this.resultsSingle.concat(this.resultsShared);
        },
        filteredResults() {
            let array = this.combinedResults.filter(item => !this.selectedResults.includes(item));
            if (this.filter === "") {
                return array
            } else {
                return array.filter( i => i.includes(this.filter))
            }
        }
    }
}
</script>