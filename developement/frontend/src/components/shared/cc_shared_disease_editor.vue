<template>
    <div style="height: 100%; position: relative; display: flex; flex-direction: column; justify-content: space-between">
        <div class="loader" v-if="loading.submit"/>
        <div>
            <cui-select
                v-if="!diseaseData"
                :label="$lang.diseaseSearch"
                :placeholder="$lang.input"
                search
                :loading="loading.search"
                @input="searchDisease"
                :data="searchResults"
                displayValueProp='Disease_Single_Name'
                v-model="selectedDisease"
                class="d66574"
            />
            <cui-tag v-else> {{ editData.disease.name }} </cui-tag>
            <cui-input v-model="editData.supplementNote" :label="$lang.supplementalComment"/>
            <cui-datepicker
                :label="$lang.diseaseStartDate"
                v-model="editData.startDate"
            />
            <div style="display: flex">
                <cui-select
                    :label="$lang.diseaseSuspectOrAcute"
                    v-model="editData.suspectOrAcuteFlag"
                    returnValueProp="value"
                    displayValueProp="label"
                    :data="suspectFlags"
                    class="d66574"
                    style="width: 150px; margin-right: 20px"
                />
                <cui-checkbox :label="$lang.diseaseMain" v-model="editData.primaryDisease" />
            </div>
            <cui-select
                :label="$lang.diseaseOutcome"
                :placeholder="$lang.select"
                v-model="editData.outcome"
                returnValueProp="value"
                displayValueProp="label"
                :data="outcomeFlags"
                class="d66574"
            />
            <cui-datepicker
                :label="$lang.diseaseEndDate"
                v-model="editData.endDate"
                :disabled="!editData.outcome" />
            <cui-checkbox :label="$lang.showOnRezept" v-model="editData.showOnRezept" />
        </div>

        <div style="display: flex; justify-content: flex-end">
            <cui-button
                :label="$lang.cancel"
                @click="$emit('close')"
                plain
            />
            <cui-button
                :label="diseaseData ? $lang.edit :$lang.register"
                @click="submit"
                primary
            />
        </div>

    </div>
</template>

<script>

export default {
    props: {
        diseaseData: {default: null},
        patientData: {default: null}
    },
    emits: [
        'close', 'submitting','submitted'
    ],
    data() {
        return {
            loading: {
                search: false,
                submit: false
            },
            searchResults: [],
            dummyPrimary: false,
            dummyShowRezept: true,
            editData: {
                code: "",
                name: "",
                showOnRezept: true,
                primaryDisease: false,
                suspectOrAcuteFlag: "",
                supplementNote: "",
                outcome: "",
                endDate: null,
                startDate:null,
                insurance: null
            },
            // editData: {
            //     Disease_Single:{
            //         Disease_Single_child: {
            //             Disease_Single_Code: "",
            //             Disease_Single_Name: ""
            //         }
            //     },
            //     Disease_Receipt_Print: "",
            //     Disease_Category: "",
            //     Disease_SuspectedFlag: "",
            //     Disease_Supplement_Name: "",
            //     Disease_OutCome: "",
            //     Disease_EndDate: null,
            //     Disease_StartDate: null,
            //     Insurance_Combination_Number: null
            // },
            suspectFlags: [
                {value: {suspect: false, acute: false}, label: 'なし'},
                {value: {suspect: true, acute: false}, label: '疑い'},
                {value: {suspect: false, acute: true}, label: '急性'},
                {value: {suspect: true, acute: true}, label: '疑いかつ急性'}
            ],
            outcomeFlags: [
                {value: "", label: 'なし'},
                {value: 'F', label: '治癒'},
                {value: 'D', label: '死亡'},
                {value: 'C', label: '中止'},
                {value: 'S', label: '移行'}
            ],
            selectedDisease: null
        }
    },
    created() {
        if(this.diseaseData) {
            let data = JSON.parse(JSON.stringify(this.diseaseData));
            this.editData = data;
            this.selectedDisease = data.disease;
        }
        // if(this.editData.Disease_Category === "PD") this.dummyPrimary = true;
        if(!this.editData.startDate) this.editData.startDate = this.$dayjs().format("YYYY-MM-DD")
        if(!this.editData.endDate) this.editData.endDate = this.$dayjs().format("YYYY-MM-DD")
    },
    methods: {
        async searchDisease(query) {
            if(query === "") return [];
            this.loading.search = true;
            this.searchResults = await this.$dataService().get.lists.diseases(query);
            this.loading.search = false;
        },
        async submit() {
            this.$emit('submitting');
            this.loading.submit = true;
            this.editData.patientId = this.patientData.id;
            this.editData.department = this.patientData.currentEncounter.department;
            if(!this.editData.Insurance_Combination_Number) this.editData.Insurance_Combination_Number = this.patientData.currentEncounter.ins;
            if(this.editData.Disease_OutCome === "" || !this.editData.Disease_OutCome) this.editData.Disease_EndDate = "";
            await this.$dataService().post.medical.diseases(this.editData);
            this.$emit('submitted');
            this.$emit('close');
        }
    },
    watch: {
        selectedDisease() {
            this.editData.disease = this.selectedDisease;
        },
        dummyPrimary() {
            if(this.dummyPrimary) {
                this.editData.Disease_Category = "PD"
            } else {
                this.editData.Disease_Category = ""
            }
        },
        dummyShowRezept() {
            if(this.dummyShowRezept) {
                this.editData.Disease_Receipt_Print = ""
            } else {
                this.editData.Disease_Receipt_Print = "1"
            }

        }
    }
}
</script>

<style>
    .d66574 .cui-select-list.expanded {
        margin-left: 10px!important
    }
</style>