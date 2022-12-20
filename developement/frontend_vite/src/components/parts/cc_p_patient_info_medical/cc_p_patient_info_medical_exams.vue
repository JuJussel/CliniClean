<template>
    <div>
        <cui-card noPadding>
            <cui-table
                :data="examsList"
                style="max-height: 450px"
                compact
                outline
            >
                <template #header>
                    <h2>{{ $lang.exam }}</h2>
                </template>
                <template #thead>
                    <cui-th
                        class="vital-row-header-scoped"
                        style="z-index: 5 !important; min-width: 250px"
                    ></cui-th>
                    <cui-th
                        v-for="(item, index) in exams"
                        :key="index"
                        style="min-width: 100px; font-size: 12px"
                    >
                        {{ $parseDate(item.date) }}
                    </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td class="vital-row-header-scoped">
                        <cui-checkbox
                            :label="row.name"
                            v-model="row.showChart"
                        />
                    </td>
                    <td
                        v-for="(item, index) in exams"
                        :key="index"
                        style="border-right: solid 1px var(--cui-gray-2)"
                    >
                        {{ parseValue(item, row) }}
                    </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card style="height: auto; margin: 0">
            <chart :options="chartOptions" :dataSet="chartData" />
        </cui-card>
    </div>
</template>

<script>
import chart from "../cc_p_chart.vue";

export default {
    components: {
        chart,
    },
    created() {
        this.createExamsList();
    },
    methods: {
        parseValue(results, row) {
            let match = results.data.find((res) => {
                let name =
                    res.result.shared.name === "分析物固有結果コード"
                        ? res.item.name + " - " + res.result.single.name
                        : res.item.name + " - " + res.result.shared.name;
                return name === row.name;
            });
            return match?.value || null;
        },
        createExamsList() {
            let examList = [];
            this.exams.forEach((exm) => {
                exm.data.forEach((dat) => {
                    let itemName = dat.item.name;
                    let resultName =
                        dat.result.shared.name === "分析物固有結果コード"
                            ? dat.result.single.name
                            : dat.result.shared.name;
                    let examObject = {
                        name: itemName + " - " + resultName,
                        exam: dat.item,
                        showChart: false,
                        type: "line",
                        data: null,
                    };
                    if (
                        examList.findIndex(
                            (i) => i.name === examObject.name
                        ) === -1
                    )
                        examList.push(examObject);
                });
            });
            this.examsList = examList;
        },
    },
    data() {
        return {
            examsList: [],
            showAllCharts: true,
            chartOptions: {
                name: "vitals",
                type: "line",
                title: { text: this.$lang.vitals },
                emphasis: {
                    focus: "series",
                    label: {
                        show: true,
                        formatter: "{a}",
                    },
                },
                xAxis: {
                    axisLabel: {
                        formatter: function (value) {
                            return this.$dayjs(value).format(
                                "YYYY" +
                                    this.$lang.dateLocals.yearSeparator +
                                    "MM" +
                                    this.$lang.dateLocals.monthSeparator +
                                    "DD" +
                                    this.$lang.dateLocals.daySeparator
                            );
                        }.bind(this),
                    },
                },

                dataZoom: [
                    {
                        type: "inside",
                        start: 0,
                        end: 100,
                    },
                    {
                        start: 0,
                        end: 100,
                    },
                ],
                toolbox: {
                    show: true,
                    feature: {
                        magicType: { type: ["line", "bar"] },
                        saveAsImage: {},
                    },
                },
            },
        };
    },
    computed: {
        chartData() {
            let chartData = {
                axis: [],
                series: []
            };

            let selectedExams = this.examsList.filter((item) => {
                return item.showChart;
            });
            selectedExams = JSON.parse(JSON.stringify(selectedExams));
            if(selectedExams.length < 1) return chartData
            let dates = [];
            let visibleExams = [];

            this.exams.forEach((item) => {
                let selExams = item.data.filter((d) => {
                    d.date = item.date;
                    let name =
                        d.result.shared.name === "分析物固有結果コード"
                            ? d.item.name + " - " + d.result.single.name
                            : d.item.name + " - " + d.result.shared.name;
                    d.fullName = name;
                    let index = selectedExams.findIndex((e) => e.name === name);
                    return index > -1;
                });
                if (selExams.length > 0) {
                    dates.push(item.date);
                    visibleExams = visibleExams.concat(selExams);
                }
            });
            dates.reverse();
            let seriesDataTemplate = Array.from(
                { length: dates.length },
                () => null
            );
            visibleExams.forEach((item) => {
                console.log(item.fullName);
                console.log(item.value);
                let index = selectedExams.findIndex((e) => {
                    return e.name === item.fullName;
                });
                console.log(index);
                console.log(selectedExams[index].data);
                if (!selectedExams[index].data)
                selectedExams[index].data = seriesDataTemplate;
                
                let dateIndex = dates.findIndex((d) => d === item.date);
                selectedExams[index].data[dateIndex] = item.value;
                console.log(selectedExams[index].data);
                console.log(selectedExams[index].data);
                console.log();
                console.log('-------------');
            });

            chartData.axis = dates
            chartData.series = selectedExams

            return chartData;
        },
        patientData() {
            return this.$store.getters.layoutData.medical.patient;
        },
        exams() {
            let examResults = [];
            this.patientData.encounters.forEach((enc) => {
                let procedures = enc.karte?.procedures || null;
                if (!procedures) return;
                let exams = procedures.filter(
                    (proc) => proc.cat?.code === 60 || proc.cat?.code === 90
                );
                if (exams.length < 1) return;
                exams.forEach((exm) => {
                    let varData = exm.varData || [];
                    if (varData.exams) {
                        let examArr = [];
                        varData.exams.forEach((ex) => {
                            examArr = examArr.concat(ex.varData);
                        });
                        varData = examArr;
                    }

                    if (varData.length < 1) return;
                    exm = varData.map((varD) => {
                        (varD.encounter = enc.id), (varD.date = enc.date);
                        return varD;
                    });
                    let dateObject = {
                        date: enc.date,
                        data: exm,
                    };
                    examResults = examResults.concat(dateObject);
                });
            });
            return examResults;
        },
    },
};
</script>