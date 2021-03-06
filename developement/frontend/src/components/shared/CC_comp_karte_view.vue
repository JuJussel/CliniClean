<template>
    <div style="height: calc(100% - 40px)">
        <vs-row style="height: 100%" ref="loadingElm" v-if="ready">
            <vs-col w="6" v-if="meta || karteData.id" style="height: 100%">
                <div class="cc-card-header" style="height: 20px; border-radius: 0">
                    <h2>主訴・所見</h2>
                </div>
                <div v-html="karteData.soap" style="margin: 10px; overflow: auto; height: calc(100% - 130px)"></div>
            </vs-col>
            <vs-col w="6" v-if="meta || karteData.id" style="height: 100%">
                <div class="cc-card-header" style="height: 20px; border-radius: 0">
                    <h2>行為・処方</h2>
                </div>
                <kouiList :data="karteData" :noFilter="true" style="margin: 10px"></kouiList>
            </vs-col>
        </vs-row>
        <vs-dialog v-model="selectOpen" blur>
            <template #header>
                <h3 class="dialog-title">カルテ選択</h3>
            </template>
            <selectInput 
                @change="patientSearch" 
                :results="searchResults"
                label="患者選択"
                placeholder="氏名又はIDで検索"
                @select="selectPatient">
                <span slot-scope="scope" >番号: {{ scope.item.id}} {{ scope.item.name }}</span>
            </selectInput>
            <karteList 
                style="height: 400px" 
                :standalone="true"
                :data="karteList"
                v-if="karteList.karte.length >0"
                @selectKarte="getKarte"
            ></karteList>

        </vs-dialog>
    </div>
</template>

<script>
import karteList from "../pateint_history/CC_view_patient_history_record_history"
import kouiList from '../pateint_history/CC_view_patient_history_procedure.vue'

export default {
    components: {
        'karteList': karteList,
        'kouiList': kouiList
    },
    props: {
        meta: {default: null}
    },
    created() {
        if (this.meta) {
            this.getKarte(this.meta.id)
            this.selectedPatient = {
                id: this.meta.patientID,
                name: this.meta.patientName,
                birthdate: null
            }
        }
    },
    data() {
        return {
            selectOpen: false,
            ready: false,
            loading: true,
            karteData: {
                id: null,                        
                soap: null,
                koui: []
            },
            selectedPatient: null,
            searchResults: [],
            karteList: {
                karte: []
            }
        }
    },

    methods: {
        getKarte(query) {
            this.selectOpen = false
            this.loading = true
            this.ready = false

            this.$get('records/' + query)
            .then(result => {
                this.karteData.soap = result.data.soap
                this.karteData.koui = JSON.parse(result.data.koui)
                this.karteData.id = query
                this.loading = false
                this.ready = true
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        patientSearch(query) {
            if (query !== '') {

                this.$get('patients', query)
                .then(result => {
                    this.searchResults = result.data
                })
                .catch(result => {
                    this.$apiError(result)
                })
            } else {
                this.searchResults = []
            }
        },
        getKarteList(id) {

            this.$get('records', id)
            .then(result => {
                this.karteList.karte = result.data
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        selectPatient(d) {
            this.selectedPatient = d
            this.getKarteList(this.selectedPatient.id)
        },
        showSelect() {
            this.selectOpen = true
        }
    },
    watch: {
        loading() {
            if (this.loading) {
                this.loadingElm = this.$vs.loading({
                    target: this.$refs.loadingElm,
                    color: 'dark'
                })
            } else if (this.loadingElm) {
                this.loadingElm.close()
            }
        }
    }
}
</script>
