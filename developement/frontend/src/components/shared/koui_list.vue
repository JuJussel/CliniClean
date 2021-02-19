<template>
    <div style="height: 100%">

        <div style="height: 100%; flex-grow: 1; z-index: 10000">
            <vs-table v-bind:style="{'height': tableStyle}" ref="tbody" striped>
                <template #notFound>
                    <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                    <div>
                    <b style="color: gray">検索結果なし</b>
                    </div>
                </template>
                <template #header>
                    <vs-button-group style="margin-bottom: 2px">
                        <vs-button
                            border
                            dark
                            :active="activeTab == tab.type"
                            v-for="tab in filderedKouiCats[0]"
                            :key="tab.type"
                            @click="activeTab = tab.type"
                            style="flex: 1"
                            >
                            <span> 
                                <i :class="tab.icon"></i>
                                {{ tab.name }} 
                            </span>
                        </vs-button>
                    </vs-button-group>
                    <vs-button-group style="margin-bottom: 20px">
                        <vs-button
                            border
                            dark
                            :active="activeTab == tab.type"
                            v-for="tab in filderedKouiCats[1]"
                            :key="tab.type"
                            @click="activeTab = tab.type"
                            style="flex: 1"
                            >
                            <span> 
                                <i :class="tab.icon"></i>
                                {{ tab.name }} 
                            </span>
                        </vs-button>
                    </vs-button-group>
                    <div class="cc-table-header-content" style="margin-bottom: 0; dispaly: flex">
                            <i :class="kouiCats[activeTab].icon" style="font-size: 30px; width: 60px"></i>
                            <vs-input type="search" state="dark" :placeholder="kouiCats[activeTab].name + '検索'" v-model="kouiCats[activeTab].search" @input="searchKoui(activeTab)">
                                <template #icon>
                                    <i class="fas fa-search"></i>
                                </template>
                            </vs-input>
                            <vs-button
                                v-if="activeTab == 12"
                                dark
                                style="margin: -2px 10px"
                                animation-type="scale"
                                @click="openSetAdd"
                                >
                                <i class="fas fa-plus"></i>
                                <template #animate >
                                    登録
                                </template>
                            </vs-button>
                    </div>
                </template>
                <template #thead>
                    <vs-th v-if="activeTab != 12">行為名</vs-th>
                    <vs-th v-if="activeTab != 12 && activeTab !== '25'" style="min-width: 55px">点数</vs-th>
                    <vs-th v-if="activeTab == 12">セットエクスプローラー</vs-th>
                </template>
                <template #tbody>
                    <div v-if="activeTab == 12">
                        <tree
                            v-if="kouiCats[activeTab].results.length > 0"
                            :data="kouiCats[activeTab].results"
                            :key="treeKey"
                            ref="sets"
                            @node:clicked="addSet"
                            >
                            <span slot-scope="{ node }">
                                <template>
                                    <span v-if="node.data.isFolder">
                                        <i class="far fa-folder" v-if="!node.expanded()"></i>
                                        <i class="far fa-folder-open" v-else></i>
                                        {{ node.text }}
                                    </span>
                                    <vs-tooltip shadow left v-else>
                                        <i class="far fa-list-alt"></i>
                                        {{ node.text }}
                                        <template #tooltip>
                                            <kouiQuickView v-for="(item, index) in node.data.content.items" :key="index" :koui="item"/>
                                        </template>
                                    </vs-tooltip>
                                </template>
                            </span>
                            
                        </tree>
                    </div>
                    <vs-tr
                        v-else
                        v-for="(tr, index) in kouiCats[activeTab].results"
                        :key="index"
                        class="cc-click-row"
                        @click="addKoui(tr)"
                        >
                        <vs-td> {{ tr.name}} </vs-td>
                        <vs-td v-if="activeTab !== '25'">{{ tr.cost }}</vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <vs-dialog v-model="setCreate.open" width="1000px" prevent-close>
            <template #header>
                <h4>セット登録</h4>
            </template>
            <setCreate
                :items="setCreate.data"
                :sets="kouiCats[activeTab].results"
                @close="setCreate.open = false"
                @newFolder="getFavourites"
                @save="getFavourites"
            />
        </vs-dialog>
    </div>
</template>

<script>

import kouiQuickView from '../shared/CC_procedure_view_quick'
import setCreate from '../shared/CC_sets_create'

export default {
    components: {
        'kouiQuickView': kouiQuickView,
        'setCreate': setCreate
    },
    props: {
        currentKouis: {
            default() {
                return []
            }
        },
        noSets: {type: Boolean, default: false}
    },
    created() {
        this.getFavourites()
    },
    computed: {
        filderedKouiCats() {
            const n = 4
            let arr = Object.values(this.kouiCats)
            if (this.noSets) {
                arr = arr.filter(item => item.type !== '12')
            }
            arr = arr.filter(item => item. type !== '90')
            arr = new Array(Math.ceil(arr.length / n))
            .fill()
            .map(_ => arr.splice(0, n))
            return arr
        },
        tableStyle() {
            if (this.activeTab != 12) {
                return('calc(100% - 100px)')
            } else {
                return('calc(100% - 110px)')
            }
        }
    },
    data() {
        return {
            activeTab: this.noSets ? '25' : '12',
            kouiSetSelectionAll: [],
            kouisToSave: [],
            setCreate: {
                open: false,
                data: null
            },
            user: this.$store.getters.userInfo.id,
            loading: false,
            loadingCont: null,
            kouiCats: JSON.parse(JSON.stringify(this.$store.getters.kouiCats)),
            treeKey: 1
        }
    },
    watch: {
        activeTab() {
            this.getFavourites()
        },
        loading() {
            if (this.loading) {
                this.loadingCont= this.$vs.loading({
                    target: this.$refs.tbody,
                    color: 'dark'
                })
            } else {
                this.loadingCont.close()
                this.loadingCont = null
            }

        }
    },
    methods: {
        openSetAdd() {
            let koui = JSON.parse(JSON.stringify(this.currentKouis))
            this.setCreate.data = koui
            this.setCreate.open = true
        },
        searchKoui(tab) {
            const search = this.kouiCats[tab].search
            if (search !== '' && tab !== "12") {
                const loading = this.$vs.loading({
                    target: this.$refs.tbody,
                    color: 'dark'
                })

                let sendData = {
                    cat: tab,
                    name: search
                }

                this.$get('procedures', sendData)
                .then(result => {
                    this.kouiCats[tab].results = result.data
                    loading.close()
                })
                .catch(result => {
                    this.$apiError(result)
                    loading.close()
                })                
            } else if (search !== '') {


            } else {
                this.getFavourites()
            }
        },
        addKoui(row) {
            this.$emit('addKoui', {koui: row, type: this.activeTab})
            let sendData = {
                procedure: row,
                type: this.activeTab
            }
            this.$post('favourites', sendData)
            .then(result => {
                this.getFavourites()
            })
            .catch(result => {
                this.$apiError(result)
            })

        },
        addSet(node) {
            if (!node.data.isFolder) {

                node.data.content.items.forEach(item => {

                    let data = {
                        kouiid: item.kouiCode,
                        type: item.type,
                        name: item.name,
                        taniname: item.var.unit ? item.var.unit : null
                    }
                    this.$emit('addKoui', {koui: data, type: item.type})

                })

            }
        },
        getFavourites() {
            this.loading = true
            if (this.activeTab == 12) {

                const patient = this.$store.getters.activePatient
                if(!patient) {
                    setTimeout(this.getFavourites, 500)
                    return
                }
                this.$get('sets/' + patient)
                .then(result => {
                    if(this.kouiCats[this.activeTab].search === "") {
                        this.kouiCats[this.activeTab].results = result.data
                    }
                    this.treeKey++
                    this.loading = false
                })
                .catch(result => {
                    this.$apiError(result)
                    this.loading = false
                })

            } else {
                
                this.$get('favourites/' + this.$store.getters.userInfo.id, this.activeTab)
                .then(result => {
                    if(this.kouiCats[this.activeTab].search === "") {
                        this.kouiCats[this.activeTab].results = result.data
                    }
                    this.loading = false
                })
                .catch(result => {
                    this.$apiError(result)
                    this.loading = false
                })
            }

        }
    }
}
</script>

<style>
    .item-node {
        text-align: left
    }
</style>