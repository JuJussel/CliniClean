<template>
  <div style="height: 100%; position: relative" ref="loadElm">
    <vs-row style="margin: 0; height: calc(50%)">
      <vs-col w="4" style="height: 100%">
        <div class="content-card">
          <vs-table ref="resCont">
            <template #notFound>
              <img style="width: 200px" src="../../assets/img/empty2.jpg" />
              <div>
                <b style="color: gray">予約なし</b>
              </div>
            </template>
            <template #header>
              <div class="cc-table-header-content">
                <h2>予約</h2>
                <vs-button
                  @click="resOpen = true"
                  dark
                  icon
                  v-if="$acl('reception', 2)"
                  animation-type="scale"
                  style="min-width: 50px"
                >
                  <i class="fas fa-plus"></i>
                  <template #animate>登録</template>
                </vs-button>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th>名前</vs-th>
                <vs-th style="min-width: 80px">診察内容</vs-th>
                <vs-th style="width: 60px">時間</vs-th>
                <vs-th style="width: 80px"></vs-th>
                <vs-th></vs-th>
              </vs-tr>
            </template>
            <template #tbody>
              <vs-tr v-for="(tr, i) in reservation" :key="i" :data="tr">
                <vs-td> {{ tr.name }} </vs-td>
                <vs-td>
                  <span v-if="shinsatuTypes.length > 0">
                    {{ shinsatuTypes.find((e) => e.id == tr.type).name }}
                  </span>
                </vs-td>
                <vs-td>
                  {{ $moment(tr.time, "H:mm:ss").format("H:mm") }}
                </vs-td>
                <vs-td>
                  <vs-button
                    shadow
                    v-if="$acl('reception', 2)"
                    @click="resToRecOpen(tr)"
                    style="width: 60px"
                    >受付</vs-button
                  >
                </vs-td>
                <vs-td>
                  <vs-tooltip right>
                    <i class="fas fa-info-circle"></i>
                    <template #tooltip>
                      {{ tr.memo }}
                    </template>
                  </vs-tooltip>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vs-col>
      <vs-col w="8" style="height: 100%">
        <div class="content-card">
          <vs-table ref="recCont">
            <template #notFound>
              <img style="width: 200px" src="../../assets/img/empty2.jpg" />
              <div>
                <b style="color: gray">受付なし</b>
              </div>
            </template>
            <template #header>
              <div class="cc-table-header-content">
                <h2>外来一覧</h2>
                <vs-button
                  @click="recOpen = true"
                  dark
                  icon
                  v-if="$acl('reception', 2)"
                  animation-type="scale"
                  style="min-width: 50px"
                >
                  <i class="fas fa-plus"></i>
                  <template #animate>受付</template>
                </vs-button>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th><span style="margin-left: 70px">名前</span></vs-th>
                <vs-th>診察内容</vs-th>
                <vs-th>ステータス</vs-th>
                <vs-th>メモ</vs-th>
                <vs-th>待ち時間</vs-th>
                <vs-th>受付時間</vs-th>
              </vs-tr>
            </template>
            <template #tbody>
              <vs-tr v-for="(tr, i) in receptionWaiting" :key="i" :data="tr">
                <vs-td>
                  <span
                    style="
                      display: flex;
                      position: relative;
                      align-items: center;
                    "
                  >
                    <span
                      style="
                        width: 65px;
                        display: flex;
                        justify-content: flex-end;
                      "
                    >
                      <vs-button
                        @click="
                          paymentSelect = tr;
                          paymentOpen = true;
                        "
                        shadow
                        v-if="tr.status === 10 && $acl('reception', 2)"
                        >会計</vs-button
                      >
                      <i
                        v-if="tr.locked === 1"
                        class="el-icon-lock"
                        style="margin-right: 5px; font-size: 18px"
                      ></i>
                      <i
                        v-if="tr.status === 3"
                        class="fas fa-diagnoses status-icon"
                      ></i>
                      <i
                        v-if="tr.status === 2"
                        class="fas fa-user-clock status-icon"
                        style="color: #03a9f4"
                      ></i>
                    </span>
                    <span
                      v-if="tr.update"
                      class="vs-avatar__badge top-left cc-badge"
                    ></span>
                    <span>{{ tr.name }}</span>
                  </span>
                </vs-td>
                <vs-td>
                  <span v-if="shinsatuTypes.length > 0">
                    {{ shinsatuTypes.find((e) => e.id == tr.type).name }}
                  </span>
                </vs-td>
                <vs-td>
                  <vs-select
                    :disabled="
                      tr.status === 36 || tr.status === 5 || tr.status === 6 || tr.locked === 1
                    "
                    v-model="tr.status"
                    :key="tr.status.length"
                    @input="selectStatusItem(tr)"
                    style="margin: 0; width: 150px !important"
                  >
                    <vs-option
                      v-for="item in statiFunc(tr)"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      :disabled="
                        !allowedStates[tr.type][tr.status].includes(item.id)
                      "
                    >
                      {{ item.name }}
                    </vs-option>
                  </vs-select>
                </vs-td>
                <vs-td>
                  <vs-tooltip v-if="tr.memo !== ''" top style="width: 15px">
                    <i class="fas fa-info-circle"></i>
                    <template #tooltip>
                      {{ tr.memo }}
                    </template>
                  </vs-tooltip>
                </vs-td>
                <vs-td>
                  <vs-avatar
                    :warn="
                      waitTime(tr.lastChange).diff > 20 &&
                      waitTime(tr.lastChange).diff < 36
                    "
                    size="30"
                    :danger="waitTime(tr.lastChange).diff > 35"
                    style="width: 50px; border-radius: 7px"
                  >
                    <template #text>
                      {{ waitTime(tr.lastChange).time }}
                    </template>
                  </vs-avatar>
                </vs-td>
                <vs-td>
                  {{ $moment(tr.time, "H:mm:ss").format("H:mm") }}
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vs-col>
    </vs-row>
    <vs-row style="margin: 0; height: calc(50%)">
      <vs-col w="2" style="height: 100%">
        <div class="content-card">
          <vs-table>
            <template #header>
              <div class="cc-table-header-content">
                <h2>医師状況</h2>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th>医師</vs-th>
                <vs-th>ステータス</vs-th>
              </vs-tr>
            </template>
            <template #tbody>
              <vs-tr v-for="(tr, i) in doctors" :key="i" :data="tr">
                <vs-td> {{ tr.name }} </vs-td>
                <vs-td> {{ tr.status === 1 ? "空" : "診察中" }} </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vs-col>
      <vs-col w="7" style="height: 100%">
        <div class="content-card" id="calCont">
          <calendar
            ref="calendar"
            v-if="calendarReady"
            @eventClick="editReservation"
            style="border-radius: 0 0 15px 15px; overflow:hidden; margin-right: -2px"
          ></calendar>
        </div>
      </vs-col>
      <vs-col w="3" style="height: 100%">
        <div class="content-card">
          <vs-table>
            <template #notFound>
              <img style="width: 200px" src="../../assets/img/empty2.jpg" />
              <div>
                <b style="color: gray">今日も頑張りましょう！</b>
              </div>
            </template>
            <template #header>
              <div class="cc-table-header-content">
                <h2>会計済</h2>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th>名前</vs-th>
                <vs-th>診察内容</vs-th>
                <vs-th>時間</vs-th>
              </vs-tr>
            </template>
            <template #tbody>
              <vs-tr v-for="(tr, i) in paymentDone" :key="i" :data="tr">
                <vs-td> {{ tr.name }} </vs-td>
                <vs-td>
                  {{ shinsatuTypes.length > 0 ? shinsatuTypes.find((e) => e.id == tr.type).name : '' }} 
                </vs-td>
                <vs-td>
                  {{ $moment(tr.time, "H:mm:ss").format("H:mm") }}
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vs-col>
    </vs-row>

    <vs-dialog v-model="shinsatuDoctorSelectMode" blur>
      <template #header>
        <h3 class="dialog-title">医者選択</h3>
      </template>
      <vs-table
        v-model="shinsatuStartSelect.doctor"
        @input="startShinsatu"
        style="min-height: 200px"
      >
        <template #thead>
          <vs-tr>
            <vs-th style="width: 1px"></vs-th>
            <vs-th>医師名</vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr v-for="doc in doctors" :key="doc.id" :data="doc">
            <vs-td></vs-td>
            <vs-td> {{ doc.name }} </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vs-dialog>
    <vs-dialog v-model="paymentOpen" blur>
      <template #header>
        <h3 class="dialog-title">会計</h3>
      </template>
      <payment
        @cancel="paymentOpen = false"
        @done="updateData"
        :item="paymentSelect"
        style="width: 400px"
      ></payment>
    </vs-dialog>
    <vs-dialog v-model="resOpen" prevent-close blur>
      <template #header>
        <h3 class="dialog-title">予約登録</h3>
      </template>
      <resNew
        ref="reservation"
        @cancel="resOpen = false"
        @submit="saveRes"
        v-if="resOpen"
      ></resNew>
    </vs-dialog>
    <vs-dialog blur v-model="recOpen" width="500px">
      <template #header>
        <h3 class="dialog-title">受付登録</h3>
      </template>
      <recNew
        @cancel="recOpen = false"
        @submit="newWalkin"
        v-if="recOpen"
      ></recNew>
    </vs-dialog>
    <vs-dialog blur v-model="resAcOpen" width="500px">
      <template #header>
        <h3 class="dialog-title">保険組み合わせ選択</h3>
      </template>
      <insSelect
        :pat="tempSelPat"
        @cancel="resAcOpen = false"
        @submit="resToRec"
        v-if="resAcOpen"
      ></insSelect>
    </vs-dialog>
  </div>
</template>

<script>
import recNew from "../shared/CC_comp_reception_new"
import resNew from "../shared/CC_reservation_edit"
import insSelect from "../shared/CC_comp_insurance_select"
import calendar from "../shared/CC_comp_calendar"
import payment from "../shared/CC_comp_payment"

export default {
  components: {
    recNew: recNew,
    resNew: resNew,
    insSelect: insSelect,
    calendar: calendar,
    payment: payment,
  },
  data() {
    return {
      calendarReady: false,
      allowedStates: {
        1: {
          2: [3],
          3: [],
          35: [3],
          5: [3],
          6: [],
          10: [],
          45: [],
        },
        6: {
          2: [4, 45],
          4: [45],
          45: [],
          35: [4, 45],
          5: [4, 45],
          6: [],
          10: [],
          45: [],
        },
      },
      recOpen: false,
      resOpen: false,
      paymentOpen: false,
      resAcOpen: false,
      loading: false,
      loadingElm: null,
      reception: [],
      tempSelPat: null,
      shinsatuTypes: [],
      doctors: [],
      shinsatuStartSelect: {
        doctor: {},
        shinsatu: {},
      },
      paymentSelect: {},
      shinsatuDoctorSelectMode: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.calendarReady = true
    }, 300);
  },
  computed: {
    receptionWaiting() {
      return this.reception.filter((item) => item.status > 1);
    },
    reservation() {
      let items = this.reception.filter((item) => item.status === 1);
      items.forEach((item) => (item.open = false));
      return items;
    },
    paymentDone() {
      return this.reception.filter((item) => item.status === 0);
    },
  },
  created() {
    this.loading = true
    this.$get('doctors')
    .then(result => {
      this.doctors = result.data
    })
    .catch(result => {
      this.$apiError(result)
    })
    if(!this.$store.getters.shinsatuTypes) {
      this.$get('shinsatutypes')
        .then(result => {
          this.$store.commit('SET_LIST_SHINSATUTYPES', result.data)
          this.shinsatuTypes = this.$store.getters.shinsatuTypes
          this.updateData()
        })
        .catch(result => {
            this.$apiError(result)
        })
    } else {
      this.shinsatuTypes = this.$store.getters.shinsatuTypes
      this.updateData()
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
    editReservation(res) {
      res = res.event.extendedProps.meta
      console.log(res);
      this.resOpen = true
      setTimeout(function(){
        this.$refs.reservation.editRes(res)
      }.bind(this), 200)
    },
    waitTime(change) {
      let time = this.$moment(change, "HH:mm").fromNow(true);
      let diff = this.$moment().diff(this.$moment(change, "HH:mm"), "minutes");
      return {
        time: time,
        diff: diff,
      };
    },
    timeFormat(time) {
      return this.$moment(time, "HH:mm").format("HH:mm");
    },
    statiFunc(item) {
      const norm = [
        { id: 2, name: "診察待ち" },
        { id: 3, name: "診察中" },
        { id: 35, name: "再開待ち" },
        { id: 5, name: "オーダー待ち" },
        { id: 6, name: "オーダー待ち" },
        { id: 10, name: "会計待ち" },
      ];
      const kksd = [
        { id: 2, name: "健康診断待ち" },
        { id: 4, name: "健康診断中" },
        { id: 45, name: "健康診断中・医者" },
        { id: 35, name: "再開待ち" },
        { id: 5, name: "オーダー待ち" },
        { id: 6, name: "オーダー待ち" },
        { id: 10, name: "会計待ち" },
      ];
      if (item.type === 1) {
        return norm;
      } else if (item.type === 6) {
        return kksd;
      }
    },
    clearNotification(row) {
      let index = this.reception.findIndex((item) => item.id === row.id);
      this.reception[index].update = false;
    },
    newWalkin(data) {

      this.$post('encounters', data)
      .then(result => {
        this.updateData()
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    resToRecOpen(tr) {
      this.tempSelPat = tr;
      this.resAcOpen = true;
    },
    resToRec(data) {
      data.status = 2;
      data.doctor = null
      this.$put('encounters/' +data.recID, data)
      .then(result => {
        this.updateData()
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    saveRes(data) {
      this.loading = true
      if(data.edit) {
        this.$put('reservations/' + data.edit, data)
        .then(() => {
          this.updateData();
          this.$vs.notification({
            duration: 2000,
            color: "primary",
            position: "top-center",
            title: "保存しました！",
            text: "通常に保存しました",
            icon: '<i class="fas fa-info"></i>',
          })
        })
        .catch(result => {
          this.$apiError(result)
        })
      } else {
        this.$post('reservations', data)
        .then(() => {
          this.updateData();
        })
        .catch(result => {
          this.$apiError(result)
        })
      }
    },
    updateData() {
      this.loading = true
      this.$get('encounters')
      .then(result => {
        this.reception = result.data
        this.loading = false
        this.paymentOpen = false
        if(this.$refs.calendar) {
          this.$refs.calendar.refetchEvents()
        }
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    selectStatusItem(item) {
      this.shinsatuStartSelect.shinsatu = item;
      if (item.status === 3 && !item.doctor) {
        this.shinsatuDoctorSelectMode = true;
      } else {
        this.loading = true
        let sendData = {
          patient: { id: item.patientID },
          type: { id: item.type },
          insurance: { ID: item.ins },
          memo: item.memo,
          recID: item.id,
          status: item.status,
          doctor: item.doctor,
        }
        this.$put('encounters', sendData)
        .then(result => {
          this.updateData()
        })
        .catch(result => {
          this.$apiError(result)
        })
      }
    },
    startShinsatu() {
      this.shinsatuDoctorSelectMode = false
      this.loading = true
      let item = this.shinsatuStartSelect.shinsatu
      let sendData = {
        patient: { id: item.patientID },
        type: { id: item.type },
        insurance: { ID: item.ins },
        memo: item.memo,
        recID: item.id,
        status: 3,
        doctor: this.shinsatuStartSelect.doctor.id,
      }
      this.$put('encounters', sendData)
      .then(result => {
        this.updateData()
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
  },
  sockets: {
    broadcast(data) {
      if (data.action === "updateReception") {
        this.$get('encounters')
        .then(result => {
          this.reception = result.data;
          if (data.data) {
            let index = this.reception.findIndex(
              (item) => item.id == data.data
            )
            this.reception[index].update = true;
          }
        })
        .catch(result => {
          this.$apiError(result)
        })
      }
      if (data.action === "closeShinsatsu" || data.action === "closeShindan") {
        this.updateData();
      }
    },
  },
};
</script>
<style>
.status-icon {
  margin-right: 5px;
  font-size: 18px;
}
</style>