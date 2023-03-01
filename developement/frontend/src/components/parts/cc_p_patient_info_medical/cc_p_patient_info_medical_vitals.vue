<template>
    <div>
        <cui-card noPadding>
            <cui-table
                :data="vitalCats"
                compact
                style="height: auto; margin: 10px"
            >
                <template #header>
                    <h2>{{ $lang.vitals }}</h2>
                    <cui-button
                        icon="fas fa-plus"
                        :label="$lang.register"
                        v-if="encounterStore.encounterData"
                        @click="openVitalRegister"
                    />
                </template>
                <template #thead>
                    <cui-th
                        class="vital-row-header-scoped"
                        style="z-index: 5 !important"
                    >
                        <cui-checkbox
                            v-if="isViewer"
                            :label="$lang.showChart"
                            v-model="showChartAll"
                        />
                    </cui-th>
                    <cui-th
                        v-for="(item, index) in vitalData"
                        :key="index"
                        style="min-width: 100px; font-size: 12px"
                    >
                        {{ $parseDate(item.date) }}
                    </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td class="vital-row-header-scoped">
                        <span style="display: flex">
                            <cui-checkbox
                                v-if="isViewer"
                                v-model="row.selectedDisp"
                                :label="
                                    $lang.vitalCategories[row.name] +
                                    (row.unit || '')
                                "
                            />
                            <span v-else>
                                {{ $lang.vitalCategories[row.name] }}
                                {{ row.unit }}
                            </span>
                        </span>
                    </td>
                    <td
                        v-for="(item, index) in vitalData"
                        :key="index"
                        style="border-right: solid 1px var(--cui-gray-2)"
                    >
                        {{ returnVitalValue(item.values, row) }}
                    </td>
                </template>
            </cui-table>
        </cui-card>
        <cui-card style="height: auto; margin: 0">
            <chart :options="chartOptions" :dataSet="chartData" />
        </cui-card>
    </div>
    <cui-modal
        :visible="modals.vitalRegister.visible"
        :closable="!modals.vitalRegister.loading"
        @close="modals.vitalRegister.visible = false"
    >
        <cui-card
            style="width: 600px; max-height: 500px; position: relative"
            v-if="modals.vitalRegister.data"
        >
            <template #header>
                {{ $lang.vitals }} {{ $lang.register }}
            </template>
            <div class="vital-cont-scoped">
                <div class="loader" v-if="modals.vitalRegister.loading" />
                <cui-input
                    v-for="(item, index) in modals.vitalRegister.data"
                    :key="index"
                    :label="$lang.vitalCategories[item.name]"
                    v-model="item.value"
                    :append="item.unit"
                    style="width: 150px; margin-right: 20px"
                />
            </div>
            <template #footer>
                <cui-button
                    :label="$lang.cancel"
                    @click="this.modals.vitalRegister.visible = false"
                    plain
                    :loading="modals.vitalRegister.loading"
                />
                <cui-button
                    :label="$lang.register"
                    primary
                    @click="register"
                    :disabled="!inputPresent"
                    :loading="modals.vitalRegister.loading"
                />
            </template>
        </cui-card>
    </cui-modal>
</template>

<script>

import { useListStore } from "@/stores/list";
import { useEncounterStore } from "@/stores/encounter";
import { usePatientStore } from "../../../stores/patient";
import { useMedicalStore } from "@/stores/medical";
import { mapStores } from 'pinia'
import chart from "../cc_p_chart.vue";

export default {
    components: {
        chart,
    },
    props: {
        isViewer: {
            default: false,
            type: Boolean,
        },
    },
    emits: ["update", "selectChange"],
    data() {
        return {
            showChartAll: true,
            modals: {
                vitalRegister: {
                    visible: false,
                    loading: false,
                    data: null,
                },
            },
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
    watch: {
        showChartAll() {
            this.vitalCats.forEach((item, index) => {
                this.vitalCats[index].selectedDisp = this.showChartAll;
            });
            this.$emit("selectChange", this.vitalCats);
        },
        // vitalCats: {
        //     deep: true,
        //     handler() {
        //         if (this.vitalCats) {
        //             this.$store.commit("SET_VIEW_DATA", {
        //                 selectedVitalCats: this.vitalCats,
        //             });
        //         }
        //     },
        // },
    },
    methods: {
        openVitalRegister() {
            let vitalCatsEdit = this.vitalCats;
            vitalCatsEdit.forEach((item) => {
                item.value = "";
            });
            this.modals.vitalRegister.data = vitalCatsEdit;
            this.modals.vitalRegister.visible = true;
        },
        async register() {
            this.modals.vitalRegister.loading = true;
            let vitals = this.modals.vitalRegister.data.filter(
                (item) => item.value !== ""
            );
            const sendData = {
                values: vitals,
            };
            const id = this.patientStore.patientData.id
            /////////// Need to fix controller for this
            await this.$api.post('patients/' + id + '/medical?type=vitals', sendData);

            let patientHistory =
                await this.$api.get(
                    'patients/'
                    + this.medicalStore.patientId
                    + '/medicalHistory'
                );
            this.modals.vitalRegister.loading = false;
            this.modals.vitalRegister.visible = false;
        },
        returnVitalValue(vitals, row) {
            return vitals.find((item) => item.code === row.code)?.value || "";
        },
    },
    computed: {
        ...mapStores(useListStore, useEncounterStore, useMedicalStore, usePatientStore),
        vitalData() {
            return this.medicalStore.medicalData.vitals || []
        },
        chartData() {
            let vitals = { series: [], axis: [] };
            this.vitalData.forEach((item) => {
                let date = this.$dayjs(item.date).format("YYYY-MM-DD");
                let index = vitals.axis.indexOf(date);
                if (index === -1) {
                    vitals.axis.push(date);
                }
            });
            vitals.axis.reverse();
            let seriesDataTemplate = Array.from(
                { length: vitals.axis.length },
                () => null
            );

            this.vitalData.forEach((item) => {
                let date = this.$dayjs(item.date).format("YYYY-MM-DD");
                item.values.forEach((vital) => {
                    // let catDisp = selectedCats.find(
                    //     (c) => c.name === vital.name
                    // );

                    // if (!catDisp?.selectedDisp) return;

                    let dateIndex = vitals.axis.indexOf(date);
                    let nameIndex = vitals.series.findIndex(
                        (i) => i.name === this.$lang.vitalCategories[vital.name]
                    );
                    if (nameIndex < 0) {
                        vitals.series.push({
                            name: this.$lang.vitalCategories[vital.name],
                            type: "line",
                            data: JSON.parse(
                                JSON.stringify(seriesDataTemplate)
                            ),
                            unit: vital.unit,
                        });
                        nameIndex = vitals.series.length - 1;
                    }
                    vitals.series[nameIndex].data[dateIndex] = vital.value;
                });
            });
            return vitals;
        },
        vitalCats() {
            return this.listStore.listData.vitalCategories.map((v) => ({
                ...v,
                selectedDisp: true,
            }));
        },
        inputPresent() {
            if (!this.modals.vitalRegister.data) return false;
            let hasValue = this.modals.vitalRegister.data.filter(
                (item) => item.value !== ""
            );
            if (hasValue.length > 0) return true;
            return false;
        },
    },
};
</script>
    
<style>
.vital-cont-scoped {
    position: relative;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}
.vital-row-header-scoped {
    min-width: 100px;
    position: sticky;
    left: 0;
    z-index: 3 !important;
    background: linear-gradient(
        90deg,
        white 0%,
        white calc(100% - 0.05em),
        var(--cui-gray-2) calc(100% - 0.05em),
        var(--cui-gray-2) 100%
    );
}
</style>