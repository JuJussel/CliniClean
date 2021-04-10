<template>
    <div 
        style="height: calc(100% - 20px); overflow: auto"
        v-bind:class="{landscape: landscape}"
        class="content-card customHeight"
        >
        <vs-table striped style="max-height: calc(100% - 140px)">
            <template #notFound>
                データなし
            </template>
            <template #header>
                <div v-if="!noFilter">
                    <vs-row>
                        <vs-col w="6">
                            <vs-select
                                label="行為名"
                                filter
                                chip-max-width="129px"
                                collapse-chips
                                multiple
                                active
                                class="cc-dark-select"
                                placeholder="検索"
                                :key="kouisFilter.length"
                                v-model="selectedkouis"
                                >
                                <vs-option
                                    v-for="item in kouisFilter"
                                    :key="item.tag"
                                    :label="item.name"
                                    :value="item"
                                >
                                {{ item.name }}
                                </vs-option>
                            </vs-select>
                        </vs-col>
                        <vs-col w="6">
                            <div style="padding: 0 5px">
                                <div style="margin-left: 10px; font-size: 12px">日付</div>
                                <date-picker
                                    v-model="selectedDate"
                                    range
                                    class="vs-input-parent--state-dark"
                                    placeholder="選択"
                                    format="YYYY年MM月DD日"
                                    value-type="YYYY-MM-DD"
                                    input-class="vs-input vs-input--state-dark cc-mx-input"
                                    popup-class="cc-date-picker"
                                    >
                                </date-picker>
                            </div>
                        </vs-col>
                    </vs-row>
                    <vs-row style="flex-grow: 1">
                        <vs-col w="6">
                            <vs-select
                                label="行為類"
                                filter
                                chip-max-width="129px"
                                collapse-chips
                                multiple
                                active
                                class="cc-dark-select"
                                placeholder="検索"
                                :key="kouiCats.length"
                                v-model="selectedType"
                                >
                                <vs-option
                                    v-for="(item, i) in kouiCats"
                                    :key="i"
                                    :label="item.name"
                                    :value="item.type"
                                >
                                <i :class="kouiCats[item.type].icon"></i>
                                {{ item.name }}
                                </vs-option>
                            </vs-select>
                        </vs-col>

                    </vs-row>
                </div>
            </template>
            <template #thead>
                <vs-tr>
                    <vs-th sort @click="kouis = $vs.sortData($event ,kouisFiltered, 'name')">
                        行為名
                    </vs-th>
                    <vs-th style="min-width: 100px" sort @click="kouis = $vs.sortData($event ,kouisFiltered, 'type')">行為類</vs-th>
                    <vs-th style="min-width: 150px" sort @click="kouis = $vs.sortData($event ,kouisFiltered, 'date')">日付</vs-th>
                </vs-tr>
            </template>
            <template #tbody>
                <vs-tr v-for="(tr, index) in kouisFiltered" :key="index" class="cc-click-row" style="border-top: solid 5px white">
                    <vs-td> {{ tr.name }} </vs-td>
                    <vs-td>
                        <div>
                            <i :class="kouiCats[tr.type].icon"></i>
                            <span> {{kouiCats[tr.type].name}}</span>
                        </div>
                    </vs-td>
                    <vs-td><dateDisplay :date="tr.date"></dateDisplay></vs-td>
                    <template #expand>
                        <div style="padding: 20px; background: white; border-radius: 14px">
                            <vs-row>
                                <vs-tooltip v-if="!noFilter">
                                    <vs-button
                                        dark
                                        style="height: 30px"
                                        @click='showKarte(tr)'
                                        >カルテ番号：{{ tr.encounterID }} </vs-button>
                                    <template #tooltip>カルテ表示</template>
                                </vs-tooltip>
                                <vs-tooltip>
                                    <vs-button
                                        v-if="tr.ins === '0001' || tr.noCalc || tr.gai"
                                        :warn="tr.ins === '0001' && !tr.noCalc && !tr.gai"
                                        :danger="tr.gai"
                                        :dark="tr.noCalc"
                                        :shadow="tr.ins !== '0001' && !tr.gai && !tr.noCalc"
                                        icon
                                        size="small"
                                        style="height: 30px; width: 30px"
                                    >
                                        <span v-if="tr.ins === '0001' && !tr.noCalc && !tr.gai">自</span>
                                        <span v-else-if="tr.noCalc">無</span>
                                        <span v-else-if="tr.gai">外</span>
                                    </vs-button>
                                <template #tooltip>
                                    <span v-if="tr.ins === '0001'">自費</span>
                                    <span v-if="tr.gai">保険外</span>
                                    <span v-if="tr.noCalc === '0001'">算定なし</span>
                                </template>
                                </vs-tooltip>
                            </vs-row>
                            <vs-row>
                                <kouiView :koui="tr"/>
                            </vs-row>
                        </div>
                    </template>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>

import kouiView from '../shared/CC_comp_procedure_item_view'

export default {
    components: {
        'kouiView': kouiView,
    },
    props: {
        data: {
            default: {}
        },
        noFilter: {
            default: false
        },
        landscape: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            kouis: [],
            selectedkouis: [],
            selectedDate: [],
            selectedType: [],
            displayFilter: false,
            kouiCats: {
                '25': {name: '処方', type: '25', icon: 'fas fa-capsules'},
                '30': {name: '接種', type: '30', icon: 'fas fa-syringe'},
                '31': {name: '予防', type: '31', icon: 'fas fa-syringe'},
                '40': {name: '手術', type: '40', icon: 'fas fa-procedures'},
                '50': {name: '処置', type: '50', icon: 'fas fa-band-aid'},
                '60': {name: '検査', type: '60', icon: 'fas fa-microscope'},
                '70': {name: '画像', type: '70', icon: 'fas fa-x-ray'},
                '90': {name: '健康診断', type: '90', icon: 'fas fa-x-ray'}
            }
        }
    },
    methods: {
        showKarte(k) {
            let emitData = {
                id: k.encounterID,
                date: k.date,
                patientName: this.data.basic.patientName,
                patientID: this.data.basic.patientID
            }
            this.$eventHub.$emit('showKarteView', emitData)
        }
    },
    created() {
        if (this.noFilter) {
            this.kouis = this.data.koui
        } else {                
            this.kouis = this.data.koui.filter(k => k.type !== '25' && k.type !== '90')            
        }
    },
    computed: {
        kouisFilter() {
            let filter = this.data.koui.filter(k => k.type !== '25')
            filter = Array.from(new Set(filter.map(a => a.kouiCode)))
                .map(id => {
                return filter.find(a => a.kouiCode === id)
            })
            return filter
        },
        kouisFiltered() {
            let returnArr = this.kouis
            if (this.selectedkouis.length > 0) {
                returnArr = this.kouis.filter(i => this.selectedkouis.includes(i))                
            }
            if (this.selectedDate[0]) {
                returnArr = returnArr.filter(
                    i => this.$moment(i.date).isBetween(this.selectedDate[0], this.selectedDate[1], 'day', '[]')
                )
            }
            if (this.selectedType.length > 0) {
                returnArr = returnArr.filter(i => this.selectedType.includes(i.type) )
            }
            return returnArr
        }
    },


}
</script>

<style scoped>
.landscape {
    max-width: 1000px;
    height: calc(100% - 20px)!important
}
</style>