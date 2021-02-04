<template>
  <div class="content-card" style="height: calc(100% - 50px)">
    <div class="cc-card-has-header" ref="loadElm">
      <div class="cc-card-header" v-if="newP">
        <h2>新規患者登録</h2>
        <vs-button @click="$emit('cancel')" transparent dark>キャンセル</vs-button>
        <vs-button @click="submit()" primary icon animation-type="scale" style="min-width: 50px">
            <i class="fas fa-save"></i>
            <template #animate>登録</template>
        </vs-button>
      </div>
      <div class="cc-card-header" v-else>
        <h2>患者情報変更</h2>
        <vs-button @click="$emit('cancel')" transparent dark>キャンセル</vs-button>
        <vs-button @click="submit()" primary icon animation-type="scale" style="min-width: 50px">
            <i class="fas fa-save"></i>
            <template #animate>登録</template>
        </vs-button>
      </div>

      <div class="cc-card-content" style="padding: 20px; height: calc(100% - 110px)">
        <vs-row>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="3">
            <span v-if="!newP" style="margin-left: 20px">
              <vs-checkbox v-model="editGB">性別・生年月日編集</vs-checkbox>
            </span>
            <h2>
              <i class="fas fa-user"></i>
              <span style="margin-left: 10px">基本情報</span>
            </h2>
            <vs-input :state="violation.name" label="名前 ＊必須" :disabled="editGB" @input="checkDoublePatient()" v-model="patientData.name" placeholder="名前"/>
            <vs-input :state="violation.nameKana" label="フリガナ" :disabled="editGB" v-model="patientData.nameKana" placeholder="フリガナ"/>
            <div style="display: flex; align-items: center">
              <div style="padding: 0 0 10px 20px">
                <div style="margin-left: 10px; font-size: 12px" 
                  :style="violation.birthDate === 'danger' ? 'color: rgba(var(--vs-danger), 1)' : ''">生年月日</div>
                <date-picker
                    v-model="patientData.birthDate"
                    :append-to-body="false"
                    placeholder="選択"
                    :disabled="!newP && !editGB"
                    @pick="checkDoublePatient()"
                    format="YYYY年MM月DD日"
                    value-type="YYYY-MM-DD"
                    :input-class="violation.birthDate === 'danger' ? 'vs-input cc-mx-input cc-danger-input' : 'vs-input cc-mx-input'"
                    popup-class="cc-date-picker"
                    >
                </date-picker>
              </div>           
              <span style="margin-left: 20px" class="cc-tag" v-if="age !== ''">年齢：{{ age }}年</span>
            </div>
            <div class="cc-radio-input">
              <div class="cc-input-label">性別</div>
              <vs-radio v-model="patientData.gender" val="1">男性</vs-radio>
              <vs-radio v-model="patientData.gender" val="2" style="margin-left: 20px">女性</vs-radio>
            </div>
            <vs-select label="職業" v-model="patientData.occupation" :key="lists.occupations.length">
                <vs-option v-for="(item, i) in lists.occupations" :key="i" :label="item.name" :value="item.id">
                    {{item.name}}
                </vs-option>
            </vs-select>
            <h2>
              <i class="fas fa-map-marked-alt"></i>
              <span style="margin-left: 10px">住所</span>
            </h2>
            <vs-input :state="violation.address_zip" label="郵便番号" @input="getAddrHome()" v-model="patientData.address_zip" placeholder="1420063"/>
            <vs-input :state="violation.address_addr1" label="住所" v-model="patientData.address_addr1" placeholder="東京都品川区荏原"/>
            <vs-input :state="violation.address_addr2" label="建物名・部屋" v-model="patientData.address_addr2" placeholder="クリにビル503"/>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="4">
            <h2>
              <i class="fas fa-phone-square"></i>
              <span style="margin-left: 10px">連絡</span>
            </h2>
            <vs-input label="電話番号" v-model="patientData.phone" placeholder="08012345678"/>
            <vs-input label="メール" v-model="patientData.mail" placeholder="address@mail.com"/>
            <h2>
              <i class="fas fa-building"></i>
              <span style="margin-left: 10px">会社・学校</span>
            </h2>
            <vs-input label="会社・学校名" v-model="patientData.comp_name" placeholder="クリにクリーン"/>
            <vs-input @input="getAddrComp()" label="郵便番号" v-model="patientData.comp_zip" placeholder="1420063"/>
            <vs-input label="住所" v-model="patientData.comp_addr1" placeholder="東京都品川区荏原"/>
            <vs-input label="建物名など" v-model="patientData.comp_addr2" placeholder="ビル4階"/>
            <vs-input label="電話番号" v-model="patientData.comp_phone" placeholder="0312345678"/>
          </vs-col>
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" w="5">
            <h2 style="display: flex; align-items: center; height: 32px">
              <i class="fas fa-id-card"></i>
              <span style="margin-left: 10px">保険組み合わせ情報</span>
            </h2>
            <vs-select label="世帯主" v-model="patientData.householderName" :key="householderList.length" style="margin-top: 25px; width: 200px!important">
                <vs-option v-for="(item, i) in householderList" :key="i" :label="item.hihokensha.name" :value="item.hihokensha.name">
                    {{item.hihokensha.name}}
                </vs-option>
            </vs-select>
            <vs-table style="height:  200px">
              <template #notFound>
                <div>
                  <b style="color: gray">データなし</b>
                </div>
              </template>
              <template #header>
                <div class="cc-table-header-content">
                  <h2>
                    <span style="margin-left: 10px">保険</span>
                  </h2>
                  <vs-button @click="insuranceOpen = true" dark icon animation-type="scale" style="min-width: 50px">
                    <i class="fas fa-plus"></i>
                    <template #animate>登録</template>
                  </vs-button>
                </div>
              </template>
              <template #thead>
                <vs-tr>
                    <vs-th>記号</vs-th>
                    <vs-th>番号</vs-th>
                    <vs-th>保険者番号</vs-th>
                    <vs-th>保険者</vs-th>
                    <vs-th>被保険者</vs-th>
                    <vs-th>有効期限</vs-th>
                    <vs-th></vs-th>
                </vs-tr>
              </template>
              <template #tbody>
                <vs-tr v-for="(tr, i) in insurances" :key="i">
                  <vs-td>{{ tr.kigou }}</vs-td>
                  <vs-td>{{ tr.bangou }}</vs-td>
                  <vs-td>{{ tr.hokenshaNumber }}</vs-td>
                  <vs-td>{{ tr.hokenshaName }}</vs-td>
                  <vs-td>{{ tr.name }}</vs-td>
                  <vs-td><date-display :date="tr.validDate[1]"></date-display></vs-td>
                  <vs-td>
                    <vs-button size="small" dark border style="margin: 0" @click="removeInsurance(i)">
                      <i class="fas fa-trash-alt"></i>
                    </vs-button>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
            <vs-table style="height: 200px">
              <template #notFound>
                <div>
                  <b style="color: gray">データなし</b>
                </div>
              </template>
              <template #header>
                <div class="cc-table-header-content">
                  <h2>
                    <span style="margin-left: 10px">公費</span>
                  </h2>
                  <vs-button @click="kouhiOpen = true" dark icon animation-type="scale" style="min-width: 50px">
                    <i class="fas fa-plus"></i>
                    <template #animate>登録</template>
                  </vs-button>
                </div>
              </template>
              <template #thead>
                <vs-tr>
                  <vs-th>負担者番号</vs-th>
                  <vs-th>受給者番号</vs-th>
                  <vs-th>負担者番号</vs-th>
                  <vs-th>有効期限</vs-th>
                  <vs-th></vs-th>
                </vs-tr>
              </template>
              <template #tbody>
                <vs-tr v-for="(tr, i) in kouhi" :key="i">
                  <vs-td>{{ tr.khFuSha }}</vs-td>
                  <vs-td>{{ tr.khRecp }}</vs-td>
                  <vs-td>{{ tr.khFuSha }}</vs-td>
                  <vs-td><date-display :date="tr.valid[1]"></date-display></vs-td>
                  <vs-td>
                    <vs-button size="small" dark border style="margin: 0" @click="removeKouhi(i)">
                      <i class="fas fa-trash-alt"></i>
                    </vs-button>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-col>
        </vs-row>

        <vs-dialog v-model="insuranceOpen" blur prevent-close>
          <template #header>
            <h3 class="dialog-title">保険追加</h3>
          </template>
          <insuranceNew 
            v-if="insuranceOpen"
            :patientName="patientData.name" 
            @close="insuranceOpen = false"
            @add="addInsurance"
          />
        </vs-dialog>
        <vs-dialog v-model="kouhiOpen" blur>
          <template #header>
            <h3 class="dialog-title">公費追加</h3>
          </template>
          <kouhiNew 
            v-if="kouhiOpen"
            :patientName="patientData.nameLast + patientData.nameFirst" 
            @close="kouhiOpen = false"
            @add="addKouhi"
          />
        </vs-dialog>
        <vs-dialog v-model="newPatientOpen" blur>
          <template #header>
            <h3 class="dialog-title">患者登録しました</h3>
          </template>
          <span>患者番号: {{ newId }} </span>
          <template #footer>
            <div style="display: flex; justify-content: flex-end">
              <vs-button primary @click="$eventHub.$emit('newWalkin', this.newId)">受付する</vs-button>
              <vs-button transparent @click="$emit('cancel')">閉じる</vs-button>
            </div>
          </template>
        </vs-dialog>
      </div>
    </div>
  </div>
</template>

<script>

import insuranceNew from '../shared/insurance_new'
import kouhiNew from '../shared/kouhi_new'

export default {
  components: {
    'insuranceNew': insuranceNew,
    'kouhiNew': kouhiNew
  },
  props: {
    'data': {default: {}},
    'newP': {default: false},
    'caller': {default: null}
  },
  created() {
    this.getLists()
    if (this.newP) {
        this.patientData = {
          id: 0,
          name: 'TestPatient2',
          nameKana: 'TestPatient2',
          birthDate: '1990-01-01',
          gender: 1,
          householderName: '本人',
          relation: 1,
          occupation: 1,
          phone: '08000326702',
          mail: 'test@mail.com',
          address_zip: '1232232',
          address_addr1: '品川区',
          address_addr2: '荏原3-13-16',
          comp_name: 'Cordeos',
          comp_zip: '1234323',
          comp_addr1: '東京千代田区',
          comp_addr2: '基地著４',
          comp_tel: '032345677'
        }
      } else {
        this.patientData = JSON.parse(JSON.stringify(this.data))
        this.patientData.gender = 1
        if (this.data.gender === '2') {
          this.patientData.gender = 2
        }
      }
  },
  data() {
    return {
      newPatientOpen: false,
      loading: false,
      loadingElm: null,
      editGB: false,
      violation: {
        name: '',
        nameKana: '',
        birthDate: '',
        address_zip: '',
        address_addr1: '',
        address_addr2: ''
      },
      patientData: {},
      insurances: [],
      kouhi: [],
      lists: {
        occupations: []
      },
      insuranceOpen: false,
      kouhiOpen: false,
      newId: ''
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
    householderList() {
      let base = [{hihokensha: {name: '本人'}}]
      return base.concat(this.insurances)
    }
  },
  watch: {
    patientData: {
      deep: true,
      handler() {
        this.validate(false)
      }
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
    checkDoublePatient() {

    },
    getAddrHome() {
      if (this.patientData.address_zip.length == 7) {
        this.$get('zips/' + this.patientData.address_zip)
        .then(result => {
          this.patientData.address_addr1 = result.data
        })
        .catch(result => {
          this.$apiError(result)
        })        
      } else {
        this.patientData.address_addr1 = ''
      }
    },
    getAddrComp() {
      if (this.patientData.comp_zip.length == 7) {
        this.$get('zips/' + this.patientData.comp_zip)
        .then(result => {
          this.patientData.comp_addr1 = result.data
        })
        .catch(result => {
          this.$apiError(result)
        })        
      } else {
        this.patientData.comp_addr1 = ''
      }
    },
    removeInsurance(index) {
      this.insurances.splice(index, 1)
      if (this.patientData.householderName === index + 1) {
        this.patientData.householderName = 0
      }
    },
    removeKouhi(index) {
      this.kouhi.splice(index,1)
    },
    getLists() {

      this.$get('occupations')
      .then(result => {
        this.lists.occupations = result.data
        if (!this.newP) {
          let ocID = this.lists.occupations.find(item => item.name === this.patientData.occupation).id
          this.patientData.occupation = ocID
        }
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    addInsurance(data) {
      this.insurances.push(data)
    },
    addKouhi(data) {
      this.kouhi.push(data)
    },
    validate(submitted) {
      let ok = true
      Object.keys(this.violation).forEach(key => {
        if(this.patientData[key] === '') {
          if(submitted) {
            this.violation[key] = 'danger'
            ok = false
          }
        } else {
          this.violation[key] = ''
        }
      })
      return ok
    },
    submitInsurance(id, newPat) {
          let fileData  = {
            fileList: [],
            hasFiles: true,
            fileMeta: {
                fileInfo: [],
                info: id,
                type: 1
            }
          }

          this.kouhi.forEach(item => {
            item.files.forEach(file => {
              fileData.fileList.push(file.data)
              fileData.fileMeta.fileInfo.push('2_' + item.khRecp + '_' + item.khFuSha)
            })
          })
          this.insurances.forEach(item => {
            item.files.forEach(file => {
              fileData.fileList.push(file.data)
              fileData.fileMeta.fileInfo.push('1_' + item.kigou + '_' + item.bangou)
            })
          })
          
          if(fileData.fileList.length < 1) {
            return
          }

          this.$post('files', fileData)
          .then(() => {
            if(newPat) {
              this.$eventHub.$emit('loadingDone')
              this.loading = false
              this.newPatientOpen = true
            } else {
              this.$vs.notification({
                duration: 2000,
                color: "primary",
                position: "top-center",
                title: "保存しました！",
                text: "カルテの患者情報を通常に保存しました",
                icon: '<i class="fas fa-info"></i>',
              });
              this.$eventHub.$emit('loadingDone')
              this.$emit('updatePatient', this.caller)
              this.loading = false
              this.$emit('cancel')
            }
          })
          .catch(result => {
            this.$apiError(result)
          })
    },
    submit() {
      if (this.validate(true)) {
        this.loading = true
        this.patientData.occupationName = this.lists.occupations[this.patientData.occupation].name
        let sendData  = {
          editGB: this.editGB,
          patient: this.patientData,
          insurances: this.insurances,
          kouhi: this.kouhi,
        }
        let insertIns = false

        if(this.kouhi.length > 0 || this.insurances.length > 0) {
          insertIns =  true
        }

        if (this.newP) {

          this.$post('patients', sendData)
          .then(result => {
            this.newId = result.data
            if (insertIns) {
              this.submitInsurance(this.newId, true)
            } else {
              this.$eventHub.$emit('loadingDone')
              this.newPatientOpen = true
            }
          })
          .catch(result => {
            this.$apiError(result)
            this.loading = false
          })
        } else {

          delete sendData.patient.sets
          delete sendData.patient.insurances
          delete sendData.patient.public
          delete sendData.patient.files

          this.submitInsurance(sendData.patient.id, false)

          this.$put('patients/' + sendData.patient.id, sendData)
          .then(result => {
            if (insertIns) {
              this.submitInsurance(sendData.patient.id, false)
            } else {
              this.$vs.notification({
                duration: 2000,
                color: "primary",
                position: "top-center",
                title: "保存しました！",
                text: "カルテの患者情報を通常に保存しました",
                icon: '<i class="fas fa-info"></i>',
              });
              this.$eventHub.$emit('loadingDone')
              this.$emit('updatePatient', this.caller)
              this.loading = false
              this.$emit('cancel')
            }
          })
          .catch(result => {
            this.$apiError(result)
            this.loading = false
          })
        }
      }
    }
  }
}

</script>
