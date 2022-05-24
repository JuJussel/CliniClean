<template>
    <div>
        Chart
    </div>
</template>

<script>
export default {
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
                    xAxis: {
                        type: "category",
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
            if (this.options) {
                return this.options;
            } else {
                let options = this.defaultOptions[this.type];
                options.xAxis.data = this.dataSet.xAxis;
                options.series.data = this.dataSet.values;
                return options;
            }
        }
    }
};
</script>