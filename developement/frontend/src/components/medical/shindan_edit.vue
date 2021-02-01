<template>
  <div style="height: 100%">
        <div class="content-card" ref="loadElm">
            <div class="cc-card-header">
                <h2>健康診断</h2>
                <vs-button @click="$emit('close')" transparent dark>閉じる</vs-button>
                <vs-button
                    @click="save(false)"
                    dark
                    icon
                    animation-type="scale"
                    style="min-width: 50px"
                >
                    <i class="fas fa-save"></i>
                    <template #animate>保存</template>
                </vs-button>
                <vs-button
                    @click="save(true)"
                    v-if='!meta.noClose'
                    primary
                    icon
                    animation-type="scale"
                    style="min-width: 50px"
                >
                    <i class="fas fa-check-double"></i>
                    <template #animate>終了</template>
                </vs-button>
            </div>
            <vs-row style="padding: 20px; height: calc(100% - 64px); overflow: auto" v-if="!loading">
                <vs-col w="2" style="margin: 0 20px">
                    <h2>履歴</h2>
                    <vs-row style="height: 60px">
                        <vs-col w="3">
                            <vs-switch val="1" v-model="shindanData.medication_history" label="薬剤歴">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                        </vs-col>
                        <vs-col w="9">
                            <vs-input
                                v-if="shindanData.medication_history === '1'" 
                                v-model="shindanData.medication_history_text" 
                                placeholder="入力" label="薬剤歴詳細" 
                                class="KKSD-switchInput"
                                >
                            </vs-input>
                        </vs-col>
                    </vs-row>
                    <vs-row style="height: 60px">
                        <vs-col w="3">
                            <vs-switch val="1" v-model="shindanData.medical_history" label="既往歴">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                        </vs-col>
                        <vs-col w="9">
                            <vs-input
                                v-if="shindanData.medical_history === '1'" 
                                v-model="shindanData.medical_history_text" 
                                placeholder="入力" label="既往歴詳細" 
                                class="KKSD-switchInput"
                                >
                            </vs-input>
                        </vs-col>
                    </vs-row>
                    <vs-row style="height: 60px">
                        <vs-col w="3">
                            <vs-switch val="1" v-model="shindanData.subjective_symtoms" label="自覚症状">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                        </vs-col>
                        <vs-col w="9">
                            <vs-input
                                v-if="shindanData.subjective_symtoms === '1'" 
                                v-model="shindanData.subjective_symtoms_text" 
                                placeholder="入力" label="自覚症状歴詳細" 
                                class="KKSD-switchInput"
                                >
                            </vs-input>
                        </vs-col>
                    </vs-row>
                    <vs-row style="height: 60px">
                        <vs-col w="3">
                            <vs-switch val="1" v-model="shindanData.objective_symtoms" label="他覚症状">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                        </vs-col>
                        <vs-col w="9">
                            <vs-input
                                v-if="shindanData.objective_symtoms === '1'" 
                                v-model="shindanData.objective_symtoms_text" 
                                placeholder="入力" label="他覚症状歴詳細" 
                                class="KKSD-switchInput"
                                >
                            </vs-input>
                        </vs-col>
                    </vs-row>
                    <h2>基本</h2>
                    <vs-input icon-after v-model="shindanData.height" @input="calcBMI" label="身長" placeholder="入力">
                        <template #icon>cm</template>
                    </vs-input>
                    <vs-input icon-after v-model="shindanData.weight" @input="calcBMI" label="体重" placeholder="入力">
                        <template #icon>kg</template>
                    </vs-input>
                    <vs-input v-model="shindanData.bmi" label="BMI" placeholder="入力"></vs-input>
                    <vs-input icon-after v-model="shindanData.stomache_width" label="腹囲" placeholder="入力">
                        <template #icon>cm</template>
                    </vs-input>
                </vs-col>
                <vs-col w="2" style="margin: 0 20px">
                    <h2>血圧</h2>
                    <vs-row>
                        <vs-col w="6">
                            <vs-input v-model="shindanData.blood_pressure_min" label="血圧最低(D)" placeholder="入力"></vs-input>
                        </vs-col>
                        <vs-col w="6">
                            <vs-input v-model="shindanData.blood_pressure_max" label="血圧最高(S)" placeholder="入力"></vs-input>        
                        </vs-col>
                    </vs-row>
                    <h2>視力</h2>
                    <vs-row>
                        <vs-col w="6">
                            <vs-input v-model="shindanData.sight_left" label="視力左" placeholder="入力"></vs-input>
                        </vs-col>
                        <vs-col w="6">
                            <vs-input v-model="shindanData.sight_right" label="視力右" placeholder="入力"></vs-input>
                        </vs-col>
                    </vs-row>
                    <h2>聴力(所見)</h2>
                    <vs-row>
                        <vs-col w="1"></vs-col>
                        <vs-col w="3">
                            <vs-switch val="1" v-model="shindanData.hearing_left_low" label="左1000Hz">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                            <vs-switch val="1" v-model="shindanData.hearing_left_high" label="左4000Hz">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                        </vs-col>
                        <vs-col w="3"></vs-col>
                        <vs-col w="3">
                            <vs-switch val="1" v-model="shindanData.hearing_right_low" label="右1000Hz">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                            <vs-switch val="1" v-model="shindanData.hearing_right_high" label="右4000Hz">
                                <template #off>なし</template>
                                <template #on>あり</template>
                            </vs-switch>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col w="3" style="margin: 0 40px">
                    <h2>その他</h2>
                    <vs-row>
                        <vs-col w="5">
                            <vs-input
                                v-model="shindanData.ecg"
                                label="心電図ID"
                                icon-after
                                @click-icon="showECG">
                                    <template #icon>
                                        <i class="fas fa-eye"></i>
                                    </template>
                            </vs-input>
                        </vs-col>
                    </vs-row>
                    <vs-row>
                        <vs-col w="5">
                            <vs-input
                                v-model="shindanData.x_ray_ID"
                                label="X線番号"
                                icon-after
                                @click-icon="showX">
                                    <template #icon>
                                        <i class="fas fa-eye"></i>
                                    </template>
                            </vs-input>
                        </vs-col>
                    </vs-row>
                    <h2>シェーマ</h2>
                    <xrayPaint 
                        v-if="!loading"
                        :parentWidth="400"
                        :parentHeight="400"
                        ref="xrayDraw"
                        style="margin-top: 10px"
                        :schema="shindanData.x_ray_schema_id + '.png'"
                        :x-ray="true"
                        id="K675g">
                    </xrayPaint>
                </vs-col>
                <vs-col w="3">
                    <h2>検査結果</h2>
                    <vs-row>
                        <vs-col w="5">
                            <vs-select label="診察内容" placeholder="選択" v-model="shindanData.supplier.supplier" :key="suppliers.length">
                                <vs-option v-for="(item, index) in suppliers" :key="index" :label="item.name" :value="item.name">
                                    {{item.name}}
                                </vs-option>
                            </vs-select>
                        </vs-col>
                        <vs-col w="5">
                            <vs-input v-model="shindanData.supplier.number" label="依頼番号" placeholder="入力"></vs-input>
                        </vs-col>
                    </vs-row>
                    <div v-if="availableKensa.length > 0">
                        <vs-row v-for="(tr, index) in availableKensa" :key="index" class="results-container" style="margin: 10px 0">
                            <vs-col w="6" style="padding: 5px"> {{ tr.name }} </vs-col>
                            <vs-col w="4" style="padding-right: 5px">
                                <vs-input icon-after v-model="tr.value" placeholder="値" readonly>
                                    <template #icon v-if="tr.unit !=='' && tr.unit !== '　'">
                                    {{ tr.unit }}
                                    </template>
                                </vs-input>
                            </vs-col>
                        </vs-row>
                    </div>
                </vs-col>
            </vs-row>
        </div>
    </div>
</template>

<script>

import xrayPaint from '../shared/painter.vue'

export default {    
    props: {
        meta: {default: null},
        noClose: {default: false}
    },
    components: {
        'xrayPaint': xrayPaint
    },
    computed: {
        availableKensa() {
            return this.shindanData.results.filter(item => item.value !== '')
        }
    },
    data() {
        return {
            loading: false,
            loadingElm: null,
            suppliers: [],
            shindanData:{
                results: [],
                medication_history: "",
                medication_history_text: "",
                medical_history: "",
                medical_history_text: "",
                subjective_symtoms: "",
                subjective_symtoms_text: "",
                objective_symtoms: "",
                objective_symtoms_text: "",
                height: null,
                weight: null,
                bmi: "",
                stomache_width: "",
                ecg: "",
                x_ray_ID: "",
                blood_pressure_max: null,
                blood_pressure_min: null,
                sight_left: null,
                sight_right: null,
                hearing_left_low: "",
                hearing_left_high: "",
                hearing_right_low: "",
                hearing_right_high: "",
                ecg: "",
                x_ray_ID: "",
                x_ray_schema_id: "lung_schema",
                comment: "",
                supplier: {
                    number: '',
                    supplier: ''
                }
            }
        }
    },
    created() {

        this.loading = true
        this.$get('healthcheckexams')
        .then(result => {
            this.shindanData.results = result.data
        })
        .catch(results => {
            this.$apiError(result)
        })

        this.$get('records/' + this.meta.id)
        .then(result => {
            if (result.data.health_check) {
                let shindanData = result.data.health_check.var
                this.shindanData = shindanData
            }
            this.getSuppliers()
        })
        .catch(result => {
            this.$apiError(result)
        })
    },
    watch: {
        loading() {
            if (this.loading) {
                this.loadingElm = this.$vs.loading({
                    target: this.$refs.loadElm,
                    color: 'dark'
                })
            } else if (this.loadingElm) {
                this.loadingElm.close()
                this.loadingElm = null
            }
        }
    },
    methods: {
        showECG() {

        },
        showX() {

        },
        getSuppliers() {

            if(!this.$store.getters.suppliers) {

                this.$get('suppliers')
                .then(result => {
                    this.suppliers = result.data
                    this.$store.commit('SET_SUPPLIERS', result.data)
                    this.loading = false
                })
                .catch(result => {
                    this.$apiError(result)
                })
            } else {
                this.suppliers = this.$store.getters.suppliers
                this.loading = false
            }
        },
        calcBMI() {

            if (this.shindanData.height > 0 && this.shindanData.weight > 0) {
                let bmi = this.shindanData.weight/Math.pow(this.shindanData.height/100,2)
                bmi = Math.round(bmi * 10) / 10
                this.shindanData.bmi = bmi
            }
        },
        save(close) {
            this.loading = true
            if (close) {
                this.meta.status = 45
            }
            let img = this.$refs.xrayDraw.getPainting()
            let shmID = this.shindanData.x_ray_schema_id
            if (shmID === 'lung_schema') {
                shmID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
                this.shindanData.x_ray_schema_id = shmID
            }

            let sendData = {
                'soapData': null,
                'kouiData': this.shindanData,
                'status': this.meta.status,
                'mode': 'healthcheck',
                'ins': this.meta.ins
            }

            let that = this

            var promise = new Promise(function (resolve, reject) {
                that.$put('records/' + that.meta.id, sendData)
                .then(result => {
                    img.toBlob(function(blob) {
                        let fileData =  {
                            fileList: [new File([blob], "fileName.jpg", { type: "image/png" })],
                            hasFiles: true,
                            fileMeta: {
                                fileInfo: ['xraySchema'],
                                info: that.meta.patientID,
                                type: 11,
                                schemaID: shmID
                            }
                        }
                        that.$post('files', fileData)
                        .then(result => {
                            that.loading = false
                            if (close) {
                                that.$emit('close')
                            }
                            resolve()
                        })
                        .catch(result => {
                            that.$apiError(result)
                            reject()
                        })
                    })
                })
                .catch(result => {
                    that.$apiError(result)
                    reject()
                })
            }) 

            return promise

        },
        cancel() {
            this.$confirm('閉じる前に保存しますか？', 'Warning', {
                confirmButtonText: '保存して閉じる',
                cancelButtonText: '保存せず閉じる',
                type: 'warning'
            }).then(() => {
                this.save().then( () => {
                    this.$emit('close')
                }
                )
            }).catch(() => {
                this.$emit('close')
            })
        }
    }
}
</script>

<style scoped>
.KKSD-switchInput {
    height: 72px
}
</style>