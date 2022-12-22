<template>
    <div>
        <vue-echarts
            :option="computedOptions"
            style="height: 500px"
            ref="chart"
        />
    </div>
</template>

<script>
import { VueEcharts } from "vue3-echarts";

export default {
    components: {
        VueEcharts
    },
    props: {
        dataSet: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: null
        },
        type: {
            type: String,
            default: "line"
        }
    },
    data() {
        return {
            defaultOptions: {
                line: {
                    tooltip: {
                        trigger: "axis"
                    },
                    legend: {},
                    grid: {
                        top: 40,
                        left: 50,
                        right: 40,
                        bottom: 50
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false,
                        minorTick: {
                            show: true
                        },
                        minorSplitLine: {
                            show: true
                        },
                        data: []
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: [
                        {
                            data: [],
                            type: "line"
                        }
                    ]
                }
            }
        };
    },
    computed: {
        computedOptions() {
            let options = this.defaultOptions[this.type];
            if (this.options) {
                Object.assign(options, this.options);
            }
            options.xAxis.data = this.dataSet.axis;
            options.series = this.dataSet.series;
            this.$refs.chart?.setOption(options, true);
            return options;
        }
    }
};
</script>