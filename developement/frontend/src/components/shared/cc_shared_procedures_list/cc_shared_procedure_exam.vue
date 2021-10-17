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
                <td> 
                    <span v-if="row.result.shared.name === '分析物固有結果コード'"> {{ row.result.single.name }} </span>
                    <span v-else> {{ row.result.shared.name }} </span>
                </td>
                <td style="width: 150px">
                    <cui-input 
                        v-model="row.value"
                        noNote 
                        :placeholder="$lang.value + $lang.input"
                        :append="row.unit.name !== '＊未設定' ? row.unit.name: null"
                    />
                </td>
                <td class="cc-shared-procedure-exam-row-buttons">
                    <cui-button
                        icon="far fa-trash-alt"
                        danger
                        @click="removeResult(row)"
                    />
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
    emits: ['update'],
    created() {
        if (this.item.varData) this.results = this.item.varData;
        this.getResults();
    },
    data() {
        return {
            resultsFull: [],
            filter: "",
            selectedResults: [],
            results: [],
            selectDummy: null,
            timer: null
        }
    },
    watch: {
        results: {
            handler() {
                this.$emit('update', this.results);
            },
            deep: true
        }
    },
    methods: {
       async getResults() {
           this.resultsFull = await this.$dataService().get.procedures.examresults(this.item.srycd)
       },
       selectResult(result) {
            this.selectedResults.push(result);
            let fullResult = this.resultsFull.find(i => i.result.single.name === result || i.result.shared.name === result)
            fullResult.value = "";
            this.results.push(fullResult);
            this.selectDummy = this.$lang.results + this.$lang.add;
       },
       removeResult(result) {
           this.results.splice(result._index, 1);

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
            let selectedItems1 = [...new Set(this.results.map(v => v.result.single.name))];
            let selectedItems2 = [...new Set(this.results.map(v => v.result.shared.name))];
            let selectedItems = selectedItems1.concat(selectedItems2);
            let array = this.combinedResults.filter(item => !selectedItems.includes(item));
            if (this.filter === "") {
                return array
            } else {
                return array.filter( i => i.includes(this.filter))
            }
        }
    }
}
</script>

<style>
    .cui-table tbody tr:not(.selected, .expanded, .noHover):hover
    .cc-shared-procedure-exam-row-buttons {
        opacity: 1;
    }
    .cc-shared-procedure-exam-row-buttons {
        opacity: 0;
        padding: 0!important;
        transition: all .2s ease;
        width: 60px
    }

</style>