<template>
    <div style="position: relative">
        <cui-select 
            :label="$lang.diseaseSearch"
            :placeholder="$lang.input"
            search
            :loading="loading.search"
            @input="searchDisease"
            :data="searchResults"
            displayValueProp='byomei'
            v-model="selectedDisease"
            class="d66574"
        />
        <cui-input v-model="editData.Disease_Supplement_Name" :label="$lang.supplementalComment"/>
        <div style="display: flex">
            <cui-select
                :label="$lang.diseaseSuspectOrAcute"
                v-model="editData.Disease_SuspectedFlag"
                returnValueProp="value"
                displayValueProp="label"
                :data="suspectFlags"
                class="d66574"
                style="width: 150px; margin-right: 20px"
            />
            <cui-checkbox :label="$lang.diseaseMain" v-model="dummies.primary" />
        </div>
        <cui-select 
            :label="$lang.diseaseOutcome" 
            v-model="editData.Disease_OutCome" 
            returnValueProp="value"
            displayValueProp="label"
            :data="outcomeFlags"
            class="d66574"
        />
        <cui-datepicker 
            :label="$lang.diseaseEndDate" 
            v-model="editData.Disease_EndDate" 
            :disabled="!editData.Disease_OutCome" />
        <cui-checkbox :label="$lang.showOnRezept" v-model="dummies.showRezept" />

        <div style="flex-grow: 1; display: flex; justify-content: flex-end">
            <cui-button
                :label="$lang.cancel"
                @click="$emit('close')"
                plain
            />
            <cui-button
                :label="$lang.register"
                primary
            />
        </div>

    </div>
</template>

<script>
export default {
    props: {
        diseaseData: {default: null}
    },
    emits: [
        'close'
    ],
    data() {
        return {
            loading: {
                search: false,
                submit: false
            },
            searchResults: [],
            dummies: {
                primary: false,
                showRezept: true
            },
            editData: {
                Disease_Single:{
                    Disease_Single_child: {
                        Disease_Single_Code: "",
                        Disease_Single_Name: ""
                    }
                },
                Disease_Category: "",
                "Disease_Supplement_Name": "",
                Disease_OutCome: null,
                Disease_EndDate: null
            },
            suspectFlags: [
                    {value: '', label: 'なし'},
                    {value: 'S', label: '疑い'},
                    {value: 'A', label: '急性'},
                    {value: 'SA', label: '疑いかつ急性'}
                ],
            outcomeFlags: [
                {value: null, label: 'なし'},
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
            this.editData = JSON.parse(JSON.stringify(this.diseaseData));
        }
        if(this.editData.Disease_Category === "PD") this.dummies.primary = true;
        if(!this.editData.Disease_EndDate) this.editData.Disease_EndDate = this.$dayjs().format("YYYY-MM-DD")
    },
    methods: {
        async searchDisease(query) {
            if(query === "") return [];
            this.loading.search = true;
            this.searchResults = await this.$dataService().get.lists.diseases(query);
            this.loading.search = false;
        }
    },
    watch: {
        selectedDisease() {
            this.editData.Disease_Single.Disease_Single_child.Disease_Single_Code = 
                this.selectedDisease.byomeicd;
            this.editData.Disease_Single.Disease_Single_child.Disease_Single_Name = 
                this.selectedDisease.byomei;
        }
    }
}
</script>

<style>
    .d66574 .cui-select-list.expanded {
        margin-left: 10px!important
    }
</style>