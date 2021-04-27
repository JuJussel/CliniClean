<template>
    <div style="height: calc(100% - 10px)" ref="loadCont" v-bind:class="{landscape: landscape}">
        <div class="content-card customHeight" style="height: calc(40% - 10px)">
            <vs-table style="height: 100%">
                <template #header>
                    <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                        <span>有効</span>
                        <vs-button
                            v-if="edit"
                            @click="showByoumeiEdit('add', null)"
                            icon dark
                            size="small"
                            animation-type="scale"
                            >
                            <i class="fas fa-plus" style="font-size: 14px"></i>
                            <template #animate>登録</template>
                        </vs-button>
                    </h3>
                </template>
                <template #thead>
                    <vs-tr>
                        <vs-th>病名</vs-th>
                        <vs-th>疑い・急性</vs-th>
                        <vs-th>主病</vs-th>
                        <vs-th>開始日</vs-th>
                        <vs-th></vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr v-for="(tr, index) in byoumeiActive" :key="index">
                        <vs-td> {{ tr.Disease_Name }} </vs-td>
                        <vs-td> {{ utagaiDecode(tr.Disease_SuspectedFlag )}} </vs-td>
                        <vs-td><span v-if="tr.Disease_Category === 'PD'">主病</span></vs-td>
                        <vs-td><dateDisplay :date="tr.Disease_StartDate"></dateDisplay></vs-td>
                        <vs-td style="width: 60px">
                            <vs-button
                                v-if="edit"
                                @click="showByoumeiEdit('edit', tr)"
                                icon dark border
                                size="small"
                                animation-type="scale"
                                class="cc-hover-button"
                                >
                                <i class="far fa-edit" style="font-size: 14px"></i>
                                <template #animate>編集</template>
                            </vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div class="content-card customHeight" style="height: 60%">
            <vs-table striped>
                <template #notFound>データなし</template>
                <template #header>
                    <h3>履歴</h3>
                    <vs-row align="center">
                        <vs-col w="5">
                            <vs-select
                                label="処方名"
                                filter
                                chip-max-width="60px"
                                collapse-chips
                                multiple
                                active
                                class="cc-dark-select"
                                placeholder="検索"
                                :key="byoumeiFilter.length"
                                v-model="selectedByoumei"
                                >
                                <vs-option
                                    v-for="item in byoumeiFilter"
                                    :key="item.khnbyomeicd"
                                    :label="item.byomei"
                                    :value="item.khnbyomeicd"
                                >
                                {{ item.byomei }}
                                </vs-option>
                            </vs-select>
                        </vs-col>
                        <vs-col w="4">
                            <vs-select
                                label="転帰"
                                chip-max-width="129px"
                                collapse-chips
                                multiple
                                class="cc-dark-select"
                                active
                                placeholder="Test"
                                :key="tenkikbn.length"
                                v-model="selectedOutcomes"
                                >
                                <vs-option
                                    v-for="(item, index) in tenkikbn"
                                    :key="index"
                                    :label="item"
                                    :value="index"
                                >
                                {{ item }}
                                </vs-option>
                            </vs-select>
                        </vs-col>
                        <vs-col w="3">
                            <vs-row>
                                <vs-checkbox dark v-model="checkFilters.utagai">疑い</vs-checkbox>
                                <vs-checkbox dark v-model="checkFilters.acute">急性</vs-checkbox>
                                <vs-checkbox dark v-model="checkFilters.main">主病</vs-checkbox>
                            </vs-row>
                        </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col w="6">
                            <div style="padding: 0 5px">
                                <div style="margin-left: 10px; font-size: 12px">開始日</div>
                                <date-picker
                                    v-model="selectedStartDate"
                                    range
                                    class="vs-input-parent--state-dark"
                                    placeholder="選択"
                                    format="YYYY年MM月DD日"
                                    value-type="YYYY-MM-DD"
                                    input-class="vs-input cc-mx-input"
                                    popup-class="cc-date-picker"
                                    >
                                </date-picker>
                            </div>
                        </vs-col>
                        <vs-col w="6">
                            <div style="padding: 0 5px">
                                <div style="margin-left: 10px; font-size: 12px">転帰日</div>
                                <date-picker
                                    v-model="selectedEndDate"
                                    range
                                    class="vs-input-parent--state-dark"
                                    placeholder="選択"
                                    format="YYYY年MM月DD日"
                                    value-type="YYYY-MM-DD"
                                    input-class="vs-input cc-mx-input"
                                    popup-class="cc-date-picker"
                                    >
                                </date-picker>
                            </div>
                        </vs-col>
                    </vs-row>

                </template>
                <template #thead>
                    <vs-tr>
                        <vs-th style="min-width: 200px; position: sticky; left: 0; z-index: 2001" sort
                            @click="byoumei_history = $vs.sortData($event ,byoumeiFiltered, 'byomei')">病名</vs-th>
                        <vs-th style="min-width: 120px" sort
                            @click="byoumei_history = $vs.sortData($event ,byoumeiFiltered, 'utagaiflg')">疑い・急性</vs-th>
                        <vs-th style="min-width: 80px" sort
                            @click="byoumei_history = $vs.sortData($event ,byoumeiFiltered, 'syubyoflg')">主病</vs-th>
                        <vs-th style="min-width: 120px" sort
                            @click="byoumei_history = $vs.sortData($event ,byoumeiFiltered, 'creymd')">開始日</vs-th>
                        <vs-th style="min-width: 80px" sort
                            @click="byoumei_history = $vs.sortData($event ,byoumeiFiltered, 'tenkikbn')">転帰</vs-th>
                        <vs-th style="min-width: 120px" sort
                            @click="byoumei_history = $vs.sortData($event ,byoumeiFiltered, 'tenkiymd')">転帰日</vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr v-for="(tr, index) in byoumeiFiltered" :key="index" class="hover-fix">
                        <vs-td style="position: sticky; left: 0; z-index: 2000; background: inherit" v-bind:class="{'hover-override': index%2 == 0}"> {{ tr.byomei }} </vs-td>
                        <vs-td> {{ utagaiDecode(tr.utagaiflg )}} </vs-td>
                        <vs-td><span v-if="tr.syubyoflg == '1'">主病</span></vs-td>
                        <vs-td><dateDisplay :date="tr.creymd"></dateDisplay></vs-td>
                        <vs-td>{{ tenkiTransform(tr.tenkikbn) }}</vs-td>
                        <vs-td>
                            <dateDisplay v-if="tr.tenkiymd !== ''" :date="tr.tenkiymd"></dateDisplay>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>

        <vs-dialog
            blur
            v-model="editByoumeiOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> {{ byoumeiModal.title }} </h3>
            </template>
            <byoumeiEdit
                v-if="editByoumeiOpen"
                :byoumeiData="byoumeiModal.data"
                :mode="byoumeiModal.mode"
                @save="saveByoumei"
                @close="editByoumeiOpen = false"
            />
        </vs-dialog>
    </div>
</template>

<script>

import byoumeiEdit from '../shared/CC_comp_disease_edit'

export default {
    components: {
        'byoumeiEdit': byoumeiEdit
    },
    props: {
        data: {
            type: Object
        },
        edit: {
            default: true,
            type: Boolean
        },
        landscape: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            loading: false,
            selectedByoumei: [],
            selectedStartDate: [],
            selectedEndDate: [],
            selectedOutcomes: [],
            checkFilters: {
                utagai: false,
                acute: false,
                main: false
            },
            editByoumeiOpen: false,
            tenkikbn: {
                '1': '治ゆ',
          
          '2': '死亡',
                '3': '中止',
                '8': '移行'
            },
            utagai: {
                'S': '疑い',
                'A': '急性',
                'SA': '疑いかつ急性',
                '1': '疑い',
                '2': '急性',
                '3': '疑いかつ急性'
            },
            byoumeiModal: {
                mode: null,
                title: null,
                data: undefined
            },
            byoumei_history: []
        }
    },
    created() {
        this.byoumei_history = this.data.byoumei_history
    },
    methods: {
        showByoumeiEdit(mode, data) {
            this.byoumeiModal.data = undefined
            let title = '病名登録'
            if(mode === 'edit') {
                title = '病名編集'
                this.byoumeiModal.data = data
            }
            this.byoumeiModal.mode = mode
            this.byoumeiModal.title = title
            this.editByoumeiOpen = true
        },
        utagaiDecode(value) {
            if(value) {
                return this.utagai[value]
            } else {
                return ''
            }
        },
        tenkiTransform(kbn) {
            if (kbn !== ' ') {
                return this.tenkikbn[kbn]
            }
            return ''
        },
        saveByoumei(bm) {
            this.loading = true
            bm.patient_ID = this.$store.getters.activePatient
            bm.shinsatu_ID = this.$store.getters.activeShinsatu
            bm.Disease_Single = bm.Disease_Single.Disease_Single_child.Disease_Single_Code
            delete bm['@attributes']

            this.$put('diseases/' + bm.patient_ID, bm)
            .then(result => {
                this.$emit('update')
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
            })
        }
    },
    computed: {
        byoumeiActive() {
            return this.data.byoumei.filter(item => !item.Disease_OutCome)
        },
        byoumeiFilter() {
            let filter = this.byoumei_history
            filter = Array.from(new Set(filter.map(a => a.khnbyomeicd)))
                .map(id => {
                return filter.find(a => a.khnbyomeicd === id)
            })
            return filter
        },
        byoumeiFiltered() {
            let returnArr = this.byoumei_history
            if (this.selectedByoumei.length > 0) {
                returnArr = this.byoumei_history.filter(i => this.selectedByoumei.includes(i.khnbyomeicd))                
            }
            if (this.selectedStartDate[0]) {
                returnArr = returnArr.filter(
                    i => this.$moment(i.creymd).isBetween(this.selectedStartDate[0], this.selectedStartDate[1], 'day', '[]')
                )
            }
            if (this.selectedEndDate[0]) {
                returnArr = returnArr.filter(
                    i => this.$moment(i.tenkiymd).isBetween(this.selectedEndDate[0], this.selectedEndDate[1], 'day', '[]')
                )
            }
            if (this.checkFilters.utagai) {
                returnArr = returnArr.filter(i => i.utagaiflg === '1' || i.utagaiflg === '3')
            }
            if (this.checkFilters.acute) {
                returnArr = returnArr.filter(i => i.utagaiflg === '2' || i.utagaiflg === '3')
            }
            if (this.checkFilters.main) {
                returnArr = returnArr.filter(i => i.syubyoflg === '1')
            }
            if (this.selectedOutcomes.length) {
                returnArr = returnArr.filter(i => this.selectedOutcomes.includes(i.tenkikbn))
            }
            return returnArr
        }
    },
    watch: {
        loading() {
            if (this.loading) {
                this.loadingElm = this.$vs.loading({
                    target: this.$refs.loadCont,
                    color: 'dark'
                })
            } else {
                this.loadingElm.close()
            }
        }
    }
}
</script>

<style scoped>
.landscape {
    max-width: 1000px;
    height: calc(100% - 20px)!important
}
</style>