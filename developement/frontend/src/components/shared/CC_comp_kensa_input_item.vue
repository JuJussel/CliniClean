<template>
    <div>
        <vs-table :adaptive="meta.koui.var.results" :trHeight="60">
            <template #notFound>
                <div><b style="color: gray">データなし</b></div>
            </template>
            <template #header>
                <div class="cc-table-header-content" style="height: 50px">
                    <h2> {{ meta.koui.name }} </h2>
                    <vs-select
                        filter
                        multiple
                        active
                        collapse-chips
                        placeholder="検索"
                        v-if="resultsListFull"
                        v-model="meta.koui.var.results"
                        :key="resultsListFull.length"
                        class="cc-dark-select"
                        style="width: 250px !important; margin-left: 20px"
                        >
                        <vs-option
                            v-for="result in resultsListFull"
                            :key="result.kensa_code"
                            :label="result.name"
                            :value="result"
                        >
                            {{ result.name }}
                        </vs-option>
                    </vs-select>
                    <vs-button
                        v-if="!noDelete"
                        @click="$emit('removeKensa')"
                        icon danger border
                        size="small"
                        animation-type="scale"
                        >
                            <i class="far fa-trash-alt" style="font-size: 14px"></i>
                        <template #animate>削</template>
                    </vs-button>
                </div>
            </template>
            <template #thead>
                <vs-tr>
                    <vs-th>結果項目</vs-th>
                    <vs-th>値</vs-th>
                    <vs-th></vs-th>
                </vs-tr>
            </template>
            <template #tbody>
                <vs-tr v-for="(tr, index) in meta.koui.var.results" :key="index">
                    <vs-td> {{ tr.name }} </vs-td>
                    <vs-td>
                        <vs-input v-model="tr.value" icon-after style="width: 200px!important">
                            <template #icon v-if="tr.unit !=='' && tr.unit !== '　'">
                                {{ tr.unit }}
                            </template>
                        </vs-input>
                    </vs-td>
                    <vs-td>
                        <vs-button
                            @click="removeResult(tr)"
                            icon danger border
                            size="small"
                            animation-type="scale"
                            class="cc-hover-button"
                            >
                                <i class="far fa-trash-alt" style="font-size: 14px"></i>
                            <template #animate>削</template>
                        </vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>
    export default {
        props: {
            meta: {default: null},
            noDelete: {default: false, type: Boolean}
        },
        created() {

            this.$get('examinationresults/' +this.meta.koui.kouiCode)
            .then(result => {
                this.resultsListFull = result.data
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        data() {
            return {
                resultsListFull: null,
                resultsFilter: ""
            }
        },
        computed: {
            resultsListFiltered() {
                if (this.resultsListFull) {
                    let returnArr = JSON.parse(JSON.stringify(this.resultsListFull))
                    this.meta.koui.var.results.forEach(element => {
                        returnArr = returnArr.filter(result => result.kensa_code !== element.kensa_code)
                    })
                    returnArr = returnArr.filter(result => result.name && result.name.includes(this.resultsFilter))
                    return returnArr
                } else {
                    return []
                }
            }
        },
        methods: {
            addResult(result) {
                this.meta.koui.var.results.push(result)
            },
            removeResult (result) {
                this.meta.koui.var.results = this.meta.koui.var.results.filter(r => r.kensa_code !== result.kensa_code)
            }
        }
    }
</script>
