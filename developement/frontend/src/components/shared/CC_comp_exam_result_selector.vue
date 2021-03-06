<template>
    <div>
        <vs-row ref="kensaAddModal" style="padding: 0 10px">
            <vs-col w="6">
            <kouiList
                @addKoui="selectExam"
                :visibleCats="[60]"
                setActive="60"
                noHeader
                style="height: 600px; margin-bottom: -80px"
            />
            </vs-col>
            <vs-col w="6" style="padding-left: 20px">
            <vs-table style="height: 520px" condensed>
                <template #header>
                <div class="cc-table-header-content">
                    <h2>検査結果一覧</h2>
                </div>
                </template>
                <template #thead>
                <vs-tr>
                    <vs-th>
                    <vs-checkbox
                        :indeterminate="examResultsScelected.length == examResults.length"
                        v-model="allCheck"
                        @change="examResultsScelected = $vs.checkAll(examResultsScelected, examResults)"
                    >
                        結果名
                    </vs-checkbox>
                    </vs-th>
                </vs-tr>
                </template>
                <template #notFound>
                    項目を選択してください
                </template>
                <template #tbody>
                <vs-tr
                    v-for="(tr, index) in examResults"
                    :key="index"
                    style="height: 50px"
                >
                    <vs-td>
                    <vs-checkbox :val="tr" v-model="examResultsScelected">{{ tr.name }}</vs-checkbox>
                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>

import kouiList from "../shared/CC_comp_koui_list";

export default {
    components: {
            kouiList: kouiList
    },
    data() {
        return {
            examResults: [],
            examResultsScelected: [],
            allCheck: false,
            slectedExam: null
        }
    },
    methods: {
        selectExam(exam) {
            let loading = this.$vs.loading({
                target: this.$refs.kensaAddModal,
                color: "dark",
            })
            this.slectedExam = exam.koui.name + " - "
            this.$get("examinationresults/" + exam.koui.kouiid)
                .then((result) => {
                this.examResults = result.data;
                loading.close();
                })
                .catch((result) => {
                this.$apiError(result);
                loading.close();
            });
        },
        getSelectedResults() {

            let results = JSON.parse(JSON.stringify(this.examResultsScelected))
                console.log(results);
            
            results.forEach(item => {
                item.name = this.slectedExam + item.name
            })
            return results
        }
    }
}
</script>