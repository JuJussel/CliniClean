<template>
    <div>
            <div>
                <div class="cc-card-header" style="border-radius: 15px; margin:10px" v-if="!preview">
                    <h2 style="margin-right: 20px">患者情報</h2>
                    <vs-button
                        @click="fileUploadVisible = true"
                        v-if="$acl('patient', 2)"
                        dark
                        icon
                        animation-type="scale"
                        style="min-width: 100px"
                        >
                        <i class="fas fa-file-medical"></i>
                        <template #animate>ファイル登録</template>
                    </vs-button>
                    <vs-button
                        @click="$emit('edit', patientData)"
                        v-if="$acl('patient', 2)"
                        dark
                        icon
                        animation-type="scale"
                        style="min-width: 50px"
                        >
                        <i class="fas fa-edit"></i>
                        <template #animate>編集</template>
                    </vs-button>
                    <vs-button-group>
                        <vs-button
                        border
                        dark
                        :active="activeTab == index"
                        v-for="(tab, index) in tabs"
                        :key="index"
                        @click="activeTab = index"
                        >
                            <span> {{ tab }} </span>
                        </vs-button>
                        <vs-button
                            border
                            dark
                            :active="activeTab == index + 4"
                            v-for="(tab, index) in tabsMedicalAuth"
                            :key="index + 4"
                            @click="activeTab = index + 4; activeTabMeta = tab"
                            >
                            <span> {{ tab.label }} </span>
                        </vs-button>
                    </vs-button-group>
                </div>
                <div v-else class="cc-card-header" style="border-radius: 15px; margin:10px">
                    <h2>患者情報</h2>
                </div>
            </div>
            <div style="height: calc(100% - 64px); display: flex" ref="loadElm">
                <div style="flex-grow: 1" class="hidden-tab" v-bind:class="{'active-tab': 0 == activeTab}">
                    <vs-row style="padding-left: 30px; height: 100%; overflow: auto">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="4">
                            <h2>
                                <i class="fas fa-user"></i>
                                <span style="margin-left: 10px">基本情報</span>
                            </h2>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">患者番号</span>
                                <vs-input readonly v-model="patientData.id"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">名前</span>
                                <vs-input readonly v-model="patientData.name"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">フリガナ</span>
                                <vs-input readonly v-model="patientData.nameKana"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">生年月日</span>
                                <vs-input type="date" readonly v-model="patientData.birthDate"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">年齢</span>
                                <vs-input readonly v-model="age"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">性別</span>
                                <vs-input readonly v-model="parsedSex"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">職業</span>
                                <vs-input readonly v-model="patientData.occupation"/>
                            </div>
                            <h2>
                                <i class="fas fa-map-marked-alt"></i>
                                <span style="margin-left: 10px">住所</span>
                            </h2>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">郵便番号</span>
                                <vs-input readonly v-model="patientData.address_zip"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">住所</span>
                                <vs-input readonly v-model="patientData.address_addr1"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">番地番号</span>
                                <vs-input readonly v-model="patientData.address_addr2"/>
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="4">
                            <h2>
                                <i class="fas fa-phone-square"></i>
                                <span style="margin-left: 10px">連絡</span>
                            </h2>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">電話番号</span>
                                <vs-input readonly v-model="patientData.phone"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">メール</span>
                                <vs-input readonly v-model="patientData.mail"/>
                            </div>
                            <h2>
                                <i class="fas fa-building"></i>
                                <span style="margin-left: 10px">会社・学校</span>
                            </h2>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">会社・学校名</span>
                                <vs-input readonly v-model="patientData.comp_name"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">郵便番号</span>
                                <vs-input readonly v-model="patientData.comp_zip"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">住所</span>
                                <vs-input readonly v-model="patientData.comp_addr1"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">建物名など</span>
                                <vs-input readonly v-model="patientData.comp_addr2"/>
                            </div>
                            <div class="cc-info-row">
                                <span class="cc-info-row-label">電話番号</span>
                                <vs-input readonly v-model="patientData.comp_tel"/>
                            </div>

                        </vs-col>
                    </vs-row>
                </div>
                <div v-if="!preview" style="flex-grow: 1; padding: 30px; display: flex; flex-direction: column" class="hidden-tab" v-bind:class="{'active-tab': 1 == activeTab}">
                    <vs-table striped style="height: 300px" border>
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                            <div>
                                <b style="color: gray">登録なし</b>
                            </div>
                        </template>
                        <template #header>
                            <div class="cc-table-header-content">
                                <h2>有効保険組み合わせ</h2>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr>
                                <vs-th>セット番号</vs-th>
                                <vs-th>保険</vs-th>
                                <vs-th>公費１</vs-th>
                                <vs-th>公費２</vs-th>
                                <vs-th>公費３</vs-th>
                                <vs-th>公費４</vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr v-for="(tr, i) in patientData.sets" :key="i" :data="tr">
                                <vs-td> {{ tr.ID }} </vs-td>
                                <vs-td> {{ tr.wholeName }} </vs-td>
                                <vs-td> {{ tr.pub1 }} </vs-td>
                                <vs-td> {{ tr.pub2 }} </vs-td>
                                <vs-td> {{ tr.pub3 }} </vs-td>
                                <vs-td> {{ tr.pub4 }} </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-table striped style="height: 300px">
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                            <div>
                                <b style="color: gray">登録なし</b>
                            </div>
                        </template>
                        <template #header>
                            <div class="cc-table-header-content">
                                <h2>有効保険</h2>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr>
                                <vs-th>保険</vs-th>
                                <vs-th>保険者番号</vs-th>
                                <vs-th>本家</vs-th>
                                <vs-th>記号</vs-th>
                                <vs-th>番号</vs-th>
                                <vs-th>有効開始</vs-th>
                                <vs-th>有効終了</vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr v-for="(tr, i) in patientData.insurances.insurances" :key="i" :data="tr">
                                <vs-td> {{ tr.InsuranceProvider_WholeName }} </vs-td>
                                <vs-td> {{ tr.InsuranceProvider_Number }} </vs-td>
                                <vs-td>
                                    <span v-if="tr.RelationToInsuredPerson === '1'">本人</span>
                                    <span v-else>家族</span>
                                </vs-td>
                                <vs-td> {{ tr.HealthInsuredPerson_Symbol }} </vs-td>
                                <vs-td> {{ tr.HealthInsuredPerson_Number }} </vs-td>
                                <vs-td> <dateDisplay :date="tr.Certificate_StartDate"></dateDisplay></vs-td>
                                <vs-td> <dateDisplay :date="tr.Certificate_ExpiredDate"></dateDisplay></vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-table striped style="height: 300px">
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                            <div>
                                <b style="color: gray">登録なし</b>
                            </div>
                        </template>
                        <template #header>
                            <div class="cc-table-header-content">
                                <h2>有効公費</h2>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr>
                                <vs-th>保険</vs-th>
                                <vs-th>負担者番号</vs-th>
                                <vs-th>受給者番号</vs-th>
                                <vs-th>有効開始</vs-th>
                                <vs-th>有効終了</vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr v-for="(tr, i) in patientData.insurances.public" :key="i" :data="tr">
                                <vs-td> {{ tr.PublicInsurance_Name }} </vs-td>
                                <vs-td> {{ tr.PublicInsurer_Number }} </vs-td>
                                <vs-td> {{ tr.PublicInsuredPerson_Number }} </vs-td>
                                <vs-td><dateDisplay :date="tr.Certificate_StartDate"></dateDisplay></vs-td>
                                <vs-td><dateDisplay :date="tr.Certificate_ExpiredDate"></dateDisplay></vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>

                </div>
                <div v-if="!preview" style="flex-grow: 1; padding: 30px" class="hidden-tab" v-bind:class="{'active-tab': 2 == activeTab}">
                    <vs-table striped style="height: 100%">
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                            <div>
                                <b style="color: gray">登録なし</b>
                            </div>
                        </template>
                        <template #header>
                            <div class="cc-table-header-content">
                                <h2>ファイル一覧</h2>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr>
                                <vs-th>タイプ</vs-th>
                                <vs-th>説明</vs-th>
                                <vs-th>種類</vs-th>
                                <vs-th>日付</vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr
                                v-for="(tr, i) in patientData.files"
                                :key="i" :data="tr"
                                @click="openFile(tr.file, tr.ext)"
                                class="cc-click-row">
                                <vs-td> {{ tr.typeName }} </vs-td>
                                <vs-td> {{ tr.name }} </vs-td>
                                <vs-td> 
                                    <i v-if="tr.ext === 'pdf'" class="far fa-file-pdf" style="font-size: 18px"></i>
                                    <i v-if="tr.ext === 'xlsx'" class="far fa-file-excel" style="font-size: 18px"></i>
                                    <i v-if="tr.ext === 'docx'" class="far fa-file-word" style="font-size: 18px"></i>
                                    <i v-if="tr.ext === 'png' || tr.ext === 'jpg' || tr.ext === 'jpeg'" class="far fa-file-image" style="font-size: 18px"></i>
                                    <span style="margin-left: 10px">{{ tr.ext }}</span>
                                </vs-td>
                                <vs-td><dateDisplay :date="tr.insert_date"></dateDisplay></vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-if="!preview && $acl('patient.medical', 1)" style="flex-grow: 1" class="hidden-tab" v-bind:class="{'active-tab': 3 < activeTab}">
                    <component 
                        v-if="activeTab > 3"
                        :is="activeTabMeta.name"
                        :data="patientDataMedical"
                        landscape
                        :edit="false"
                    />
                </div>
            </div>
            <vs-dialog v-model="fileUploadVisible" blur prevent-close>
                <template #header>
                    <h3 class="dialog-title">ファイル登録</h3>
                </template>
                <fileUpload :patient="patientData.id" @uploaded="updateData" @close="fileUploadVisible = false"></fileUpload>
            </vs-dialog>
    </div>
</template>

<script>

import fileUpload from '../shared/CC_comp_file_upload'
import vitals from '../pateint_history/CC_view_patient_history_vitals'
import meds from '../pateint_history/CC_view_patient_history_meds'
import koui from '../pateint_history/CC_view_patient_history_procedure'
import byoumei from '../pateint_history/CC_view_patient_history_disease'
import karte from '../pateint_history/CC_view_patient_history_record_history'
import kensa from '../pateint_history/CC_view_patient_history_kensa'

export default {
    components: {
        'fileUpload': fileUpload,
        'vitals': vitals,
        'meds': meds,
        'koui': koui,
        'byoumei': byoumei,
        'karte': karte,
        'kensa': kensa
    },
    props: {
        data: {default: null},
        preview: {type: Boolean, default: false}
    },
    created() {
        this.updateData()
    },
    data() {
        return {
            loading: false,
            loadingElm: null,
            activeTab: 0,
            activeTabMeta: null,
            fileUploadVisible: false,
            patientData: {},
            patientDataMedical: null,
            lists: [],
            tabs: [
                '基本',
                '保険',
                'ファイル',
                'ソーシャル'
            ],
            tabsMedical: [
                {label: "バイタル", name: "vitals", icon: "fas fa-chart-line"},
                {label: "検査", name: "kensa", icon: "fas fa-microscope"},
                {label: "処方歴", name: "meds", icon: "fas fa-pills"},
                {label: "行為歴", name: "koui", icon: "fas fa-list"},
                {label: "病歴", name: "byoumei", icon: "fas fa-disease"},
                {label: "カルテ歴", style: "padding: 0", name: "karte", icon: "fas fa-file-alt"}
            ]
        }
    },
    computed: {
        age() {
            let age = 0
            let bd = this.patientData.birthDate
            if (this.$moment(bd, 'YYYY-M-D', true).isValid()) {
                age = this.$moment().diff(this.$moment(bd, 'YYYY-MM-DD'), 'years')
            } else {
                age = ''
            }
            return age;
        },
        tabsMedicalAuth() {
            if (this.$acl('patient.medical', 1)) {
               return this.tabsMedical 
            }
            return []
        },
        parsedSex() {
            if(this.patientData.gender == 1) return '男性'
            return '女性'
        }
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
        }
        }
    },
    methods: {
        updateData() {
            
            this.loading = true
            this.$get('patients/' + this.data.id)
            .then(result => {
                this.patientData = result.data
                if (this.$acl('patient.medical', 1)) {
                    this.$get('medicalinfos/' + this.data.id)
                    .then(result => {
                        this.patientDataMedical = result.data
                        this.loading = false
                    })
                    .catch(result => {
                        this.$apiError(result)
                    })
                } else {
                    this.loading = false
                }
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })
        },
        openFile(file, ext) {
            window.open(this.$globals.filesUrl +  file + '.' + ext, '_blank', "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10")
        }
    }
}
</script>
<style scoped>
.cc-info-row-label {
    width: 100px
}

</style>