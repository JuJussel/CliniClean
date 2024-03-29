<template>
    <div v-bind:class="{landscape: landscape}" style="height: 100%; overflow: auto">
        <div class="content-card customHeight">
            <vs-table class="cc-vs-table-condensed" adaptive="tableItems" striped id="table">
                <template #notFound>登録なし</template>
                <template #thead>
                    <vs-tr>
                        <vs-th style="min-width: 200px; position: sticky; left: 0; z-index: 2001">
                            <vs-checkbox v-model="allSelected" dark @input="toggleAll">検索結果</vs-checkbox>
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
                            <vs-checkbox dark v-model="tr.selected" @input="updateChart">
                                <div style="display: flex">
                                    <div style="width: 150px">{{ tr.name }}</div>
                                    <div style="width: 150px">{{ tr.result }}</div>
                                </div>
                            </vs-checkbox>
                        </vs-td>
                        <vs-td
                            v-for="date in dates"
                            :key="date"
                            style="text-align: center"
                        >
                            {{ tr.dates[date] }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div class="content-card customHeight">
            <div class="cc-card-header">
                <h2>
                    図表
                </h2>
            </div>
            <div style="height: 350px; margin-top: 20px" v-bind:class="{hidden: !showChart}" id="chart">
                <IEcharts @ready="onChartReady" :option="chartInit" :resizable="true"></IEcharts>
            </div>
            <div v-if="!showChart" style="padding: 10px">項目を選択してください</div>
        </div>
    </div>
</template>

<script>

import IEcharts from 'vue-echarts-v3/src/lite.js'
import 'echarts/lib/component/legend'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'

export default {
    props: {
        data: Object,
        landscape: {
            type: Boolean,
            default: false
        }
    },
    components: {
        IEcharts
    },
    data() {
        return {
            allSelected: false,
            tableItems: [],
            dates: [],
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
                    data: [],
                    splitArea: {
                        show: true
                    },
                }],
                grid:{
                    left: '3%',
                    right: '4%',
                    bottom: '100px',
                    top: '3%',
                    containLabel: true
                },
                yAxis:[
                    {
                        min: 0,
                        max: function (value) {
                            return Math.floor(value.max * 1.2);
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
            let resultsArr = []
            let returnArr = {}
            let rawArr = JSON.parse(JSON.stringify(this.data.koui.filter(i => i.type === '60' || i.type === '90')))
            rawArr.forEach((item) => {
                let date = item.date.split(' ')[0]
                item.var.results.forEach(((result) => {
                    if (returnArr[result.kensa_code]) {
                        returnArr[result.kensa_code].dates[date] = result.value
                    } else {
                        let name = item.name
                        let resultName = result.name
                        if (item.type === "90") {
                            name = result.name.split(' - ')[0]
                            resultName = result.name.split(' - ')[1]
                        }
                        returnArr[result.kensa_code] = {
                            dates: {},
                            kensa_code: result.kensa_code,
                            name: name,
                            result: resultName,
                            unit: result.unit,
                            selected: false
                        }
                        returnArr[result.kensa_code].dates[date] = result.value
                    }

                }))
            })
            returnArr = Object.values(returnArr)
            this.tableItems = returnArr
            rawArr = JSON.parse(JSON.stringify(this.data.koui.filter(i => i.type === '60' || i.type === '90')))
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
.hover-fix:hover td {
    background: rgba(var(--vs-gray-2), 1)!important
}
.hover-override {
    background: white!important
}
.hidden {
    display: none
}
.landscape {
    display: flex;
}
.landscape > * {
    flex: 1
}
.landscape #table {
    height: 100%!important
}
.landscape #chart {
    height: 550px!important
}
</style>