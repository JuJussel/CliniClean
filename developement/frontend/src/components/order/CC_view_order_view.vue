<template>
    <div style="height: 100%; padding: 15px">
        <vs-row style="height: 100%">
            <vs-col w="6" style="height: 100%; padding-bottom: 15px" ref="loadElm">
                <vs-row style="height: 50%; padding-bottom: 10px">
                    <div style="height: 100%; width: 100%" class="content-card">
                        <vs-table striped v-model="activeKoui">
                            <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg" />
                            <div>
                                <b style="color: gray">オーダーなし</b>
                            </div>
                            </template>
                            <template #header>
                                <div class="cc-table-header-content" style="height: 50px">
                                    <h2>オーダー</h2>
                                    <vs-input state="dark" v-model="orderSearch" placeholder="患者番号又は名前" style="width: 200px; margin-left: 20px"/>
                                </div>
                            </template>
                            <template #thead>
                                <vs-tr>
                                    <vs-th sort @click="tableData.order = $vs.sortData($event ,tableData.order, 'encounterID')">カルテ番号</vs-th>
                                    <vs-th sort @click="tableData.order = $vs.sortData($event ,tableData.order, 'patientID')">患者番号</vs-th>
                                    <vs-th sort @click="tableData.order = $vs.sortData($event ,tableData.order, 'patientName')">患者名</vs-th>
                                    <vs-th sort @click="tableData.order = $vs.sortData($event ,tableData.order, 'type')">行為タイプ</vs-th>
                                    <vs-th>行為名</vs-th>
                                </vs-tr>
                            </template>
                            <template #tbody>
                                <vs-tr
                                    v-for="(tr, index) in filterPatient"
                                    :key="index"
                                    :data="tr"
                                    :is-selected="activeKoui == tr"
                                    class="cc-click-row"
                                    >
                                    <vs-td> {{ tr.encounterID }} </vs-td>
                                    <vs-td> {{ tr.patientID }} </vs-td>
                                    <vs-td> {{ tr.patientName }} </vs-td>
                                    <vs-td>
                                        <i :class="kouiCats[tr.type].icon"></i>
                                        <span> {{ kouiCats[tr.type].name }} </span>
                                    </vs-td>
                                    <vs-td> {{ tr.koui.name }} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>

                </vs-row>
                <vs-row style="height: 50%; padding-top: 10px">
                    <div style="height: 100%; width: 100%" class="content-card">
                        <vs-table striped v-model="activeKoui">
                            <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg" />
                            <div>
                                <b style="color: gray">オーダーなし</b>
                            </div>
                            </template>
                            <template #header>
                                <div class="cc-table-header-content" style="height: 50px">
                                    <h2>未済行為一覧    </h2>
                                </div>
                            </template>
                            <template #thead>
                                <vs-tr>
                                    <vs-th>カルテ番号</vs-th>
                                    <vs-th>患者名</vs-th>
                                    <vs-th>行為タイプ</vs-th>
                                    <vs-th>行為名</vs-th>
                                </vs-tr>
                            </template>
                            <template #tbody>
                                <vs-tr
                                    v-for="(tr, index) in tableData.open"
                                    :key="index"
                                    :data="tr"
                                    :is-selected="activeKoui == tr"
                                    class="cc-click-row"
                                    >
                                    <vs-td> {{ tr.encounterID }} </vs-td>
                                    <vs-td> {{ tr.patientName }} </vs-td>
                                    <vs-td>
                                        <i :class="kouiCats[tr.type].icon"></i>
                                        <span> {{ kouiCats[tr.type].name }} </span>
                                    </vs-td>
                                    <vs-td> {{ tr.koui.name }} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vs-row>
            </vs-col>
            <vs-col w="6" style="height: 100%; padding-bottom: 15px">
                <div style="height: 100%" class="content-card">
                    <kouiItemOrder
                        v-if="activeKoui"
                        :key="activeKoui.koui.tag"
                        :kouiOrig="activeKoui"
                        @saved="updateData()"
                    ></kouiItemOrder>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>
import kouiItemOrder from '../shared/CC_comp_order_koui_item'

export default {
    components: {
        'kouiItemOrder': kouiItemOrder
    },
    created() {
        this.updateData()
    },
    data() {
        return {
            loading: true,
            tableData: {
                order: [],
                open: []
            },
            kouiCats: {
                '12': {name: 'セット', type: '12'},
                '25': {name: '処方', type: '25', icon: 'fas fa-capsules'},
                '30': {name: '接種', type: '30', icon: 'fas fa-syringe'},
                '31': {name: '予防', type: '31', icon: 'fas fa-syringe'},
                '40': {name: '手術', type: '40', icon: 'fas fa-procedures'},
                '50': {name: '処置', type: '50', icon: 'fas fa-band-aid'},
                '60': {name: '検査', type: '60', icon: 'fas fa-microscope'},
                '70': {name: '画像', type: '70', icon: 'fas fa-x-ray'}
            },
            activeKoui: null,
            orderSearch: ''
        }
    },
    methods: {
        selectKoui(koui) {
            this.activeKoui = koui
        },
        updateData() {
            this.loading = true

            this.$get('orders')
            .then(result => {
                this.tableData.order = result.data.order
                this.tableData.open = result.data.open
                this.loading = false
                this.activeKoui = null
            })
            .catch(result => {
                this.$apiError(result)
            })
        }
    },
    computed: {
        filterPatient() {
            let arr = this.tableData.order
            if (this.orderSearch !== '') {
                var re = new RegExp('^' + String(this.orderSearch));
                arr = this.tableData.order.filter(item => String(item.patientID).match(re) || String(item.patientName).match(re))
            }
            console.log(arr);
            return arr
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
    }

}
</script>

<style>

</style>