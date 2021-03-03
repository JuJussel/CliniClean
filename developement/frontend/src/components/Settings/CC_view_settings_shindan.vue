<template>
  <div style="height: calc(100% - 20px)">
    <vs-row style="height: 100%">
      <vs-col w="5" style="height: 100%" ref="loadElm">
        <div class="content-card" style="height: 100%">
          <vs-table striped style="height: calc(100% - 20px)">
            <template #header>
              <div
                class="cc-table-header-content"
                style="justify-content: space-between; height: 50px"
              >
                <span style="display: flex; align-items: center">
                  <h2>健康診断検査一覧</h2>
                  <vs-button
                    v-if="!edit"
                    dark
                    animation-type="scale"
                    @click="startEdit"
                  >
                    <i class="fas fa-edit" style="font-size: 20px"></i>
                    <template #animate>編集</template>
                  </vs-button>
                </span>
                <span v-if="edit" style="display: flex">
                  <vs-button dark @click="kensaAddOpen = true">
                    追加
                  </vs-button>
                  <vs-button transparent dark @click="cancelEdit">
                    キャンセル
                  </vs-button>
                  <vs-button @click="saveEdit">保存 </vs-button>
                </span>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th>検査名</vs-th>
                <vs-th></vs-th>
              </vs-tr>
            </template>
            <template #tbody>
              <vs-tr
                v-for="(tr, index) in exams"
                :key="index"
                style="height: 50px"
              >
                <vs-td> {{ tr.name }} </vs-td>
                <vs-td style="width: 60px">
                  <vs-button
                    v-if="edit"
                    @click="removeKensa(tr)"
                    icon
                    danger
                    border
                    size="small"
                    animation-type="scale"
                    class="cc-hover-button"
                    style="margin: 0"
                  >
                    <i class="far fa-trash-alt" style="font-size: 14px"></i>
                    <template #animate>削除</template>
                  </vs-button>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>
      </vs-col>
    </vs-row>
    <vs-dialog width="1000px" not-center v-model="kensaAddOpen">
      <template #header>
        <h4 class="not-margin">検査選択</h4>
      </template>
      <vs-row ref="kensaAddModal">
        <vs-col w="6">
          <kouiList
            @addKoui="selectExam"
            :visibleCats="[60]"
            setActive="60"
            noHeader
            style="height: 500px"
          />
        </vs-col>
        <vs-col w="6">
          <vs-table>
            <template #header>
              <div class="cc-table-header-content">
                <h2>検査結果一覧</h2>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th>
                  <vs-checkbox
                    :indeterminate="selected.length == users.length"
                    v-model="allCheck"
                    @change="selected = $vs.checkAll(selected, users)"
                  />
                </vs-th>
                <vs-th>結果名</vs-th>
              </vs-tr>
            </template>
            <template #tbody>
              <vs-tr
                v-for="(tr, index) in examResults"
                :key="index"
                style="height: 50px"
              >
                <vs-td>
                  <vs-checkbox></vs-checkbox>
                </vs-td>
                <vs-td> {{ tr.name }} </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-col>
      </vs-row>
    </vs-dialog>
  </div>
</template>

<script>
import kouiList from "../shared/koui_list";

export default {
  components: {
    kouiList: kouiList,
  },

  created() {
    this.updateData();
  },
  data() {
    return {
      exams: [],
      kensaAddOpen: false,
      edit: false,
      loading: false,
      loadingCont: null,
      examResults: [],
      examResultsScelected: [],
    };
  },
  methods: {
    updateData() {
      this.loading = true;
      this.$get("settings/2")
        .then((result) => {
          this.exams = result.data;
          this.loading = false;
        })
        .catch((result) => {
          this.$apiError(result);
          this.loading = false;
        });
    },
    startEdit() {
      this.copy = JSON.parse(JSON.stringify(this.exams));
      this.edit = true;
    },
    cancelEdit() {
      this.exams = this.copy;
      this.edit = false;
    },
    selectExam(exam) {
      console.log(exam);
      let loading = this.$vs.loading({
        target: this.$refs.kensaAddModal,
        color: "dark",
      });
      this.$get("examinationresults/" + exam.koui.kouiid)
        .then((result) => {
          this.examResults = result.data;
          loading.close();
        })
        .catch((result) => {
          this.$apiError(result);
          loading.close();
        });
    },
    removeKensa(kensa) {
      this.exams = this.exams.filter(
        (exam) => exam.kensa_code !== kensa.kensa_code
      );
    },
    saveEdit() {
      this.loading = true;

      let sendData = JSON.stringify(this.exams);
      this.$put("settings/2", sendData)
        .then((result) => {
          this.loading = false;
          this.$vs.notification({
            duration: 2000,
            color: "primary",
            position: "top-center",
            title: "保存しました！",
            text: "データを通常に保存しました",
            icon: '<i class="fas fa-info"></i>',
          });
        })
        .catch((result) => {
          this.$apiError(result);
          this.loading = false;
        });
    },
  },
  watch: {
    loading() {
      if (this.loading) {
        this.loadingCont = this.$vs.loading({
          target: this.$refs.loadElm,
          color: "dark",
        });
      } else {
        this.loadingCont.close();
        this.loadingCont = null;
      }
    },
  },
};
</script>
