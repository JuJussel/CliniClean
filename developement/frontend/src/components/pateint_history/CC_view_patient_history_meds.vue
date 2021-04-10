<template>
    <div 
        style="height: calc(100% - 20px); overflow: auto"
        v-bind:class="{landscape: landscape}"
        class="content-card customHeight"
        >
        <vs-table striped style="max-height: calc(100% - 60px)">
            <template #notFound>
                データなし
            </template>
            <template #header>
                <vs-row>
                    <vs-col w="6">
                        <vs-select
                            label="処方名"
                            filter
                            chip-max-width="129px"
                            collapse-chips
                            multiple
                            active
                            class="cc-dark-select"
                            placeholder="検索"
                            :key="medsFilter.length"
                            v-model="selectedMeds"
                            >
                                <vs-option
                                    v-for="item in medsFilter"
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
            </template>
            <template #thead>
                <vs-tr>
                    <vs-th sort @click="meds = $vs.sortData($event ,medsFiltered, 'name')">
                        処方名
                        </vs-th>
                    <vs-th style="min-width: 150px" sort @click="meds = $vs.sortData($event ,medsFiltered, 'date')">日付</vs-th>
                    <vs-th style="min-width: 150px">処方量</vs-th>
                </vs-tr>
            </template>
            <template #tbody>
                <vs-tr v-for="(tr, index) in medsFiltered" :key="index">
                    <vs-td> {{ tr.name }} </vs-td>
                    <vs-td><dateDisplay :date="tr.date"></dateDisplay></vs-td>
                    <vs-td>
                        <div>
                            {{ tr.var.amount }}
                            {{ tr.var.unit }}
                            {{ tr.var.times }}
                            {{ tr.var.timing.unit }}
                            分
                        </div>
                        <div> {{ tr.var.timing.name }} </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>

<script>


export default {
    props: {
        data: {
            type: Object
        },
        standalone: {
            default: false,
            type: Boolean
        },
        landscape: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            meds: [],
            tableData:[],
            selectedMeds: [],
            selectedDate: [],
            displayFilter: false
        }
    },
    methods: {
        showFilter(e, t) {
            e.stopPropagation()
            this[t] = !this[t]
        }
    },
    created() {
        this.meds = this.data.koui.filter(k => k.type === '25')
    },
    computed: {
        medsFilter() {
            let filter = this.data.koui.filter(k => k.type === '25')
            filter = Array.from(new Set(filter.map(a => a.kouiCode)))
                .map(id => {
                return filter.find(a => a.kouiCode === id)
            })
            return filter
        },
        medsFiltered() {
            let returnArr = this.meds
            if (this.selectedMeds.length > 0) {
                returnArr = this.meds.filter(i => this.selectedMeds.includes(i))                
            }
            if (this.selectedDate[0]) {
                returnArr = returnArr.filter(
                    i => this.$moment(i.date).isBetween(this.selectedDate[0], this.selectedDate[1], 'day', '[]')
                )
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
.landscape #table {
    height: calc(100% - 40px)!important
}
</style>