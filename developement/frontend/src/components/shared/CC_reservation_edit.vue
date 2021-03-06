<template>
    <div>
        <vs-row style="width: 1000px">
            <vs-col w="4" style="height: 400px">
                <vs-input v-if="edit" readonly v-model="selectedPatient.name" style="margin: 0 20px 40px"></vs-input>
                <selectInput
                    v-else 
                    @change="doSearch" 
                    :results="searchResults"
                    label="患者選択"
                    placeholder="氏名又はIDで検索"
                    @select="selectPatient">
                    <span slot-scope="scope" >番号: {{ scope.item.id}} {{ scope.item.name }}</span>
                </selectInput>
                <vs-select label="診察内容" placeholder="選択" v-model="shinsatuTypeSelected" :key="shinsatuTypes.length">
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
                    ref="calendar"
                    :config="calConfig"
                    v-if="calendarReady"
                    @selectDate="selectDate"
                ></calendar>
            </vs-col>
        </vs-row>
        <div class="cc-dialog-footer">
            <vs-button @click="$emit('cancel')" transparent dark>キャンセル</vs-button>
            <vs-button v-if="edit" @click="submit()" :disabled="!inputOK">編集</vs-button>
            <vs-button v-else @click="submit()" :disabled="!inputOK">登録</vs-button>
        </div>
    </div>
</template>

<script>

import calendar from "../shared/CC_comp_calendar"

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
                height: 400
            },
            edit: false
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
    watch: {
        date() {
            if(this.$refs.calendar) {
                this.$refs.calendar.changeView('timeGridDay', this.date)
            }
        }
    },
    methods: {
        editRes(p) {
            let pdata = {
                id: p.patientID,
                name: p.name
            }
            this.selectedPatient = pdata
            this.edit = p.id
            this.selectDate({start: p.date})
            setTimeout(function() {
                this.$refs.calendar.changeView('timeGridDay', p.date)
            }.bind(this), 200)

        },
        selectDate(i) {
            let date = this.$moment(i.start).format('YYYY-MM-DD')
            let time = this.$moment(i.start).format('HH:mm:ss')
            this.date = date
            this.time = time

        },
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
                edit: this.edit,
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