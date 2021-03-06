<template>
    <div>
        <vs-row>
            <vs-col w="6" style="padding-right: 20px">  
                <vs-table style="height: 300px" ref="loadElm" v-model="selectedKensa">
                    <template #notFound>
                        <div><b style="color: gray">検索結果なし</b></div>
                    </template>
                    <template #header>
                        <div class="cc-table-header-content" style="margin-bottom: 0">
                            <h2>検査選択</h2>
                            <vs-input type="search" state="dark" :placeholder="'検査検索'" v-model="search" @input="doSearch" style="margin-left: 20px">
                                <template #icon>
                                    <i class="fas fa-search"></i>
                                </template>
                            </vs-input>
                        </div>
                    </template>
                    <template #thead>
                        <vs-th></vs-th>
                        <vs-th>行為名</vs-th>
                        <vs-th style="min-width: 55px">点数</vs-th>
                    </template>
                    <template #tbody>
                        <vs-tr
                            v-for="(tr, index) in resultsListFull"
                            :key="index"
                            :data="tr"
                            :is-selected="!!selectedKensa.includes(tr)"
                        >
                            <vs-td checkbox>
                                <vs-checkbox :val="tr" v-model="selectedKensa" />
                            </vs-td>
                            <vs-td> {{ tr.name}} </vs-td>
                            <vs-td>{{ tr.cost }}</vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
            <vs-col w="6">
                <vs-table style="height: 300px">
                    <template #notFound>
                        <div><b style="color: gray">検索結果なし</b></div>
                    </template>
                    <template #header>
                        <div class="cc-table-header-content" style="margin-bottom: 0">
                            <h2>選択済</h2>
                        </div>
                    </template>
                    <template #thead>
                        <vs-th>行為名</vs-th>
                        <vs-th style="min-width: 55px"></vs-th>
                    </template>
                    <template #tbody>
                        <vs-tr
                            v-for="(tr, index) in selectedKensa"
                            :key="index"
                        >
                            <vs-td> {{ tr.name}} </vs-td>
                            <vs-td>
                                <vs-button
                                    @click="removeKensa(tr)"
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
            </vs-col>
        </vs-row>
    </div>
</template>

<script>

export default {
    data() {
        return {
            search: null,
            resultsListFull: [],
            selectedKensa: []
        }
    },
    computed: {
        inputOK() {
            if (this.selectedKensa.length > 0) {
                return true
            }
            return false
        }
    },
    methods: {
        removeKensa(row) {
            this.selectedKensa = this.selectedKensa.filter(item => item !== row)
        },
        doSearch(tab) {
            if (this.search !== '') {
                const loading = this.$vs.loading({
                    target: this.$refs.loadElm,
                    color: 'dark'
                })

                let sendData = {
                    cat: '60',
                    name: this.search
                }
                this.$get('procedures', sendData)
                .then(result => {
                    this.resultsListFull = result.data
                    loading.close()
                })
                .catch(result => {
                    this.$apiError(result)
                })                
                
            } else {
                this.resultsListFull = []
            }
        },

    }
}
</script>