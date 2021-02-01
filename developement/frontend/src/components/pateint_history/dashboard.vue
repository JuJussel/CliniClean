<template>
    <div style="height: calc(100% - 90px); overflow: auto" ref="loadCont">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="7">
                <h2 style="margin-bottom: 5px"> {{ data.basic.patientName }} </h2>
                <div class="cc-info-row">
                    <span style="width: 60px" class="cc-info-row-label">患者番号</span>
                    <vs-input style="width: 120px" readonly v-model="data.basic.patientID"/>
                </div>
                <div class="cc-info-row">
                    <span style="width: 60px"  class="cc-info-row-label">年齢</span>
                    <vs-input style="width: 120px"  readonly icon-after v-model="patientAge">
                        <template #icon>歳</template>
                    </vs-input>
                </div>
                <div class="cc-info-row">
                    <span style="width: 60px" class="cc-info-row-label">性別</span>
                    <vs-input style="width: 120px"  readonly v-model="gender" icon-after>
                        <template #icon>
                            <i v-if="gender==='女性'" class="fas fa-venus"></i>
                            <i v-else class="fas fa-mars"></i>
                        </template>
                    </vs-input>
                </div>
            </vs-col>
            <vs-col w="5">
                <vs-table style="height: 210px" class="cc-vs-table-condensed">
                    <template #header>
                        <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                            基本情報
                            <vs-button
                                @click="showEditBasic"
                                icon
                                dark
                                size="small"
                                animation-type="scale"
                            >
                                <i class="far fa-edit" style="font-size: 14px"></i>
                                <template #animate>編集</template>
                            </vs-button>
                        </h3>
                    </template>
                    <template #thead>
                        <vs-tr style="display: none">
                            <vs-th style="width: 100px"></vs-th>
                            <vs-th></vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <vs-tr danger>
                            <vs-td>血液型</vs-td>
                            <vs-td> {{ data.basic.blood }} </vs-td>
                        </vs-tr>
                        <vs-tr v-if="data.basic.alc !=='不明'">
                            <vs-td>アルコール</vs-td>
                            <vs-td> {{ data.basic.alc }} 杯</vs-td>
                        </vs-tr>
                        <vs-tr v-if="data.basic.tab !=='不明'">
                            <vs-td>タバコ</vs-td>
                            <vs-td> {{ data.basic.tab }} 本</vs-td>
                        </vs-tr>
                        <vs-tr v-if="data.basic.pregnantFlag" style="background: rgba(var(--vs-color), 0.1); color: rgba(var(--vs-color), 1)">
                            <vs-td>妊娠中</vs-td>
                            <vs-td> 予定: {{ data.basic.expectedDate }} </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col w="4">
                <vs-table style="height: 150px" class="cc-vs-table-condensed">
                    <template #notFound>登録なし</template>
                    <template #header>
                        <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                            <span><i class="fas fa-allergies"></i>　アレルギー</span>
                            <vs-button
                                @click="showMultiModal('アレルギー', 'Allergy1', allergies)"
                                icon
                                dark
                                size="small"
                                animation-type="scale"
                            >
                                <i class="fas fa-plus" style="font-size: 14px"></i>
                                <template #animate>登録</template>
                            </vs-button>
                        </h3>
                    </template>
                    <template #thead>
                        <vs-tr style="display: none">
                            <vs-th></vs-th>
                            <vs-th></vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <vs-tr v-for="(tr, index) in allergies" :key="index">
                            <vs-td> {{ tr.name }} </vs-td>
                            <vs-td style="width: 60px">
                                <vs-button
                                    @click="deleteItemAIP(index, 'Allergy1', allergies)"
                                    icon danger border
                                    size="small"
                                    animation-type="scale"
                                    class="cc-hover-button"
                                    >
                                    <i class="far fa-trash-alt" style="font-size: 14px"></i>
                                    <template #animate>削</template>
                                </vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
            <vs-col w="4" style="padding: 0 10px">
                <vs-table style="height: 150px" class="cc-vs-table-condensed">
                    <template #notFound>登録なし</template>
                    <template #header>
                        <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                            <span><i class="fas fa-exclamation-circle"></i>　プロブレム</span>
                            <vs-button
                                @click="showMultiModal('プロブレム', 'Comment1', problems)"
                                icon
                                dark
                                size="small"
                                animation-type="scale"
                            >
                                <i class="fas fa-plus" style="font-size: 14px"></i>
                                <template #animate>登録</template>
                            </vs-button>
                        </h3>
                    </template>
                    <template #thead>
                        <vs-tr style="display: none">
                            <vs-th></vs-th>
                            <vs-th></vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <vs-tr v-for="(tr, index) in problems" :key="index">
                            <vs-td> {{ tr.name }} </vs-td>
                            <vs-td style="width: 60px">
                                <vs-button
                                    @click="deleteItemAIP(index, 'Comment1', problems)"
                                    icon danger border
                                    size="small"
                                    animation-type="scale"
                                    class="cc-hover-button"
                                    >
                                    <i class="far fa-trash-alt" style="font-size: 14px"></i>
                                    <template #animate>削</template>
                                </vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
            <vs-col w="4">
                <vs-table style="height: 150px" class="cc-vs-table-condensed">
                    <template #notFound>登録なし</template>
                    <template #header>
                        <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                            <span><i class="fas fa-virus"></i>　感染症</span>
                            <vs-button
                                @click="showMultiModal('感染症', 'Infection1', infections)"
                                icon
                                dark
                                size="small"
                                animation-type="scale"
                            >
                                <i class="fas fa-plus" style="font-size: 14px"></i>
                                <template #animate>登録</template>
                            </vs-button>
                        </h3>
                    </template>
                    <template #thead>
                        <vs-tr style="display: none">
                            <vs-th></vs-th>
                            <vs-th></vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <vs-tr v-for="(tr, index) in infections" :key="index">
                            <vs-td> {{ tr.name }} </vs-td>
                            <vs-td style="width: 60px">
                                <vs-button
                                    @click="deleteItemAIP(index, 'Infection1', infections)"
                                    icon danger border
                                    size="small"
                                    animation-type="scale"
                                    class="cc-hover-button"
                                    >
                                    <i class="far fa-trash-alt" style="font-size: 14px"></i>
                                    <template #animate>削</template>
                                </vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
        <vs-table style="height: 210px; margin-top: 30px" class="cc-vs-table-condensed">
            <template #header>
                <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                    <span><i class="fas fa-disease"></i>　病名</span>
                    <vs-button
                        @click="showByoumeiEdit('add', null)"
                        icon dark
                        size="small"
                        animation-type="scale"
                        >
                        <i class="fas fa-plus" style="font-size: 14px"></i>
                        <template #animate>登録</template>
                    </vs-button>
                </h3>
            </template>
            <template #thead>
                <vs-tr>
                    <vs-th>病名</vs-th>
                    <vs-th>疑い・急性</vs-th>
                    <vs-th>主病</vs-th>
                    <vs-th>開始日</vs-th>
                    <vs-th></vs-th>
                </vs-tr>
            </template>
            <template #tbody>
                <vs-tr v-for="(tr, index) in byoumeiActive" :key="index">
                    <vs-td> {{ tr.Disease_Name }} </vs-td>
                    <vs-td> {{ utagaiDecode(tr.Disease_SuspectedFlag )}} </vs-td>
                    <vs-td><span v-if="tr.Disease_Category === 'PD'">主病</span></vs-td>
                    <vs-td><dateDisplay :date="tr.Disease_StartDate"></dateDisplay></vs-td>
                    <vs-td style="width: 60px">
                        <vs-button
                            @click="showByoumeiEdit('edit', tr)"
                            icon dark border
                            size="small"
                            animation-type="scale"
                            class="cc-hover-button"
                            >
                            <i class="far fa-edit" style="font-size: 14px"></i>
                            <template #animate>編集</template>
                        </vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <vs-table style="height: 50px; margin-bottom: 20px">
            <template #header>
                <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                    <span><i class="fas fa-sticky-note"></i>　メモ</span>
                    <vs-button
                        @click="editNote(false)"
                        icon
                        dark
                        size="small"
                        animation-type="scale"
                    >
                        <i class="fas fa-plus" style="font-size: 14px"></i>
                        <template #animate>登録</template>
                    </vs-button>
                </h3>
            </template>
        </vs-table>
        <vs-card v-for="(tr, index) in data.notes" :key="index" style="margin: 10px 0px">
            <template #title>
                <div style="display: flex; justify-content: space-between">
                    <h4>{{ tr.insertDate }}</h4>
                        <vs-button
                            @click="editNote(tr)"
                            icon dark border
                            size="small"
                            animation-type="scale"
                            class="cc-hover-button"
                            >
                            <i class="far fa-edit" style="font-size: 14px"></i>
                            <template #animate>編集</template>
                        </vs-button>
                </div>
            </template>
            <template #text>
                {{  tr.note }}
            </template>
            <template #buttons>
            </template>
        </vs-card>
        <vs-dialog
            blur
            v-model="editBasicOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title">患者情報編集</h3>
            </template>
            <vs-row style="padding: 10px">
                <vs-col w="6">
                    <vs-checkbox v-model="editBasicData.pregnantFlag" dark>妊娠中</vs-checkbox>
                    <div style="padding-top: 10px">
                    <div style="margin-left: 10px; font-size: 12px">予定日</div>
                        <date-picker
                            v-model="editBasicData.expectedDate"
                            :disabled="!editBasicData.pregnantFlag"
                            :append-to-body="false"
                            placeholder="選択"
                            format="YYYY年MM月DD日"
                            value-type="YYYY-MM-DD"
                            input-class="vs-input cc-mx-input"
                            popup-class="cc-date-picker"
                            >
                        </date-picker>
                    </div>
                </vs-col>
                <vs-col w="6">
                    <vs-select label="血液型" placeholder="選択" v-model="editBasicData.blood" :key="bloodTypes.length">
                        <vs-option v-for="(item, i) in bloodTypes" :key="i" :label="item" :value="item">
                            {{item}}
                        </vs-option>
                    </vs-select>
                    <vs-input icon-after label="アルコール" v-model="editBasicData.alc" placeholder="入力">
                        <template #icon>杯</template>
                    </vs-input>
                    <vs-input icon-after label="タバコ" v-model="editBasicData.tab" placeholder="入力">
                        <template #icon>本</template>
                    </vs-input>
                </vs-col>
            </vs-row>
            <template #footer>
                <vs-button @click="editBasicOpen = false" transparent dark>キャンセル</vs-button>
                <vs-button @click="saveEditBasic" dark>保存</vs-button>
            </template>
        </vs-dialog>
        <vs-dialog
            blur
            v-model="multiModalOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> {{ multiModal.title }} 登録</h3>
            </template>
                <vs-input :label="multiModal.title + '名'" v-model="multiModal.data.name" @keyup.enter.native="saveMultiModal"></vs-input>
            <template #footer>
                <vs-button @click="multiModalOpen = false" transparent dark>キャンセル</vs-button>
                <vs-button @click="saveMultiModal" dark :disabled="multiModal.data.name === ''">保存</vs-button>
            </template>
        </vs-dialog>
        <vs-dialog
            blur
            v-model="editByoumeiOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> {{ byoumeiModal.title }} </h3>
            </template>
            <byoumeiEdit
                v-if="editByoumeiOpen"
                :byoumeiData="byoumeiModal.data"
                :mode="byoumeiModal.mode"
                @save="saveByoumei"
                @close="editByoumeiOpen = false"
            />
        </vs-dialog>
        <vs-dialog
            blur
            v-model="editnoteOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title">メモ追加・編集</h3>
            </template>
            <noteEdit
                v-if="editnoteOpen"
                :noteData="noteModal"
                @confirm="$emit('update')"
                @close="editnoteOpen = false"
            />
        </vs-dialog>
    </div>
</template>

<script>
import byoumeiEdit from '../shared/byoumei_edit'
import noteEdit from '../shared/note_edit'

export default {
    components: {
        'byoumeiEdit': byoumeiEdit,
        'noteEdit': noteEdit
    },
    props: {
        data: {default: null}
    },
    data() {
        return {
            display: {
                multi: true,
                byoumei: true,
                notes: true
            },
            editnoteOpen: false,
            editBasicOpen: false,
            editBasicData: {},
            multiModalOpen: false,
            editByoumeiOpen: false,
            bloodTypes: [
                '不明',
                '0-',
                '0+',
                'A-',
                'A+',
                'B-',
                'B+',
                'AB-',
                'AB+'
            ],
            loading: false,
            loadingElm: null,
            multiModal: {
                title: '',
                meta: '',
                data: {name: ''},
                current: []
            },
            byoumeiModal: {
                mode: null,
                title: null,
                data: undefined
            },
            noteModal: {
                note: null,
                edit: false
            },
            lists: {
                utagai: {
                    'S': '疑い',
                    'A': '急性',
                    'SA': '疑いかつ急性'
                }
            }
        }
    },
    watch: {
        loading() {
            if (this.loading) {
                this.loadingElm = this.$vs.loading({
                    target: this.$refs.loadCont,
                    color: 'dark'
                })
            } else {
                this.loadingElm.close()
            }
        }
    },
    computed: {
        patientAge() {
            return this.$moment().diff(this.data.basic.birthDate, 'years') // 1
        },
        gender() {
            if (this.data.basic.gender == 1) {
                return '男性'
            } else {
                return '女性'
            }
        },
        allergies() {
            let returnArr = []
            this.data.Allergy1.forEach(item => {
                returnArr.push({name: item})
            })
            return returnArr
        },
        problems() {
            let returnArr = []
            this.data.Comment1.forEach(item => {
                returnArr.push({name: item})
            })
            return returnArr
        },
        infections() {
            let returnArr = []
            this.data.Infection1.forEach(item => {
                returnArr.push({name: item})
            })
            return returnArr
        },
        byoumeiActive() {
            return this.data.byoumei.filter(item => !item.Disease_OutCome)
        }
    },
    methods: {
        showEditBasic() {
            this.editBasicData = {
                pregnantFlag: this.data.basic.pregnantFlag,
                expectedDate: this.data.basic.expectedDate,
                alc: this.data.basic.alc,
                tab: this.data.basic.tab,
                blood: this.data.basic.blood
            }
            this.editBasicOpen = true
        },
        saveEditBasic() {
            this.loading = true
            this.editBasicOpen = false
            let sendData = {
                mode: 'basicEdit',
                patientData: this.data.basic,
                raw: this.data.raw,
                insertData: this.editBasicData
            }

            this.$put('medicalinfos/' + this.data.basic.patientID, sendData)
            .then(result => {
                this.$emit('update')
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
            })

        },
        showMultiModal(title, meta, current) {
            this.multiModalOpen = true
            this.multiModal.current = current
            this.multiModal.data.name = ''
            this.multiModal.title = title
            this.multiModal.meta = meta
        },
        saveMultiModal() {
            if (this.multiModal.data.name === '') {
                return
            }
            this.loading = true
            this.multiModalOpen = false
            this.multiModal.current.push({name: this.multiModal.data.name})
            let sendData = {
                mode:'allprinfEdit',
                patientData: this.data.basic,
                raw: this.data.raw,
                insertData: {
                    value: this.multiModal.current, 
                    target: this.multiModal.meta,
                    addValue: this.multiModal.data.name
                }
            }

            this.$put('medicalinfos/' + this.data.basic.patientID, sendData)
            .then(result => {
                this.$emit('update')
                this.loading = false
            })
            .catch(resutl => {
                this.$apiError(result)
            })

        },
        saveByoumei(bm) {
            this.loading = true
            bm.patient_ID = this.$store.getters.activePatient
            bm.shinsatu_ID = this.$store.getters.activeShinsatu
            bm.Disease_Single = bm.Disease_Single.Disease_Single_child.Disease_Single_Code
            delete bm['@attributes']

            this.$put('diseases/' + bm.patient_ID, bm)
            .then(result => {
                this.$emit('update')
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        deleteItemAIP(index, target, arr) {
            this.loading = true
            let sendData = JSON.parse(JSON.stringify(arr))
            let removeValue = sendData[index].name
            sendData.splice(index, 1);

            sendData = {
                mode:'allprinfEdit',
                patientData: this.data.basic,
                raw: this.data.raw,
                insertData: {
                    value: sendData, 
                    target: target,
                    removeValue:  removeValue
                }
            }

            this.$put('medicalinfos/' + this.data.basic.patientID, sendData)
            .then(result => {
                this.$emit('update')
                this.loading = false
            })
            .catch(resutl => {
                this.$apiError(result)
            })

        },
        showByoumeiEdit(mode, data) {
            this.byoumeiModal.data = undefined
            let title = '病名登録'
            if(mode === 'edit') {
                title = '病名編集'
                this.byoumeiModal.data = data
            }
            this.byoumeiModal.mode = mode
            this.byoumeiModal.title = title
            this.editByoumeiOpen = true
        },
        utagaiDecode(value) {
            if(value) {
                return this.lists.utagai[value]
            } else {
                return ''
            }
        },
        saveNote(note, mode) {

        },
        editNote(note) {
            this.noteModal = {
                note: null,
                edit: false
            }
            this.noteModal.edit = false
            if (note) {
                this.noteModal = note
                this.noteModal.edit = true
            }
            this.editnoteOpen = true
        }
    }
}
</script>

<style scoped>
.hidden {
    display: none!important
}
.note {
    border: solid 1px #cccccc;
    border-radius: 4px;
    padding: 10px;
    color: #606266;
    word-break: break-all
}
.noteHover:hover * {
    opacity: 1!important;
}
</style>