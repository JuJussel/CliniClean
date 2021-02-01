<template>
    <div style="height: 100%; padding: 15px">
        <vs-row style="height: 100%">
            <vs-col w="6" style="height: 100%; padding-bottom: 15px">
                <div style="height: 100%" class="content-card">
                    <vs-table striped ref="loadElm" :adaptive="kensaListTransformed" v-model="activeSelection">
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                            <div><b style="color: gray">検索結果なし</b></div>
                        </template>
                        <template #header>
                            <div class="cc-table-header-content" style="height: 50px">
                                <h2>患者選択</h2>
                                <selectInput 
                                    table
                                    dark
                                    :icon="'fas fa-search'"
                                    @change="doSearch" 
                                    :results="searchResults"
                                    placeholder="氏名又はIDで検索"
                                    @select="selectPatient"
                                    style="width: 300px; margin-left: 20px">
                                    <span slot-scope="scope" >番号: {{ scope.item.id}} {{ scope.item.name }}</span>
                                </selectInput>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr>
                                <vs-th>依頼番号</vs-th>
                                <vs-th>検査</vs-th>
                                <vs-th>日付</vs-th>
                                <vs-th>依頼先</vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr
                                v-for="(tr, index) in kensaListTransformed"
                                :key="index"
                                :data="tr"
                                :is-selected="activeSelection == tr"
                                class="cc-click-row"
                                >
                                <vs-td>{{ tr.requestNumber }}</vs-td>
                                <vs-td>{{ tr.name }}</vs-td>
                                <vs-td><dateDisplay :date="tr.date"></dateDisplay></vs-td>
                                <vs-td>{{ tr.supplier }}</vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vs-col>
            <vs-col w="6" style="height: 100%; padding-bottom: 15px">
                <div style="height: 100%" class="content-card">
                    <kensaInput
                        v-if="activeSelection"
                        :meta="activeSelection"
                        @saved="getKensa(selectedPatient)"
                    ></kensaInput>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>

import kensaInput from "../shared/kensaInput"

export default {
    components: {
        'kensaInput': kensaInput
    },
    data() {
        return {
            displayMode: 1,
            loading: false,
            loadingElm: null,
            search: {
                name: '',
                id: ''
            },
            selectedPatient: null,
            searchResults: [],
            kensaList: [],
            activeSelection: null
        }
    },
    watch: {
        loading() {
            if (this.loading) {
                this.loadingElm = this.$vs.loading({
                    target: this.$refs.loadElm,
                    color: 'dark'
                })
            } else if (this.loadingElm) {
                this.loadingElm.close()
                this.loadingElm = null
            }
        }
    },
    computed: {
        kensaListTransformed() {
            let returnArr = []
            if (this.displayMode === 1) {
                this.kensaList.forEach(element => {
                    let requestNumber = ''
                    let supplier = ''
                    if(element.type !== '90') {
                        requestNumber = element.koui.var.supplier.number
                        supplier = element.koui.var.supplier.supplier
                    }
                    returnArr.push({
                        requestNumber: requestNumber,
                        date: element.date,
                        kouis: [element],
                        name: element.koui.name,
                        supplier: supplier
                    })
                })
            } else if (this.displayMode === 2) {
                this.kensaList.forEach(element => {
                    if(element.type === '90') {
                        returnArr.push({
                            requestNumber: '',
                            name: '健康診断',
                            date: element.date,
                            kouis: [element],
                            supplier: ''
                        })
                    } else {
                        let index = returnArr.findIndex(i => i.requestNumber === element.koui.var.supplier.number)
                        if(index < 0) {
                            returnArr.push({
                                requestNumber: element.koui.var.supplier.number,
                                date: element.date,
                                kouis: [element],
                                supplier: element.koui.var.supplier.supplier
                            })
                        } else {
                            returnArr[index].kouis.push(element)
                        }
                    }
                });
            } else if (this.displayMode === 3) {
                
            }
            return returnArr
        }
    },
    methods: {
        selectPatient(pat) {
            this.selectedPatient = pat
            this.getKensa(pat)
        },
        getKensa(data) {
            this.activeSelection = null
            this.kensaList = []
            this.loading = true

            this.$get('Examinations', data.id)
            .then(result => {
                this.kensaList = result.data
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        doSearch(query) {
            if (query !== '') {

                this.$get('patients', query)
                .then(result => {
                    this.searchResults = result.data
                })
                .catch(result => {
                    this.$apiError(result)
                })
            } else {
                this.searchResults = []
            }
        },
        selectKensa(row) {
            this.activeSelection = JSON.parse(JSON.stringify(row))
        }
    }
}
</script>