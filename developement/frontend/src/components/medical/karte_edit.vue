<template>
  <div style="height: calc(100% + 20px)">
    <span class="karteButtonsCont">
      <vs-button
        dark
        icon
        animation-type="scale"
        style="min-width: 50px"
      >
        <i class="fas fa-calendar-alt"></i>
        <template #animate>予約</template>
      </vs-button>
      <vs-button
        @click="saveKarte"
        dark
        icon
        animation-type="scale"
        style="min-width: 50px"
      >
        <i class="fas fa-save"></i>
        <template #animate>保存</template>
      </vs-button>
      <vs-button
        dark
        icon
        @click="preCheckPause"
        animation-type="scale"
        style="min-width: 50px"
      >
        <i class="fas fa-pause"></i>
        <template #animate>停止</template>
      </vs-button>
      <vs-button
        @click="preCheckSave"
        primary
        icon
        animation-type="scale"
        style="min-width: 50px"
      >
        <i class="fas fa-check-double"></i>
        <template #animate>終了</template>
      </vs-button>
    </span>
    <vs-row style="height: 100%">
      <vs-col :w="cardWidth[0]" style="height: 100%">
        <div class="content-card">
          <patientHistory
            :patientID="meta.patientID"
            :view="historyTab"
            @changeView="changeView"
            style="height: 100%; overflow: hidden">
          </patientHistory>
        </div>
      </vs-col>
      <vs-col :w="cardWidth[1]" style="height: 100%">
        <div class="content-card">
          <div class="cc-card-header" style="height: 50px">
            <vs-row style="justify-content: space-between">
              <vs-col :w="5">
                <h2>主訴・所見</h2>
              </vs-col>
              <vs-col
                :w="6"
                style="display: flex; justify-content: space-between"
              >
                <h2>行為・処方</h2>
                <vs-avatar
                  v-if="isJihi"
                  warn
                  style="width: 50px; height: 30px; border-radius: 10px"
                >
                  自費
                </vs-avatar>
                <vs-avatar
                  v-if="violationCheckLoading"
                  style="width: 30px; height: 30px"
                  loading
                >
                </vs-avatar>
              </vs-col>
            </vs-row>
          </div>
          <div style="height: calc(100% - 70px)">
            <vs-row style="height: 100%">
              <vs-col :w="5" style="padding: 0 10px; height: 100%">
                <textEditor
                  :meta="meta"
                  headerStyle="margin-left: -15px"
                  style="margin-top: -35px"
                  ref="soapText"
                ></textEditor>
              </vs-col>
              <vs-col :w="7" style="padding: 0 10px; height: 100%">
                <vs-table style="height: 100%" :key="currentKouis.length">
                  <template #notFound>
                    <img
                      style="width: 200px"
                      src="../../assets/img/empty2.jpg"
                    />
                    <div>
                      <b style="color: gray">行為なし</b>
                    </div>
                  </template>
                  <template #thead>
                    <vs-tr style="display: none">
                      <vs-th></vs-th>
                      <vs-th></vs-th>
                      <vs-th></vs-th>
                    </vs-tr>
                  </template>
                  <template #tbody>
                    <vs-tr
                      v-for="(tr, index) in currentKouis"
                      :key="index"
                      class="cc-click-row"
                      style="border-top: solid 5px white"
                      :expanded="tr.expanded"
                      @expandChange="function (val) {tr.expanded = val}"
                    >
                      <vs-td>
                        <i
                          :class="kouiCats[tr.type].icon"
                          style="margin-right: 10px; font-size: 30px"
                        />
                      </vs-td>
                      <vs-td>
                        <div style="display: flex; align-items: center">
                          {{ tr.name }}
                          <vs-tooltip v-if="tr.violation.present" delay="100">
                            <vs-button
                              @click="alert('Need to finish')"
                              icon
                              danger
                              size="small"
                            >
                              <i
                                class="fas fa-exclamation-triangle"
                                style="font-size: 14px"
                              ></i>
                            </vs-button>
                            <template #tooltip>
                              <div v-for="(mess, index) in tr.violation.issue " :key="index">
                                <span v-html="mess"></span>
                              </div>
                            </template>
                          </vs-tooltip>
                        </div>
                      </vs-td>
                      <template #commands>
                        <div style="display: flex; justify-content: flex-end">
                            <vs-button
                              @click="removeKoui(index, tr)"
                              icon danger border
                              size="small"
                              animation-type="scale"
                              class="cc-hover-button"
                              >
                              <i class="far fa-trash-alt" style="font-size: 14px"></i>
                              <template #animate>削</template>
                            </vs-button>
                            <vs-button
                              @click="tr.requiresClose = !tr.requiresClose"
                              :dark="!tr.requiresClose"
                              icon
                              :shadow="!tr.requiresClose"
                              :flat="!tr.requiresClose"
                              :disabled="tr.type === '25' || tr.done"
                              size="small"
                              style="width: 50px"
                              animation-type="scale"
                            >
                              <i
                                class="fas fa-shopping-basket"
                                style="font-size: 14px"
                                v-bind:class="{ unselected: !tr.requiresClose }"
                              ></i>
                              <template #animate><span style="font-size: 6px">オーダー</span></template>
                            </vs-button>
                          <vs-tooltip delay="100">
                            <vs-button
                              @click="dialogs.calc.data = tr; dialogs.calc.open = true"
                              :warn="tr.ins === '0001' && !tr.noCalc && !tr.gai"
                              :danger="tr.gai"
                              :dark="tr.noCalc"
                              :shadow="tr.ins !== '0001' && !tr.gai && !tr.noCalc"
                              icon
                              size="small"
                              style="height: 30px; width: 30px"
                            >
                              <span v-if="tr.ins === '0001' && !tr.noCalc && !tr.gai">自</span>
                              <span v-else-if="tr.noCalc">無</span>
                              <span v-else-if="tr.gai">外</span>
                              <i v-else class="fas fa-yen-sign" style="font-size: 14px"></i>
                            </vs-button>
                            <template #tooltip>会計設定</template>
                          </vs-tooltip>
                          <vs-tooltip delay="100">
                            <vs-button
                              @click="tr.done = !tr.done"
                              :dark="!tr.done"
                              icon
                              :shadow="!tr.done"
                              :flat="!tr.done"
                              :disabled="tr.var.results && tr.var.results.length < 1"
                              size="small"
                              animation-type="scale"
                            >
                              <i
                                class="fas fa-check"
                                style="font-size: 14px"
                                v-bind:class="{ unselected: !tr.done }"
                              ></i>
                              <template #animate>済</template>
                            </vs-button>
                            <template #tooltip>行為実行済</template>
                          </vs-tooltip> 
                        </div>
                      </template>
                      <template #expand>
                        <kouiItem
                          :kouiInit="tr"
                          :insurances="patientData.sets"
                          :mainIns="meta.ins"
                          @shotTypeChange="checkKoui(tr, false, tr.type)"
                          @update="updateKoui(...arguments, index)"
                          @reCheck="reCheckKoui"
                          @showShindan="showKShindan"
                        ></kouiItem>
                      </template>
                    </vs-tr>
                  </template>
                </vs-table>
              </vs-col>
            </vs-row>
          </div>
        </div>
      </vs-col>
      <vs-col :w="cardWidth[2]" style="height: 100%">
        <div class="content-card">
          <kouiList 
            @addKoui="addKoui"
            :currentKouis="currentKouis">
          </kouiList>
        </div>
      </vs-col>
    </vs-row>
    <vs-dialog
      blur
      v-model="dialogs.calc.open"
      width="500px">
      <template #header>
        <h3 class="dialog-title">会計設定・保険選択</h3>
      </template>
      <div v-if="dialogs.calc.data">
        <vs-checkbox @change="calcChange('noCalc')" v-model="dialogs.calc.data.noCalc" >算定しない</vs-checkbox>
        <vs-checkbox @change="calcChange('gai')" v-model="dialogs.calc.data.gai" :disabled="dialogs.calc.data.type === '71'">公費・保険外</vs-checkbox>
        <vs-table striped v-if="dialogs.calc.data.gai" style="height: 300px" v-model="dialogs.calc.data.ins">
          <template #notFound>
              <div>
                  <b style="color: gray">データなし</b>
              </div>
          </template>
          <template #header>
              <div class="cc-table-header-content">
                  <h2>保険組み合わせ</h2>
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
              <vs-tr
                v-for="(tr, i) in availableIns"
                :key="i"
                :data="tr.ID"
                class="cc-click-row" @click="reCheckKoui" 
                :is-selected="dialogs.calc.data.ins == tr.ID"
                >
                  <vs-td> {{ tr.ID }} </vs-td>
                  <vs-td> {{ tr.wholeName }} </vs-td>
                  <vs-td> {{ tr.pub1 }} </vs-td>
                  <vs-td> {{ tr.pub2 }} </vs-td>
                  <vs-td> {{ tr.pub3 }} </vs-td>
                  <vs-td> {{ tr.pub4 }} </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
      <template #footer>
        <vs-button @click="dialogs.calc.open = false; dialogs.calc.data = null" dark>閉じる</vs-button>
      </template>
    </vs-dialog>
    <vs-dialog
      blur
      v-model="dialogs.pause.open"
      width="700px">
      <template #header>
        <h3 class="dialog-title">カルテ一時停止確認</h3>
      </template>
      <div v-if="dialogs.pause.data">
        <vs-table striped  style="height: 200px">
          <template #header>
              <div class="cc-table-header-content">
                  <h2>未済の行為</h2>
              </div>
          </template>
          <template #thead>
              <vs-tr>
                  <vs-th></vs-th>
                  <vs-th></vs-th>
                  <vs-th>行為名</vs-th>
              </vs-tr>
          </template>
          <template #tbody>
              <vs-tr
                v-for="(tr, i) in dialogs.pause.data"
                :key="i"
                >
                  <vs-td>
                    <vs-checkbox
                      :disabled="tr.requiresClose"
                      @change="toggleKouiDone(tr)"
                      :value="tr.done">
                      済
                    </vs-checkbox>
                  </vs-td>
                  <vs-td>
                    <vs-checkbox
                      :disabled="tr.done"
                      @change="toggleKouiOrder(tr)"
                      :value="tr.requiresClose">
                      オーダー
                    </vs-checkbox>
                  </vs-td>
                  <vs-td> {{ tr.name }} </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
      <template #footer>
        <vs-button @click="dialogs.pause.open = false" transparent dark>キャンセル</vs-button>
        <vs-button @click="pauseKarte()" dark>確認</vs-button>
      </template>
    </vs-dialog>
    <vs-dialog
      blur
      v-model="dialogs.commit.open"
      width="700px">
      <template #header>
        <h3 class="dialog-title">カルテ終了確認</h3>
      </template>
      <div v-if="dialogs.commit.data">
        <vs-table striped  style="height: 200px">
          <template #header>
              <div class="cc-table-header-content">
                  <h2>未済の行為</h2>
              </div>
          </template>
          <template #thead>
              <vs-tr>
                  <vs-th></vs-th>
                  <vs-th></vs-th>
                  <vs-th>行為名</vs-th>
              </vs-tr>
          </template>
          <template #tbody>
              <vs-tr
                v-for="(tr, i) in dialogs.commit.data"
                :key="i"
                >
                  <vs-td>
                    <vs-checkbox
                      :disabled="tr.requiresClose"
                      @change="toggleKouiDone(tr)"
                      :value="tr.done">
                      済
                    </vs-checkbox>
                  </vs-td>
                  <vs-td>
                    <vs-checkbox
                      :disabled="tr.done"
                      @change="toggleKouiOrder(tr)"
                      :value="tr.requiresClose">
                      オーダー
                    </vs-checkbox>
                  </vs-td>
                  <vs-td> {{ tr.name }} </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
      <template #footer>
        <vs-button @click="dialogs.commit.open = false" transparent dark>キャンセル</vs-button>
        <vs-button @click="closeKarte()" dark>確認して終了</vs-button>
      </template>
    </vs-dialog>

  </div>
</template>

<script>
import textEditor from "../shared/text_editor"
import kouiList from "../shared/koui_list"
import kouiItem from "../shared/CC_comp_procedure_item"
import patientHistory from "../pateint_history/patient_history_main"

export default {
  components: {
    textEditor: textEditor,
    kouiList: kouiList,
    kouiItem: kouiItem,
    'patientHistory': patientHistory
  },
  props: ["meta"],
  created() {

    this.$get('patients/' + this.meta.patientID)
    .then(result => {
      this.patientData = result.data;
    })
    .catch(result => {
      this.$apiError(result)
    })

    this.$get('records/' + this.meta.id)
    .then(result => {
      this.$refs.soapText.setContent(result.data.soap);
      this.currentKouis = JSON.parse(result.data.koui);
      this.$store.commit("SET_SHINSATU_DATA", {
        patientID: this.meta.patientID,
        shinsatuID: this.meta.id,
        insID: this.meta.ins,
      });
      this.loading = false;
    })
    .catch(result => {
      this.$apiError(result)
    })
  },
  data() {
    return {
      dialogs: {
        calc: {open: false, data: null},
        pause: {open: false, data: null},
        commit: {open: false, data: null,violations: null}
      },
      cardWidth: [4, 5, 3],
      historyTab: "dashboard",
      patientData: {},
      currentKouis: [],
      loading: true,
      violationCheckLoading: false,
      vioCount: 0,
      loadingElm: null,
      kouiCats: this.$store.getters.kouiCats
    };
  },
  computed: {
    availableIns() {
      return this.patientData.sets.filter((ins) => ins.ID !== this.meta.ins);
    },
    isJihi() {
      if (this.meta.ins === "0001") {
        return true;
      } else {
        return false;
      }
    },
    patientAge() {
      let age = 0;
      let bd = this.patientData.birthDate;
      if (this.$moment(bd, "YYYY-M-D", true).isValid()) {
        age = this.$moment().diff(this.$moment(bd, "YYYY-MM-DD"), "years");
      } else {
        age = "";
      }
      return age;
    },
    expandedKoui() {
      let returnArr = [];
      this.currentKouis.forEach((koui) => {
        if (koui.expanded) {
          returnArr.push(koui.tag);
        }
      });
      return returnArr;
    },
    hasPauseOrder() {
      if(!this.dialogs.pause.data) {return false}
      let returnVal = false
      const items = this.dialogs.pause.data.filter(
        (item) => item.requiresClose && !item.done
      );
      if (items.length > 0) {
        returnVal = true;
      }
      return returnVal;
    },
    hasCloseOrder() {
      if(!this.dialogs.commit.data) {return false}
      let returnVal = false
      const items = this.dialogs.commit.data.filter(
        (item) => item.requiresClose && !item.done
      );
      if (items.length > 0) {
        returnVal = true;
      }
      return returnVal;
    },
  },
  
  watch: {
    loading() {
      if (this.loading) {
        this.loadingElm = this.$vs.loading({
              color: 'dark'
          })
      } else if (this.loadingElm) {
        this.loadingElm.close()
      }
    }
  },

  methods: {
    changeView() {
      if (this.cardWidth[0] < 12) {
        this.cardWidth = [12, 0, 0];
      } else {
        this.cardWidth = [4, 5, 3];
      }
    },
    showKShindan() {
      this.$emit("showShindan", this.meta, true);
    },
    addKoui(data) {
      let kindOfUnique =
        't_' + //Just to make sure that the tag is a string. Large numbers cause issues with json parse
        String(this.meta.id) +
        String(new Date().valueOf()) +
        String(Math.floor(Math.random() * 100));
      let koui = {
        tag: kindOfUnique,
        kouiCode: data.koui.kouiid,
        type: data.type,
        name: data.koui.name,
        ins: this.meta.ins,
        gai: false,
        noCalc: false,
        violation: {
          present: false,
          issue: [],
          preventSave: false,
        },
        var: {},
        done: false,
        comment: {
          present: false,
          content: "",
        },
        isExternal: false,
        requiresClose: false,
        expanded: false,
      }
      if (data.type === "60") {
        koui.var.results = [];
      }
      if (data.type === "30" || data.type === "31") {
        koui.var.location = "";
        koui.var.amount = "";
        koui.var.lotNo = "";
        koui.var.medID = koui.kouiCode;
        koui.kouiCode = "130000510";
      }
      if (data.type === "25") {
        koui.var.type = "1"
        koui.var.amount = ""
        koui.var.timing = { name: "指定なし" }
        koui.var.times = ""
        koui.var.unit = data.koui.taniname
      }
      if (data.koui.var) {
        koui.var = data.koui.var
      }
      if (data.koui.comment) {
        koui.comment = data.koui.comment
      }
      this.vioCount = 1
      this.checkKoui(koui);
      this.currentKouis.push(koui)
    },
    removeKoui(index, tr) {
      this.currentKouis.splice(index, 1)
      let kouiWithVio = this.currentKouis.filter(
        (item) => item.violation.present
      )
      this.vioCount = kouiWithVio.length
      kouiWithVio.forEach((item) => {
        this.checkKoui(item, false, false)
      })
    },
    reCheckKoui() {
      this.$nextTick(() => {
        this.vioCount = currentKouis.length
        this.currentKouis.forEach((item) => this.checkKoui(item, true, false))
      })
    },

    checkKoui(newItem, include, type) {
      var filteredKoui = this.currentKouis.filter(
        (item) =>
          item.tag !== newItem.tag && item.ins !== "0001" && !item.noCalc
      );
      let currentCombNr = String(this.meta.ins).padStart(4, "0");
      let insPovNr = this.patientData.sets.find(
        (ins) => ins.ID === currentCombNr
      ).insuranceClass;
      let ignore = false;
      if (newItem.noCalc || newItem.ins === "0001") {
        ignore = true;
      }

      let sendData = {
        patientID: this.meta.patientID,
        patientAge: this.patientAge,
        patientBirthDate: this.patientData.birthDate,
        koui: filteredKoui,
        newKoui: newItem.kouiCode,
        newType: newItem.type,
        newItemIgnore: ignore,
        insPovNr: insPovNr,
      }

      this.violationCheckLoading = true

      this.$post("procedurechecks", sendData)
      .then((result) => {

        if (!result.data.checkOK) {
          newItem.violation.present = true
          if (!newItem.violation.issue.includes(result.data.message)) {
            newItem.violation.issue.push(result.data.message)
          }

          let p = this.currentKouis.find(item => item.kouiCode === result.data.vioCode)
          if (p) {
            p.violation.present = true
            if (!p.violation.issue.includes(result.data.message)) {
              p.violation.issue.push(result.data.message)
            }            
          }

        } else {
          newItem.violation.present = false
          newItem.violation.issue = []
        }
        this.vioCount--
        if (this.vioCount == 0) {
          this.violationCheckLoading = false          
        }
        if (this.currentKouis.length < 1) {
          this.violationCheckLoading = false
        }

      })
      .catch(result => {
        this.$apiError(result)
        this.violationCheckLoading = false
      })

    },

    updateKoui(content, index) {
      //this.currentKouis[index] = content
    },

    preCheckSave() {
      this.dialogs.commit.open = true;
      this.dialogs.commit.data = [];
      this.dialogs.commit.violations = [];
      let vioItems = this.currentKouis.filter((koui) => koui.violation.present);
      vioItems.forEach((vioItem) => {
        vioItem.violation.issue.forEach((message) => {
          let ar = { koui: vioItem.name, message: message };
          this.dialogs.commit.violations.push(ar);
        });
      });
      this.dialogs.commit.data = this.currentKouis.filter(
        (koui) => !koui.done && koui.type !== "25"
      );
    },
    preCheckPause() {
      this.dialogs.pause.open = true;
      this.dialogs.pause.data = this.currentKouis.filter(
        (koui) => !koui.done && koui.type !== "25"
      )
    },

    toggleKouiDone(item) {
      let target = this.currentKouis.find((t) => t.tag === item.tag);
      target.done = !target.done;
    },

    toggleKouiOrder(item) {
      let target = this.currentKouis.find((t) => t.tag === item.tag);
      target.requiresClose = !target.requiresClose;
    },

    saveKarte() {
      this.loading = true;
      let sendData = {
        soapData: this.$refs.soapText.provideData(),
        kouiData: JSON.stringify(this.currentKouis),
        status: 3,
        mode: 'save'
      }

      this.$put('records/' + this.meta.id,sendData )
      .then(result => {
        this.loading = false
        this.$vs.notification({
          duration: 2000,
          color: "primary",
          position: "top-center",
          title: "保存しました！",
          text: "カルテのデータを通常に保存しました",
          icon: '<i class="fas fa-info"></i>',
        })
      })
      .catch(result => {
        this.$apiError(result)
      })
    },

    closeKarte() {
      this.preSaveOpen = false
      this.loading = true

      let sendData = {
        soapData: this.$refs.soapText.provideData(),
        kouiData: JSON.stringify(this.currentKouis),
        hasOrder: this.hasPauseOrder,
        status: this.hasCloseOrder ? 6 : 10,
        meta: this.meta,
        mode: 'close'
      }
      sendData.meta.isHoliday = this.$store.getters.isHoliday
      
      this.$put('records/' + this.meta.id,sendData )
      .then(result => {
        this.loading = false
        this.loadingElm.close()
        this.$vs.notification({
          duration: 2000,
          color: "primary",
          position: "top-center",
          title: "保存しました！",
          text: "カルテを正常に保存しました。",
          icon: '<i class="fas fa-info"></i>',
        })
        this.$emit("close")
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    pauseKarte() {

      this.dialogs.pause.open = false
      this.loading = true

      let sendData = {
        soapData: this.$refs.soapText.provideData(),
        kouiData: JSON.stringify(this.currentKouis),
        hasOrder: this.hasPauseOrder,
        status: this.hasPauseOrder ? 5 : 35,
        mode: 'pause'
      }

      this.$put('records/' + this.meta.id,sendData )
      .then(result => {
        this.loading = false
        this.loadingElm.close()
        this.$vs.notification({
          duration: 2000,
          color: "primary",
          position: "top-center",
          title: "保存しました！",
          text: "カルテの一時停止しました",
          icon: '<i class="fas fa-info"></i>',
        })
        this.$emit("close")
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    calcChange(sel) {
      let target = this.dialogs.calc.data
      if (sel === "noCalc") {
        target.gai = false;
      } else if (sel === "gai") {
        target.noCalc = false;
      }
      if (!target.gai || !target.noCalc) {
        target.ins = this.meta.ins
      }
      this.reCheckKoui()
    }
  }
}
</script>

<style scoped>
.karteButtonsCont {
  display: flex;
  position: absolute;
  right: 10px;
  top: -36px;
}
.unselected {
  color: rgba(var(--vs-dark), 0.3);
}
</style>