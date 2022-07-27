<template>
    <div>
        <chart
            :type="localData.charts[1].options.type"
            :dataSet="localData.charts[1].dataSet"
            :options="localData.charts[1].options"
        />
    </div>
</template>

<script>
import chart from "../cc_shared_chart/cc_shared_chart_main.vue";

export default {
    components: {
        chart
    },
    data() {
        return {
            localData: {
                patientData: {
                    encounters: null,
                    vitals: null,
                    diseases: null,
                    exams: null,
                    medications: null,
                    operations: null,
                    shots: null,
                    prevVacs: null,
                    treatments: null
                },
                charts: [
                    {
                        options: {
                            name: "timeline",
                            type: "gantt",
                            selected: {
                                encounters: true,
                                vitals: true,
                                diseases: true,
                                exams: true,
                                medications: true,
                                operations: true,
                                shots: true,
                                prevVacs: true,
                                treatments: true
                            }
                        },
                        dataSet: {
                            id: "events",
                            type: "custom",
                            dimensions: ["type", "startDate", "endDate", "id"],
                            encode: {
                                x: [1, 2],
                                y: 0,
                                tooltip: [0, 1, 3]
                            },
                            data: []
                        }
                    },
                    {
                        options: {
                            name: "vitals",
                            type: "line",
                            title: { text: this.$lang.vitals }
                        },
                        dataSet: {}
                    }
                ]
            },
            workingViewData: null
        };
    },
    created() {
        this.workingViewData = JSON.parse(
            JSON.stringify(this.$store.getters.viewData)
        );
        this.transformPatientData();
    },
    methods: {
        commitworkingViewData() {
            this.$store.commit("SET_VIEW_DATA", this.workingViewData);
        },
        transformPatientData() {
            let patientData = JSON.parse(
                JSON.stringify(this.$store.getters.activePatientHistory)
            );

            //Vitals
            let vitals = { series: [], axis: [] };
            patientData.vitals.forEach(item => {
                let date = this.$dayjs(item.date).format("YYYY-MM-DD");
                let index = vitals.axis.indexOf(date);
                if (index === -1) {
                    vitals.axis.push(date);
                }
            });
            let seriesDataTemplate = Array.from(
                { length: vitals.axis.length },
                () => null
            );

            patientData.vitals.forEach(item => {
                let date = this.$dayjs(item.date).format("YYYY-MM-DD");
                item.values.forEach(vital => {
                    let dateIndex = vitals.axis.indexOf(date);
                    let nameIndex = vitals.series.findIndex(
                        i => i.name === vital.name
                    );
                    if (nameIndex < 0) {
                        vitals.series.push({
                            name: vital.name,
                            type: "line",
                            data: JSON.parse(
                                JSON.stringify(seriesDataTemplate)
                            ),
                            unit: vital.unit
                        });
                        nameIndex = vitals.series.length - 1;
                    }
                    vitals.series[nameIndex].data[dateIndex] = vital.value;
                });
            });

            // index = vitals.axis.length - 1;
            // item.values.forEach(vital => {
            //     if (!vitals.series[vital.name]) {
            //         vital.series[vital.name] = {
            //             name: vital.name,
            //             type: "line",
            //             data: []
            //         };
            //     }
            //     vitals.series[vital.name].data[index] = item.value;
            // });

            this.localData.charts[1].dataSet = vitals;
            // Encounters
            patientData.encounters.forEach(enc => {
                if (this.localData.charts[0].options.selected.encounters) {
                    let arr = [enc.type, enc.date, enc.lastChange, enc.id];
                    this.localData.charts[0].dataSet.data.push(arr);
                }
            });
        }
    },
    computed: {}
};
</script>