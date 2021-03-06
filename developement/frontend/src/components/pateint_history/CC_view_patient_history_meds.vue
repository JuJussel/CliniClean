<template>
    <div style="height: calc(100% - 80px); overflow: auto; display: flex;flex-direction: column">
        <vs-row>
            <vs-col w="6">
                <vs-select
                    label="処方名"
                    filter
                    chip-max-width="129px"
                    collapse-chips
                    multiple
                    active
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
        <vs-row style="flex-grow: 1">
            <vs-table striped>
                <template #notFound>
                    データなし
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
        </vs-row>
    </div>
</template>

<script>


export default {
    props: [
        'data'
    ],
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

<style>
.test-enter-active, .test-leave-active {
    transition: all .5s;
}
.test-enter, .test-leave-to {
    opacity: 0;
}
.popper {
    border-radius: 14px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.3);
}
</style>