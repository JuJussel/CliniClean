<template>
    <div style="height: calc(100% - 80px); overflow: auto">
        <vs-table class="cc-vs-table-condensed" striped style="height: 550px">
            <template #notFound>登録なし</template>
            <template #thead>
                <vs-tr>
                    <vs-th style="min-width: 200px; position: sticky; left: 0; z-index: 2001">
                        <vs-checkbox v-model="allSelected" dark @input="toggleAll">バイタル</vs-checkbox>
                        <vs-button
                            @click="newVitalOpen = true"
                            icon
                            dark
                            size="small"
                            animation-type="scale"
                        >
                            <i class="fas fa-plus" style="font-size: 14px"></i>
                            <template #animate>登録</template>
                        </vs-button>
                    </vs-th>
                    <vs-th
                        v-for="date in dates"
                        :key="date"
                        style="min-width: 120px"
                    > 
                        <dateDisplay :date="date"></dateDisplay>
                    </vs-th>
                </vs-tr>
            </template>
            <template #tbody>
                <vs-tr
                    class="hover-fix"
                    v-for="(tr, index) in tableItems"
                    :key="index"
                >
                    <vs-td style="position: sticky; left: 0; z-index: 2000; background: inherit" v-bind:class="{'hover-override': index%2 == 0}">
                        <vs-checkbox dark v-model="tr.selected" @input="updateChart">{{ tr.name }}</vs-checkbox>
                    </vs-td>
                    <vs-td
                        v-for="date in dates"
                        :key="date"
                        style="text-align: center"
                    >
                        <span v-if="tr.dates[date]">
                            <vs-tooltip v-if="tr.dates[date].history.length >0">
                                {{ tr.dates[date].value }}
                                <template #tooltip>
                                    <div v-for="(h, i) in tr.dates[date].history" :key="i">
                                        {{ h }}
                                    </div>
                                </template>
                            </vs-tooltip>
                            <span v-else>{{ tr.dates[date].value }}</span>
                        </span>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <div style="margin-top: -40px">
            <h2>
                図表
            </h2>
            <div style="height: 350px; margin-top: 20px" v-bind:class="{hidden: !showChart}">
                <IEcharts @ready="onChartReady" :option="chartInit" :resizable="true"></IEcharts>
            </div>
            <div v-if="!showChart" style="margin-top: 20px">項目を選択してください</div>
        </div>
        <vs-dialog
            blur
            v-model="newVitalOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title">バイタル登録</h3>
            </template>
            <vitalNew
                v-if="newVitalOpen"
                @update="$emit('update')"
                @close="newVitalOpen = false"
            />
        </vs-dialog>
    </div>
</template>

<script>

import vitalNew from "../shared/vitalNew"
import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import Date_display from '../../../../clinicleanv3/src/components/shared/date_display.vue'


export default {
    props: [
        'data',
        'height'
    ],
    components: {
        IEcharts,
        vitalNew
    },
    data() {
        return {
            allSelected: false,
            tableItems: [],
            dates: [],
            newVitalOpen: false,
            chart: false,
            chartInit: {},
            chartOptions: {
                legend: {
                    data: [],
                    top: "bottom",
                    selected: false
                },
                color:[
                    "#009688",
                    "#00695c",
                    "#607d8b",
                    "#424242",
                    "#004d40",
                    "#90caf9",
                    "#353c44",
                    "#512da8",
                    "#ff5349",
                    "#29ab87",
                    "#5f0f0f",
                ],
                tooltip: {
                    trigger:"axis",
                    axisPointer:{
                        lineStyle:{
                            type:"dashed"
                        }
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {type: ['line', 'bar'], title: {line: 'ライン', bar: 'バー'}},
                        saveAsImage: {show: true, title: '保存'}
                    }
                },
                axisPointer:{
                    type:"shadow"
                },
                xAxis: [{
                    type: 'category',
                    splitLine: {show: true},
                    splitArea: {show: true},
                    data: []
                }],
                grid:{
                    left: '3%',
                    right: '4%',
                    bottom: '60px',
                    top: '3%',
                    containLabel: true
                },
                yAxis:[
                    {
                        min: 0,
                        max: function (value) {
                            return value.max * 1.2;
                        }
                    }
                ],
                series:[]
            },
            showChart: false,
        }
    },
    methods: {
        toggleAll() {
            let val = this.allSelected
            this.tableItems.forEach(item => item.selected = val)
            this.updateChart()
        },
        onChartReady(instance) {
            this.chart = instance
        },
        updateChart() {
            const val = this.selectedItems
            if (val.length < 1) {
                this.showChart = false
                return
            }
            this.showChart = true
            let xAxis = []
            val.forEach(item => {
                Object.keys(item.dates).forEach(date => {
                    if (xAxis.indexOf(date) === -1) {
                        xAxis.push(date)
                    }
                })
            })
            xAxis = xAxis.sort()
            this.chartOptions.xAxis[0].data = xAxis
            let seriesArray = []
            val.forEach(element => {
                this.chartOptions.legend.data.push(element.name)
                var seriesDataTemplate = {
                    connectNulls: true,
                    name: element.name,
                    data: [],
                    catID: element.vital_id,
                    type:"bar",
                    lineStyle:{
                        normal:{
                            width:3,
                            shadowColor:"rgba(0,0,0,0.4)",
                            shadowBlur:10,
                            shadowOffsetY:10
                        }
                    }
                }
                this.dates.forEach(date => {
                    seriesDataTemplate.data.push(null)
                })
                Object.keys(element.dates).forEach(item => {
                    let index = xAxis.findIndex(search => search === item)
                    seriesDataTemplate.data[index] = element.dates[item]
                })
                seriesArray.push(seriesDataTemplate)
            })
            this.chartOptions.series = seriesArray
            this.chart.setOption(this.chartOptions, true)
        },
        setData() {
            let rawArr = JSON.parse(JSON.stringify(this.data.vitals))
            rawArr = rawArr.filter(item => item.vital_id > 900)
            let returnArr = {}
            rawArr.forEach((item) => {
                let date = item.date.split(' ')[0]
                if (returnArr[item.vital_id]) {
                    if (returnArr[item.vital_id].dates[date]) {
                        returnArr[item.vital_id].dates[date].history.push(
                            item.date.split(' ')[1] + ': ' + item.value
                        )
                    } else {
                        returnArr[item.vital_id].dates[date] = {value: item.value, history: []}
                    }
                } else {
                    returnArr[item.vital_id] = {
                        dates: {},
                        selected: false,
                        vital_id: item.vital_id,
                        name: item.name,
                        id: item.id
                    }
                    returnArr[item.vital_id].dates[date] = {value: item.value, history: []}
                }
            })
            returnArr = Object.values(returnArr)
            this.tableItems = returnArr
            rawArr = JSON.parse(JSON.stringify(this.data.vitals))
            rawArr = rawArr.filter(item => item.vital_id > 900)
            returnArr = []
            rawArr.forEach((item) => {
                let date = item.date.split(' ')
                if (returnArr.indexOf(date[0]) === -1) {
                    returnArr.push(date[0])
                }
            })
            this.dates = returnArr

        }
    },
    created() {
        this.setData()
    },
    computed: {
        selectedItems() {
            if (this.allSelected) {
                return this.tableItems
            } else {
                return this.tableItems.filter(item => item.selected)
            }
        }
    },
    watch:{
        data() {
            this.setData()
        }
    }


}
</script>

<style scoped>
.hidden {
    display: none
}
</style>