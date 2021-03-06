<template>
    <div>
        <vs-row>
            <vs-col w="6">
                <selectInput 
                    v-if="mode === 'add'"
                    @change="doSearch" 
                    :results="searchResults"
                    label="病名選択"
                    placeholder="検索"
                    @select="setByoumei"
                    valueLabel="byomei"
                    >
                    <span slot-scope="scope" >{{ scope.item.byomei }}</span>
                </selectInput>
                <h3 v-else>
                    <vs-input label="病名" readonly v-model="formData.Disease_Name"></vs-input>
                </h3>
                <vs-input label="補足コメント" v-model="formData.Disease_Supplement_Name"></vs-input>
                <vs-select label="疑い・急性" v-model="formData.Disease_SuspectedFlag" :key="selectValues.utagai.length">
                    <vs-option v-for="(item, i) in selectValues.utagai" :key="i" :label="item.label" :value="item">
                        {{item.label}}
                    </vs-option>
                </vs-select>
                <div class="cc-radio-input">
                    <div class="cc-input-label">主病名</div>
                    <vs-checkbox dark v-model="mainDummy" style="margin-left: 20px">主病名</vs-checkbox>
                </div>

            </vs-col>
            <vs-col w="6">
                <vs-input type="date" v-model="formData.Disease_StartDate" label="開始日"></vs-input>
                <vs-select label="転帰" v-model="formData.Disease_OutCome" :key="selectValues.outcome.length">
                    <vs-option v-for="(item, i) in selectValues.outcome" :key="i" :label="item.label" :value="item">
                        {{item.label}}
                    </vs-option>
                </vs-select>
                <vs-input type="date" v-model="formData.Disease_EndDate" label="転帰日" :disabled="formData.Disease_OutCome.value === ''"></vs-input>
                <div class="cc-radio-input">
                    <div class="cc-input-label">レセプト表示</div>
                    <vs-checkbox dark v-model="showDummy" style="margin-left: 20px">レセプト表示</vs-checkbox>
                </div>
            </vs-col>
        </vs-row>
        <div class="cc-dialog-footer">
            <vs-button @click="$emit('close')" transparent dark>キャンセル</vs-button>
            <vs-button @click="save()" :disabled="!inputOK">登録</vs-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        mode: {
            default: 'new'
        },
        byoumeiData: {
            default: false
        }
    },
    computed: {
        inputOK() {
            if (
                !this.formData.Disease_Name ||
                !this.formData.Disease_StartDate ||
                (this.formData.Disease_OutCome.value !== '' && !this.formData.Disease_EndDate)
            ) {
                return false
            }
            return true
        }
    },
    created() {
        if(this.byoumeiData) {
            Object.assign(this.byoumeiDefaultData, this.byoumeiData)
            let returnData = JSON.parse(JSON.stringify(this.byoumeiDefaultData))
            Object.assign(returnData, this.byoumeiData)
            returnData.Disease_SuspectedFlag = 
                this.selectValues.utagai.find(x => x.value === returnData.Disease_SuspectedFlag)
            this.formData = returnData
        }
        this.formData = this.byoumeiDefaultData
        if (this.byoumeiData.Disease_Category && this.byoumeiData.Disease_Category === 'PD') {
            this.mainDummy = true
        }
        if (this.byoumeiData.Disease_Receipt_Print && this.byoumeiData.Disease_Receipt_Print === '1') {
            this.showDummy = false
        }

    },
    watch: {
        mainDummy() {
            if (this.mainDummy) {
                this.formData.Disease_Category = "PD"
            } else {
                this.formData.Disease_Category = ""
            }
        },
        showDummy() {
            if (this.showDummy) {
                this.formData.Disease_Receipt_Print = ""
            } else {
                this.formData.Disease_Receipt_Print = "1"
            }
        }
    },
    data() {
        return {
            formData: null,
            suspectDummy: null,
            mainDummy: false,
            showDummy: true,
            loading: false,
            searchLoading: false,
            searchResults: [],
            selectedByomei: null,
            selectValues: {
                utagai: [
                    {value: '', label: 'なし'},
                    {value: 'S', label: '疑い'},
                    {value: 'A', label: '急性'},
                    {value: 'SA', label: '疑いかつ急性'}
                ],
                outcome: [
                    {value: '', label: 'なし'},
                    {value: 'F', label: '治癒'},
                    {value: 'D', label: '死亡'},
                    {value: 'C', label: '中止'},
                    {value: 'S', label: '移行'}
                ]
            },
            byoumeiDefaultData: {
                Insurance_ID: this.$store.getters.activeInsID,
                Disease_Category: '',
                Disease_EndDate: null,
                Disease_Name: null,
                Disease_OutCome: {value: '', label: 'なし'},
                Disease_Supplement_Name: '',
                Disease_Receipt_Print: '',
                Disease_StartDate:  this.$moment().format('YYYY-MM-DD'),
                Disease_SuspectedFlag: {value: '', label: 'なし'},
                Disease_Single: {Disease_Single_child: {Disease_Single_Code: ''}}
            }
        }
    },
    methods: {
        save() {
            let sendData = JSON.parse(JSON.stringify(this.formData))
            sendData.Disease_OutCome = sendData.Disease_OutCome.value
            sendData.Disease_SuspectedFlag = sendData.Disease_SuspectedFlag.value
            this.$emit('save', sendData)
            this.$emit('close')
        },
        setByoumei(value) {
            this.byoumeiDefaultData.Disease_Name = value.byomei
            this.byoumeiDefaultData.Disease_Single.Disease_Single_child.Disease_Single_Code = value.byomeicd
        },
        doSearch(query) {
            if (query !== '') {
                this.searchLoading = true

                this.$get('diseases', query)
                .then(result => {
                    this.searchResults = result.data
                    this.searchLoading = false
                })
                .catch(result => {
                    this.$apiError(result)
                })

            } else {
                this.searchResults = []
            }
        }
    }
}
</script>