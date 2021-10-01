<template>
    <div style="position: relative">
        <cui-select 
            :label="$lang.selectPatient"
            :placeholder="$lang.searchByNameodID"
            search
            :loading="loading.search"
            @input="searchDisease"
            :data="searchResults"
            displayValueProp='name'
            v-model="selectedDisease"
            class="d66574"
        />
        <cui-input v-model="editData.Disease_Supplement_Name" label="補足コメント"/>
        <cui-select 
            label="疑い・急性" 
            v-model="editData.Disease_SuspectedFlag" 
            returnValueProp="value"
            displayValueProp="label"
            :data="suspectFlags"
            class="d66574"
        />
        <cui-checkbox label="主病名" v-model="dummies.primary" />
        <cui-select 
            label="転帰" 
            v-model="editData.Disease_OutCome" 
            returnValueProp="value"
            displayValueProp="label"
            :data="outcomeFlags"
            class="d66574"
        />
        <cui-datepicker label="Date" v-model="editData.Disease_EndDate" />
        <cui-checkbox label="レセプト表示" v-model="dummies.showRezept" />

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
                {value: '', label: 'なし'},
                {value: 'F', label: '治癒'},
                {value: 'D', label: '死亡'},
                {value: 'C', label: '中止'},
                {value: 'S', label: '移行'}
            ]
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
        searchDisease() {}
    }
}
</script>

<style>
    .d66574 .cui-select-list.expanded {
        margin-left: 10px!important
    }
</style>