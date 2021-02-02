<template>
    <div>
        <vs-row style="width: 1000px">
            <vs-col w="4" style="height: 400px">
                <selectInput 
                    @change="doSearch" 
                    :results="searchResults"
                    label="患者選択"
                    placeholder="氏名又はIDで検索"
                    @select="selectPatient">
                    <span slot-scope="scope" >番号: {{ scope.item.id}} {{ scope.item.name }}</span>
                </selectInput>
                <vs-select label="診察内容" placeholder="Select" v-model="shinsatuTypeSelected" :key="shinsatuTypes.length">
                    <vs-option v-for="(item, i) in shinsatuTypes" :key="i" :label="item.name" :value="i + 1">
                        {{item.name}}
                    </vs-option>
                </vs-select>
                <div style="padding: 0 0 10px 20px">
                    <div style="margin-left: 10px; font-size: 12px">日付</div>
                    <date-picker
                        v-model="date"
                        :append-to-body="false"
                        placeholder="選択"
                        format="YYYY年MM月DD日"
                        value-type="YYYY-MM-DD"
                        input-class="vs-input cc-mx-input"
                        popup-class="cc-date-picker"
                        >
                    </date-picker>
                </div>
                <vs-input label="時間" type="time" v-model="time"/>
                <vs-input label="メモ" v-model="memo"/>
            </vs-col>
            <vs-col w="8">
                <calendar
                    :config="calConfig"
                    v-if="calendarReady"
                ></calendar>
            </vs-col>
        </vs-row>
        <div class="cc-dialog-footer">
            <vs-button @click="$emit('cancel')" transparent dark>キャンセル</vs-button>
            <vs-button @click="submit()" :disabled="!inputOK">登録</vs-button>
        </div>
    </div>
</template>

<script>

import calendar from "../shared/calendar"

export default {

    components: {
        calendar: calendar
    },
    created() {
        this.shinsatuTypes = this.$store.getters.shinsatuTypes
        this.shinsatuTypeSelected = this.shinsatuTypes[0].id
    },
    mounted() {
        setTimeout(() => {
        this.calendarReady = true
        }, 300);
    },
    data() {
        return {
            calendarReady: false,
            searchResults: [],
            selectedPatient: null,
            searchLoading: false,
            patientData: {},
            shinsatuTypes: [],
            shinsatuTypeSelected: '',
            memo: '',
            date: '',
            time: '',
            calConfig: {
                navLinkDayClick: 'timeGridDay',
                height: 400
            }
        }
    },
    computed: {
        inputOK() {
            if (this.selectedPatient !== '' && this.date !== '' && this.time !== '') {
                return true
            }
            return false
        }
    },
    methods: {
        selectPatient(d) {
            this.selectedPatient = d
        },
        doSearch(query) {
            if (query !== '') {
                this.searchLoading = true
                this.$get('patients', query)
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
        },
        submit() {
            let data = {
                patient: this.selectedPatient,
                type: this.shinsatuTypes[this.shinsatuTypeSelected - 1],
                memo: this.memo,
                date: this.date,
                time: this.time
            }
            this.$emit('submit', data)
            this.$emit('cancel')
        }
    }
}
</script>

<style>

</style>