<template>
    <div>
        Data Explorer
        <div>
            <vue-echarts
                :option="chartOptions"
                @ready="onReady"
                style="width: calc(100% - 30px); height: 100%"
            ></vue-echarts>
        </div>
    </div>
</template>

<script>
import { VueEcharts } from "vue3-echarts";
import { use } from "echarts/core";
import {
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    AxisPointerComponent,
    ToolboxComponent,
} from "echarts/components";

use([
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    AxisPointerComponent,
    ToolboxComponent,
]);

export default {
    props: {
        patientData: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: null
        }
    },
    components: {
        VueEcharts,
    },
    methods: {
        renderItem(params, api) {
            var categoryIndex = api.value(2)
            var start = api.coord([api.value(0), categoryIndex])
            var end = api.coord([api.value(1), categoryIndex])
            var height = api.size([0, 1])[1] * 0.7
            var rectShape = this.echarts.graphic.clipRectByRect({
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
            }, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            });
            return rectShape && {
                type: 'rect',
                shape: rectShape,
                style: api.style()
            };

        },
        selectChange(item) {
			this.$emit('kensaSelectChange', item)
		},
        onReady(instance, echarts) {
            this.ins = instance
            this.echarts = echarts
        },
        updateData() {
			this.ins.setOption(this.chartOptions, true)
        }
    },
    data() {
        return {
            varChartsSelect: [],
            chartDispOptions: {
                vital: {
                    type: 'line'
                }
			},
            fixedCharts: {
                karte: false,
                vital: true
            },
            ins: null,
            echarts: null
        }
    },
    computed: {
		varCharts() {
			let returnArray = []
			this.varChartsSelect.forEach(item => {
				returnArray.push({name: item.name, subName: item.subName, type: 'bar'})
			})
			return returnArray
		},
        seriesArray() {
            let returnArr = []
            if (this.fixedCharts.karte && this.fixedCharts.vital) {
                returnArr = [0,1]
            }
            else if (this.fixedCharts.karte || this.fixedCharts.vital) {
                returnArr = [0]
            }
            let start = returnArr.length
            this.varCharts.forEach(() => {
                returnArr.push(start)
                start++
            })
            return returnArr
        },
        dateAxis() {
            let returnArr = []
            if (this.fixedCharts.karte) {
                this.patientData.encounters.forEach(element => {
                    returnArr.push(element.date)
				});
				this.patientData.diseases.forEach(b => {
					let date = b.dispDateStart
					if (!returnArr.includes(date)) {
						returnArr.push(date)
					}
				})
				this.dataSet.byoumei.done.forEach(b => {
					let date = b.dispDateStart
					if (!returnArr.includes(date)) {
						returnArr.push(date)
					}
					date = b.dispDateEnd
					if (!returnArr.includes(date)) {
						returnArr.push(date)
					}
				})
				returnArr = Array.from(new Set(returnArr))
                returnArr.sort()
                return returnArr
            } else {
                if (this.fixedCharts.vital) {
                    this.dataSet.vital.dates.forEach(item =>{                    
                        let date = this.$moment(item).format('YYYY年MM月DD日')
                        if (!returnArr.includes(date)) {
                            returnArr.push(date)
                        }
                    })
                }
                this.varCharts.forEach(item => {
					let index = item.name
					let selectedKensa = this.dataSet.kensa.table.filter(i => i.name === index)
					selectedKensa.forEach(kensa => {
						let date = kensa.dispDate
						if (!returnArr.includes(date)) {
                            returnArr.push(date)
                        }
					})
                })
                returnArr.sort()
			}
			returnArr = Array.from(new Set(returnArr))
            return returnArr
		},
        xAxes() {
            let returnArr = []
            let gridIndex = 0
            if (this.fixedCharts.karte) {
                returnArr.push(
                    {   
						identifier: 'karte',
						type: 'value',
						boundaryGap : false,
						axisPointer:{show: true, snap: true, triggerTooltip: false, label: {show: false}},
						axisTick: { show: false},
						axisLabel: {show: false},
						splitLine: { show: false},
						data: this.dateAxis,
                        axisLine: { lineStyle: { color: '#777' } },
                        min: 0,
                        max: this.dateAxis.length -1,
                    }
                )
                gridIndex++
            }
            if (this.fixedCharts.vital) {
                returnArr.push(
                    {
						identifier: 'vital',
                        type: 'category',
                        gridIndex: gridIndex,
                        data: this.dateAxis,
                        scale: true,
						boundaryGap : false,
						axisPointer: { show: true, triggerTooltip: false},
                        splitLine: {show: false},
                        axisLabel: {show: true},
                        axisTick: {show: false},
                        axisLine: { lineStyle: { color: '#777' } },
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax', 
                    }
                )
                gridIndex++
            }
            this.varCharts.forEach(item => {
                returnArr.push(
                    {
						identifier: item.name + item.subName,
                        type: 'category',
                        gridIndex: gridIndex,
                        data: this.dateAxis,
                        scale: true,
						boundaryGap : false,
						axisPointer: { show: true, triggerTooltip: false},
                        splitLine: {show: false},
                        axisLabel: {show: false},
                        axisTick: {show: false},
                        axisLine: { lineStyle: { color: '#777' } },
                        splitNumber: 20,
                        min: 'dataMin',
						max: 'dataMax',
						name: item.name  + item.subName,
						nameGap: -190,
						nameLocation: 'middle',
						nameTextStyle: {
							fontWeight: 'bold',
							fontSize: 16
						}
                    }
                )
                gridIndex++
            })
            return returnArr
        },
        yAxes() {
            let returnArr = []
            let gridIndex = 0
            if (this.fixedCharts.karte) {
                returnArr.push(
                    {   
						identifier: 'karte',
						scale: true,
						data: [],
                        axisLine: { lineStyle: { color: '#777' } },
						axisTick: { show: false },
						axisPointer: { show: true, type: 'shadow', triggerTooltip: false},
						splitArea: { show: true, interval: 0},
                        axisLabel: {
                            formatter: function(v) {
								return v
							}
                        }
                    }
                )
                gridIndex++
            }
            if (this.fixedCharts.vital) {
                returnArr.push(
                    {
						identifier: 'vital',
                        scale: true,
                        gridIndex: gridIndex,
						splitNumber: 2,
						axisPointer: { show: true, triggerTooltip: false, snap: true},
                        axisLabel: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        splitLine: {show: false}
                    }
                )
                gridIndex++
            }
            this.varCharts.forEach(item => {
                returnArr.push(
                    {
						identifier: item.name + item.subName,
                        scale: true,
                        gridIndex: gridIndex,
						splitNumber: 2,
						min: 0,
                        splitLine: {show: false}
                    }
                )
                gridIndex++
            })
            return returnArr
        },
        series() {
			let meta = {}
			let dateCount = this.dateAxis.length
			let returnArr = []
			//Karte
			if (this.fixedCharts.karte) {
				let xAxisIndex = this.xAxes.findIndex(item => item.identifier === 'karte')
				let yAxisIndex = this.yAxes.findIndex(item => item.identifier === 'karte')					
				let axisMeta = []
				//Byoumei
				if (this.dataSet.byoumei.active.length > 0) {
					this.dataSet.byoumei.active.forEach(b => {
						let start1 = b.dispDateStart
						let start = this.dateAxis.findIndex(d => d === start1)
						let end = this.dateAxis.length - 1
						let check = axisMeta.filter(m => m.name === 'byoumei')							
						let done = false
						check.some(function(c) {
							let has = false
							c.dates.some(function(el) {
								if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
									has = true
									return true
								}
							})
							if (!has) {
								c.dates.push([start,end,b.name,b.ID,start1,this.dateAxis[end]])
								done = true
								return true
							}
						})
						if(!done) {
							axisMeta.push({
								name: 'byoumei',
								title: '病名',
								meta: [start1, this.dateAxis[end]],
								color: '#403b2d',
								dates: [[start,end,b.name,b.ID,start1,false]]
							})
						}
					})
				}
				if (this.dataSet.byoumei.done.length > 0) {
					this.dataSet.byoumei.done.forEach(b => {
						let start1 = b.dispDateStart
						let start = this.dateAxis.findIndex(d => d === start1)
						let end1 = b.dispDateEnd
						let end = this.dateAxis.findIndex(d => d === end1)
						let check = axisMeta.filter(m => m.name === 'byoumei')							
						let done = false
						check.some(function(c) {
							let has = false
							c.dates.some(function(el) {
								if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
									has = true
									return true
								}
							})
							if (!has) {
								c.dates.push([start,end,b.name,b.ID,start1,end1])
								done = true
								return true
							}
						})
						if(!done) {
							axisMeta.push({
								name: 'byoumei',
								title: '病名',
								meta: [start1, end1],
								color: '#403b2d',
								dates: [[start,end,b.name,b.ID,start1,end1]]
							})
						}						
					})
				}
				//Kensa
				let kensaItems = []
				this.dataSet.kensa.table.forEach(k => {
					let startDate = k.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					kensaItems.push([start,end,k.name])
				})
				axisMeta.push({name: 'kensa', title: '検査', color: '#f1c454', dates: kensaItems})
				//Operation
				let operItems = []
				this.dataSet.oper.forEach(o => {
					let startDate = o.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					operItems.push([start,end,o.short_name_kanji])
				})
				axisMeta.push({name: 'oper', title: '手術', color: '#658a55', dates: operItems})
				//prev Vac
				let prevVacItems = []
				this.dataSet.prevVac.forEach(v => {
					let startDate = v.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					prevVacItems.push([start,end,v.med_name])
				})
				axisMeta.push({name: 'prevVac', title: '予接', color: '#d97e78', dates: prevVacItems})
				//Shot
				let shotItems = []
				this.dataSet.shot.forEach(s => {
					let startDate = s.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					shotItems.push([start,end,s.med_name])
				})
				axisMeta.push({name: 'shot', title: '注射', color: '#3751cd', dates: shotItems})
				//Treatment
				let treatItems = []
				this.dataSet.treat.forEach(t => {
					let startDate = t.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					treatItems.push([start,end,t.short_name_kanji])
				})
				axisMeta.push({name: 'treat', title: '処置', color: '#f7882f', dates: treatItems})
				//Shohou
				this.dataSet.shohou.forEach(s => {
					let start = this.dateAxis.findIndex(d => d === s.dispDate)
					let end = ""
					let meta = {start: s.dispDate, end: s.times + s.timesUnit}
					if (s.timesUnit === "日") {								
						end = this.$moment(s.dispDate, 'YYYY年MM月DD日').add(s.times, 'days').format('YYYY年MM月DD日')
						let endInd = this.dateAxis.findIndex(d => d === end)
						let temp = ""
						if (endInd < 0) {
							this.dateAxis.some(d => {
								if(end < d) {
									temp = d
									return true
								}
							})
							end = this.dateAxis.findIndex(d => d === temp) - 0.5
						} else {
							end = endInd
						}
					} else {
						end = start + 0.5
					}
					let check = axisMeta.filter(m => m.name === 'shohou')							
					let done = false
					check.some(function(c) {
						let has = false
						c.dates.some(function(el) {
							if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
								has = true
								return true
							}
						})
						if (!has) {
							c.dates.push([start,end,s.med_name,s.ID,meta])
							done = true
							return true
						}
					})
					if(!done) {
						axisMeta.push({name: 'shohou', title: '処方', color: '#8b5789', dates: [[start,end,s.med_name,s.ID,meta]]})
					}
				})						
				//Teiki Shohou
				this.dataSet.teikiShohou.forEach(s => {
					let start = this.dateAxis.findIndex(d => d === s.start_date)
					if (start < 0) {
						this.dateAxis.some(d => {
							if(s.start_date < d) {
								start = this.dateAxis.findIndex(i => i === d) - 0.75
								return true
							}
						})
					}
					let end = this.dateAxis.findIndex(d => d === s.end_date)
					if (end < 0) {
						this.dateAxis.some(d => {
							if(s.end_date < d) {
								end = this.dateAxis.findIndex(i => i === d) - 0.25
								return true
							}
						})
					}
					let check = axisMeta.filter(m => m.name === 'teikiShohou')							
					let done = false
					check.some(function(c) {
						let has = false
						c.dates.some(function(el) {
							if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
								has = true
								return true
							}
						})
						if (!has) {
							c.dates.push([start,end,s.med_name,s.ID,s.start_date,s.end_date])
							done = true
							return true
						}
					})
					if(!done) {
						axisMeta.push({name: 'teikiShohou', title: '定処', color: '9c7f5f', dates: [[start,end,s.med_name,s.ID,s.start_date,s.end_date]]})
					}
				})
				meta = axisMeta
				let baseArr = []
				Object.entries(meta).forEach(m => {
					m[1].dates.forEach(d => {
						baseArr.push(
							{
								name: d[2],
								title: m[1].title,
								itemStyle: {
									color: m[1].color
								},
								value: [
									d[0],
									d[1],
									parseInt(m[0]),
									d[4],
									d[5],
								]
							}
						)
					})
				})
				let karteTemplate = {
					type: 'custom',
					data: baseArr,
					tooltip: {
						show: true, 
						position: 'top',
						hideDelay: 1000,
						extraCssText: 'max-height: 200px; overflow: auto',
						formatter: function(item) {
							if (Array.isArray(item.name)) {
								let string = ""
								item.name.forEach(si => {
									string = string + si.name + "<br />"
								})
								return string
							} else {
								if (item.data.title === '病名') {
									let meta = "<br />" + item.data.value[3]
									if (item.data.value[4]) {
										meta = meta + " - " + item.data.value[4]
									} else {
										meta = meta + " - 本日"
									}
									return item.name +  meta
								} if (item.data.title === '処方') {
									let meta = "<br />" + item.data.value[3].start + " - " + item.data.value[3].end
									return item.name +  meta
								}
								if (item.data.title === '定処') {
									let meta = "<br />" + item.data.value[3] + " - " + item.data.value[4]
									return item.name +  meta
								}
								return item.name
							}
						}
					},
					renderItem: this.renderItem,
					xAxisIndex: xAxisIndex,
					yAxisIndex: yAxisIndex,
					encode: {
						x: [0, 1],
						y: 2
					},
				}
				returnArr.push(karteTemplate)
			}
			//Vital
			if (this.fixedCharts.vital) {
				let xAxisIndex = this.xAxes.findIndex(item => item.identifier === 'vital')
				let yAxisIndex = this.yAxes.findIndex(item => item.identifier === 'vital')	
				Object.entries(this.dataSet.vital.measures).forEach(vitalItem => {
					let baseArr = new Array(dateCount).fill(null)
					Object.entries(vitalItem[1]).forEach(subItem => {
						let date = this.$moment(subItem[0],'YYYY-MM-DD').format('YYYY年MM月DD日')
						let index = this.dateAxis.indexOf(date)
						if (index > -1) {
							baseArr[index] = subItem[1]
						}
					})
					let vitalTemplate = {
						type: this.chartDispOptions.vital.type,
						data: baseArr,
						name: vitalItem[1].name,
						xAxisIndex: xAxisIndex,
						yAxisIndex: yAxisIndex
					}
					returnArr.push(vitalTemplate)
				})
			}
			//Kensa
			this.varCharts.forEach(item => {
				let index = item.name
				let fullIndex = item.name + item.subName
				let type = item.type
				let subName = item.subName
				let xAxisIndex = this.xAxes.findIndex(item => item.identifier === fullIndex)
				let yAxisIndex = this.yAxes.findIndex(item => item.identifier === fullIndex)
				let baseArr = new Array(dateCount).fill(null)
				let results = this.dataSet.kensa.table.filter(k => k.name_bunseki === subName)
				results.forEach(r => {
					let date = r.dispDate
					let index2 = this.dateAxis.indexOf(date)
					if (index2 > -1) {						
						baseArr[index2] = r.value
					} else {
						this.dateAxis.push(date)
						this.dateAxis.sort()
						let index2 = this.dateAxis.indexOf(date)
						baseArr[index2] = r.value
					}
				})
				let kensaTemplate = {
					type: type,
					data: baseArr,
					name: index,
					label: {show: true, position: 'top'},
					xAxisIndex: xAxisIndex,
					yAxisIndex: yAxisIndex
				}
				returnArr.push(kensaTemplate)
			})

			let yAxisIndex = this.yAxes.findIndex(item => item.identifier === 'karte')
			if (yAxisIndex > -1) {
				meta.forEach(item => {
					this.yAxes[yAxisIndex].data.push(item.title)
				})
			}
            return {meta: meta, data: returnArr}
		},
		grid() {
			let height = 150
			let returnArr = [
				{
					left: 50,
					right: 20,
					top: 110,
					height: height
				}
			]
			
			let length = this.seriesArray.length -1
			let i = 0
			while (i < length) {
				let top = 110 + height + height*i + 70*(i+1)
				let baseArr = {
					left: 50,
					right: 20,
					top: top,
					height: height
				}				
				returnArr.push(baseArr)
				i++
			}
			return returnArr
		},
		contHeight() {
			let height = 150
			let charts = this.seriesArray.length
			height = 170 + (height+70)*charts
			return height + "px!important"
		},
        chartOptions() {
            return {
				animation: false,
				legend: {
					top: "top",
				},
                color: [
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
                    "#5f0f0f"
                ],
                title: {
                    show: false
                },
                tooltip: {
					enterable: true,
					backgroundColor: 'rgba(245, 245, 245, 0.8)',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
					}
				},
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#777'
                    }
                },
                dataZoom: [{
                    type: 'slider',
                    xAxisIndex: this.seriesArray,
                    realtime: true,
                    start: 0,
                    end: 100,
                    top: 65,
                    height: 20,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '120%',
                    handleStyle: {
                        color: '#959da1'
                    },
					fillerColor: 'rgba(149, 157, 161, 0.4)',
					labelFormatter: function(value) {
						let index = Math.round(value)
						let returnData = this.dateAxis[index]
						return returnData
					}

                }],
                xAxis: this.xAxes,
                yAxis: this.yAxes,
                grid: this.grid,
                series: this.series.data
            }
        }
	}
};
</script>

<!--
<template>
    <div style="overflow: hidden; height: 100%">
		<div style="display: flex">
			<el-switch
				v-model="fixedCharts.karte"
				active-text="カルテ表示"
				style="height: 40px">
			</el-switch>
			<el-switch
				v-model="fixedCharts.vital"
				active-text="バイタル表示"
				style="margin-left: 30px; height: 40px">
			</el-switch>
			<span style="margin-top: 10px; margin-left: 30px">検査表示:	</span>
			<el-select @change="selectChange" value-key="key" multiple v-model="varChartsSelect" placeholder="選択" style="margin-left: 10px; width: 320px">
				<el-option
				v-for="(item) in dataSet.kensaResultsArr"
				:key="item.key"
				:label="item.name + ' ' + item.subName"
				:value="item">
				</el-option>
			</el-select>
		</div>
		<div style="max-height:calc(100% - 50px); overflow: auto">
			<div v-bind:style="{height: contHeight}">
                < VueEcharts :option="chartOptions" @ready="onReady" style="width: calc(100% - 30px); height: 100%"></ VueEcharts>
			</div>
		</div>
    </div>
</template>

<script>


    import  VueEcharts from 'vue-echarts-v3/src/lite.js'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/chart/line'
	import 'echarts/lib/chart/bar'
	import 'echarts/lib/chart/custom.js'
	import 'echarts/lib/component/toolbox'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/dataZoom.js'
    import 'echarts/lib/component/dataZoomInside.js'
    import 'echarts/lib/component/axisPointer.js'

export default {
    components: { VueEcharts},
    props: [
		'dataSet',
		'varChartsSelectPre'
    ],
    computed: {
		varCharts() {
			let returnArray = []
			this.varChartsSelect.forEach(item => {
				returnArray.push({name: item.name, subName: item.subName, type: 'bar'})
			})
			return returnArray
		},
        seriesArray() {
            let returnArr = []
            if (this.fixedCharts.karte && this.fixedCharts.vital) {
                returnArr = [0,1]
            }
            else if (this.fixedCharts.karte || this.fixedCharts.vital) {
                returnArr = [0]
            }
            let start = returnArr.length
            this.varCharts.forEach(item => {
                returnArr.push(start)
                start++
            })
            return returnArr
        },
        dateAxis() {
            let returnArr = []
            if (this.fixedCharts.karte) {
                this.dataSet.kartes.forEach(element => {
                    returnArr.push(element.dispDate)
				});
				this.dataSet.byoumei.active.forEach(b => {
					let date = b.dispDateStart
					if (!returnArr.includes(date)) {
						returnArr.push(date)
					}
				})
				this.dataSet.byoumei.done.forEach(b => {
					let date = b.dispDateStart
					if (!returnArr.includes(date)) {
						returnArr.push(date)
					}
					date = b.dispDateEnd
					if (!returnArr.includes(date)) {
						returnArr.push(date)
					}
				})
				returnArr = Array.from(new Set(returnArr))
                returnArr.sort()
                return returnArr
            } else {
                if (this.fixedCharts.vital) {
                    this.dataSet.vital.dates.forEach(item =>{                    
                        let date = this.$moment(item).format('YYYY年MM月DD日')
                        if (!returnArr.includes(date)) {
                            returnArr.push(date)
                        }
                    })
                }
                this.varCharts.forEach(item => {
					let index = item.name
					let selectedKensa = this.dataSet.kensa.table.filter(i => i.name === index)
					selectedKensa.forEach(kensa => {
						let date = kensa.dispDate
						if (!returnArr.includes(date)) {
                            returnArr.push(date)
                        }
					})
                })
                returnArr.sort()
			}
			returnArr = Array.from(new Set(returnArr))
            return returnArr
		},
        xAxes() {
            let returnArr = []
            let gridIndex = 0
            if (this.fixedCharts.karte) {
                returnArr.push(
                    {   
						identifier: 'karte',
						type: 'value',
						boundaryGap : false,
						axisPointer:{show: true, snap: true, triggerTooltip: false, label: {show: false}},
						axisTick: { show: false},
						axisLabel: {show: false},
						splitLine: { show: false},
						data: this.dateAxis,
                        axisLine: { lineStyle: { color: '#777' } },
                        min: 0,
                        max: this.dateAxis.length -1,
                    }
                )
                gridIndex++
            }
            if (this.fixedCharts.vital) {
                returnArr.push(
                    {
						identifier: 'vital',
                        type: 'category',
                        gridIndex: gridIndex,
                        data: this.dateAxis,
                        scale: true,
						boundaryGap : false,
						axisPointer: { show: true, triggerTooltip: false},
                        splitLine: {show: false},
                        axisLabel: {show: true},
                        axisTick: {show: false},
                        axisLine: { lineStyle: { color: '#777' } },
                        splitNumber: 20,
                        min: 'dataMin',
                        max: 'dataMax', 
                    }
                )
                gridIndex++
            }
            this.varCharts.forEach(item => {
                returnArr.push(
                    {
						identifier: item.name + item.subName,
                        type: 'category',
                        gridIndex: gridIndex,
                        data: this.dateAxis,
                        scale: true,
						boundaryGap : false,
						axisPointer: { show: true, triggerTooltip: false},
                        splitLine: {show: false},
                        axisLabel: {show: false},
                        axisTick: {show: false},
                        axisLine: { lineStyle: { color: '#777' } },
                        splitNumber: 20,
                        min: 'dataMin',
						max: 'dataMax',
						name: item.name  + item.subName,
						nameGap: -190,
						nameLocation: 'middle',
						nameTextStyle: {
							fontWeight: 'bold',
							fontSize: 16
						}
                    }
                )
                gridIndex++
            })
            return returnArr
        },
        yAxes() {
            let returnArr = []
            let gridIndex = 0
            if (this.fixedCharts.karte) {
                returnArr.push(
                    {   
						identifier: 'karte',
						scale: true,
						data: [],
                        axisLine: { lineStyle: { color: '#777' } },
						axisTick: { show: false },
						axisPointer: { show: true, type: 'shadow', triggerTooltip: false},
						splitArea: { show: true, interval: 0},
                        axisLabel: {
                            formatter: function(v, i) {
								return v
							}
                        }
                    }
                )
                gridIndex++
            }
            if (this.fixedCharts.vital) {
                returnArr.push(
                    {
						identifier: 'vital',
                        scale: true,
                        gridIndex: gridIndex,
						splitNumber: 2,
						axisPointer: { show: true, triggerTooltip: false, snap: true},
                        axisLabel: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        splitLine: {show: false}
                    }
                )
                gridIndex++
            }
            this.varCharts.forEach(item => {
                returnArr.push(
                    {
						identifier: item.name + item.subName,
                        scale: true,
                        gridIndex: gridIndex,
						splitNumber: 2,
						min: 0,
                        splitLine: {show: false}
                    }
                )
                gridIndex++
            })
            return returnArr
        },
        series() {
			let meta = {}
			let that = this
			let dateCount = this.dateAxis.length
			let returnArr = []
			let err = false
			//Karte
			if (this.fixedCharts.karte) {
				let xAxisIndex = this.xAxes.findIndex(item => item.identifier === 'karte')
				let yAxisIndex = this.yAxes.findIndex(item => item.identifier === 'karte')					
				let yAxisLength = this.dateAxis.length
				this.dataSet.kartes.forEach(karte => {
					let date = karte.dispDate
					let start = this.dateAxis.find(hs => hs === date)
					let end = start++
					let name = '一般診断'
					if(karte.type === '6') {
						name = '健康診断'
					}
					let dispData = {
						name: name, 
						value: [
							start,
							end,
							0]
					}
				})
				let axisMeta = []
				//Byoumei
				if (this.dataSet.byoumei.active.length > 0) {
					this.dataSet.byoumei.active.forEach(b => {
						let start1 = b.dispDateStart
						let start = this.dateAxis.findIndex(d => d === start1)
						let end = this.dateAxis.length - 1
						let check = axisMeta.filter(m => m.name === 'byoumei')							
						let done = false
						check.some(function(c) {
							let has = false
							c.dates.some(function(el) {
								if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
									has = true
									return true
								}
							})
							if (!has) {
								c.dates.push([start,end,b.name,b.ID,start1,this.dateAxis[end]])
								done = true
								return true
							}
						})
						if(!done) {
							axisMeta.push({
								name: 'byoumei',
								title: '病名',
								meta: [start1, this.dateAxis[end]],
								color: '#403b2d',
								dates: [[start,end,b.name,b.ID,start1,false]]
							})
						}
					})
				}
				if (this.dataSet.byoumei.done.length > 0) {
					this.dataSet.byoumei.done.forEach(b => {
						let start1 = b.dispDateStart
						let start = this.dateAxis.findIndex(d => d === start1)
						let end1 = b.dispDateEnd
						let end = this.dateAxis.findIndex(d => d === end1)
						let check = axisMeta.filter(m => m.name === 'byoumei')							
						let done = false
						check.some(function(c) {
							let has = false
							c.dates.some(function(el) {
								if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
									has = true
									return true
								}
							})
							if (!has) {
								c.dates.push([start,end,b.name,b.ID,start1,end1])
								done = true
								return true
							}
						})
						if(!done) {
							axisMeta.push({
								name: 'byoumei',
								title: '病名',
								meta: [start1, end1],
								color: '#403b2d',
								dates: [[start,end,b.name,b.ID,start1,end1]]
							})
						}						
					})
				}
				//Kensa
				let kensaItems = []
				this.dataSet.kensa.table.forEach(k => {
					let startDate = k.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					kensaItems.push([start,end,k.name])
				})
				axisMeta.push({name: 'kensa', title: '検査', color: '#f1c454', dates: kensaItems})
				//Operation
				let operItems = []
				this.dataSet.oper.forEach(o => {
					let startDate = o.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					operItems.push([start,end,o.short_name_kanji])
				})
				axisMeta.push({name: 'oper', title: '手術', color: '#658a55', dates: operItems})
				//prev Vac
				let prevVacItems = []
				this.dataSet.prevVac.forEach(v => {
					let startDate = v.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					prevVacItems.push([start,end,v.med_name])
				})
				axisMeta.push({name: 'prevVac', title: '予接', color: '#d97e78', dates: prevVacItems})
				//Shot
				let shotItems = []
				this.dataSet.shot.forEach(s => {
					let startDate = s.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					shotItems.push([start,end,s.med_name])
				})
				axisMeta.push({name: 'shot', title: '注射', color: '#3751cd', dates: shotItems})
				//Treatment
				let treatItems = []
				this.dataSet.treat.forEach(t => {
					let startDate = t.dispDate
					let start = this.dateAxis.findIndex(d => d === startDate)
					let end = start + 0.5
					treatItems.push([start,end,t.short_name_kanji])
				})
				axisMeta.push({name: 'treat', title: '処置', color: '#f7882f', dates: treatItems})
				//Shohou
				this.dataSet.shohou.forEach(s => {
					let start = this.dateAxis.findIndex(d => d === s.dispDate)
					let end = ""
					let meta = {start: s.dispDate, end: s.times + s.timesUnit}
					if (s.timesUnit === "日") {								
						end = this.$moment(s.dispDate, 'YYYY年MM月DD日').add(s.times, 'days').format('YYYY年MM月DD日')
						let endInd = this.dateAxis.findIndex(d => d === end)
						let temp = ""
						if (endInd < 0) {
							this.dateAxis.some(d => {
								if(end < d) {
									temp = d
									return true
								}
							})
							end = this.dateAxis.findIndex(d => d === temp) - 0.5
						} else {
							end = endInd
						}
					} else {
						end = start + 0.5
					}
					let check = axisMeta.filter(m => m.name === 'shohou')							
					let done = false
					check.some(function(c) {
						let has = false
						c.dates.some(function(el) {
							if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
								has = true
								return true
							}
						})
						if (!has) {
							c.dates.push([start,end,s.med_name,s.ID,meta])
							done = true
							return true
						}
					})
					if(!done) {
						axisMeta.push({name: 'shohou', title: '処方', color: '#8b5789', dates: [[start,end,s.med_name,s.ID,meta]]})
					}
				})						
				//Teiki Shohou
				this.dataSet.teikiShohou.forEach(s => {
					let start = this.dateAxis.findIndex(d => d === s.start_date)
					if (start < 0) {
						this.dateAxis.some(d => {
							if(s.start_date < d) {
								start = this.dateAxis.findIndex(i => i === d) - 0.75
								return true
							}
						})
					}
					let end = this.dateAxis.findIndex(d => d === s.end_date)
					if (end < 0) {
						this.dateAxis.some(d => {
							if(s.end_date < d) {
								end = this.dateAxis.findIndex(i => i === d) - 0.25
								return true
							}
						})
					}
					let check = axisMeta.filter(m => m.name === 'teikiShohou')							
					let done = false
					check.some(function(c) {
						let has = false
						c.dates.some(function(el) {
							if ((start >= el[0] && start <= el[1]) || (end >= el[0] && end <= el[1])) {
								has = true
								return true
							}
						})
						if (!has) {
							c.dates.push([start,end,s.med_name,s.ID,s.start_date,s.end_date])
							done = true
							return true
						}
					})
					if(!done) {
						axisMeta.push({name: 'teikiShohou', title: '定処', color: '9c7f5f', dates: [[start,end,s.med_name,s.ID,s.start_date,s.end_date]]})
					}
				})
				meta = axisMeta
				let axesArr = ['カルテ']
				let baseArr = []
				Object.entries(meta).forEach(m => {
					m[1].dates.forEach(d => {
						baseArr.push(
							{
								name: d[2],
								title: m[1].title,
								itemStyle: {
									color: m[1].color
								},
								value: [
									d[0],
									d[1],
									parseInt(m[0]),
									d[4],
									d[5],
								]
							}
						)
					})
				})
				function renderItem(params, api) {
					var categoryIndex = api.value(2)
					var start = api.coord([api.value(0), categoryIndex])
					var end = api.coord([api.value(1), categoryIndex])
					var height = api.size([0, 1])[1] * 0.7
					var rectShape = that.echarts.graphic.clipRectByRect({
						x: start[0],
						y: start[1] - height / 2,
						width: end[0] - start[0],
						height: height
					}, {
						x: params.coordSys.x,
						y: params.coordSys.y,
						width: params.coordSys.width,
						height: params.coordSys.height
					});

					return rectShape && {
						type: 'rect',
						shape: rectShape,
						style: api.style()
					};

				}
				let karteTemplate = {
					type: 'custom',
					data: baseArr,
					tooltip: {
						show: true, 
						position: 'top',
						hideDelay: 1000,
						extraCssText: 'max-height: 200px; overflow: auto',
						formatter: function(item) {
							if (Array.isArray(item.name)) {
								let string = ""
								item.name.forEach(si => {
									string = string + si.name + "<br />"
								})
								return string
							} else {
								if (item.data.title === '病名') {
									let meta = "<br />" + item.data.value[3]
									if (item.data.value[4]) {
										meta = meta + " - " + item.data.value[4]
									} else {
										meta = meta + " - 本日"
									}
									return item.name +  meta
								} if (item.data.title === '処方') {
									let meta = "<br />" + item.data.value[3].start + " - " + item.data.value[3].end
									return item.name +  meta
								}
								if (item.data.title === '定処') {
									let meta = "<br />" + item.data.value[3] + " - " + item.data.value[4]
									return item.name +  meta
								}
								return item.name
							}
						}
					},
					renderItem: renderItem,
					xAxisIndex: xAxisIndex,
					yAxisIndex: yAxisIndex,
					encode: {
						x: [0, 1],
						y: 2
					},
				}
				returnArr.push(karteTemplate)
			}
			//Vital
			if (this.fixedCharts.vital) {
				let xAxisIndex = this.xAxes.findIndex(item => item.identifier === 'vital')
				let yAxisIndex = this.yAxes.findIndex(item => item.identifier === 'vital')	
				Object.entries(this.dataSet.vital.measures).forEach(vitalItem => {
					let baseArr = new Array(dateCount).fill(null)
					Object.entries(vitalItem[1]).forEach(subItem => {
						let date = this.$moment(subItem[0],'YYYY-MM-DD').format('YYYY年MM月DD日')
						let index = this.dateAxis.indexOf(date)
						if (index > -1) {
							baseArr[index] = subItem[1]
						}
					})
					let vitalTemplate = {
						type: this.chartDispOptions.vital.type,
						data: baseArr,
						name: vitalItem[1].name,
						xAxisIndex: xAxisIndex,
						yAxisIndex: yAxisIndex
					}
					returnArr.push(vitalTemplate)
				})
			}
			//Kensa
			this.varCharts.forEach(item => {
				let index = item.name
				let fullIndex = item.name + item.subName
				let type = item.type
				let subName = item.subName
				let xAxisIndex = this.xAxes.findIndex(item => item.identifier === fullIndex)
				let yAxisIndex = this.yAxes.findIndex(item => item.identifier === fullIndex)
				let baseArr = new Array(dateCount).fill(null)
				let results = this.dataSet.kensa.table.filter(k => k.name_bunseki === subName)
				results.forEach(r => {
					let date = r.dispDate
					let index2 = this.dateAxis.indexOf(date)
					if (index2 > -1) {						
						baseArr[index2] = r.value
					} else {
						this.dateAxis.push(date)
						this.dateAxis.sort()
						let index2 = this.dateAxis.indexOf(date)
						baseArr[index2] = r.value
					}
				})
				let kensaTemplate = {
					type: type,
					data: baseArr,
					name: index,
					label: {show: true, position: 'top'},
					xAxisIndex: xAxisIndex,
					yAxisIndex: yAxisIndex
				}
				returnArr.push(kensaTemplate)
			})

			let yAxisIndex = this.yAxes.findIndex(item => item.identifier === 'karte')
			if (yAxisIndex > -1) {
				meta.forEach(item => {
					this.yAxes[yAxisIndex].data.push(item.title)
				})
			}
            return {meta: meta, data: returnArr}
		},
		grid() {
			let height = 150
			let returnArr = [
				{
					left: 50,
					right: 20,
					top: 110,
					height: height
				}
			]
			
			let length = this.seriesArray.length -1
			let i = 0
			while (i < length) {
				let top = 110 + height + height*i + 70*(i+1)
				let baseArr = {
					left: 50,
					right: 20,
					top: top,
					height: height
				}				
				returnArr.push(baseArr)
				i++
			}
			return returnArr
		},
		contHeight() {
			let height = 150
			let charts = this.seriesArray.length
			height = 170 + (height+70)*charts
			return height + "px!important"
		},
        chartOptions() {
			let that = this
            return {
				animation: false,
				legend: {
					top: "top",
				},
                color: [
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
                    "#5f0f0f"
                ],
                title: {
                    show: false
                },
                tooltip: {
					enterable: true,
					backgroundColor: 'rgba(245, 245, 245, 0.8)',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    textStyle: {
                        color: '#000'
					}
				},
                axisPointer: {
                    link: {xAxisIndex: 'all'},
                    label: {
                        backgroundColor: '#777'
                    }
                },
                dataZoom: [{
                    type: 'slider',
                    xAxisIndex: this.seriesArray,
                    realtime: true,
                    start: 0,
                    end: 100,
                    top: 65,
                    height: 20,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '120%',
                    handleStyle: {
                        color: '#959da1'
                    },
					fillerColor: 'rgba(149, 157, 161, 0.4)',
					labelFormatter: function(value, valueStr) {
						let index = Math.round(value)
						let returnData = that.dateAxis[index]
						return returnData
					}

                }],
                xAxis: this.xAxes,
                yAxis: this.yAxes,
                grid: this.grid,
                series: this.series.data
            }
        }
	},
    data:  function() {
        return {
			varChartsSelect: [],
            chartDispOptions: {
                vital: {
                    type: 'line'
                }
			},
            fixedCharts: {
                karte: false,
                vital: true
            },
            ins: null,
            echarts: null
        }
	},
	watch: {
		'varChartsSelectPre'() {
			this.varChartsSelect = this.varChartsSelectPre
		},
		'chartOptions': {
			handler: function() {
				this.updateData()
			},
			deep: true
		},
		'contHeight'() {
			if (this.ins !== null) {
				this.ins.resize({height: this.contHeight})
			}
		}

	},
    methods: {
		removeTag(item) {
			//this.$emit('removeKensa', item)
		},
		selectChange(item) {
			this.$emit('kensaSelectChange', item)
		},
        onReady(instance, echarts) {
            const that = this
            that.ins = instance
            that.echarts = echarts
        },
        updateData() {
			this.ins.setOption(this.chartOptions, true)
        }
    }
}
</script>

<style scoped>
</style>
<style>
</style>


-->