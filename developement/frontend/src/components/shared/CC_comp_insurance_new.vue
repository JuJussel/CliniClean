<template>
  <div ref="loadingCont">
    
    <vs-input label="記号" v-model="insurance.kigou" placeholder="入力" />
    <vs-input label="番号" v-model="insurance.bangou" placeholder="入力" />
    <div style="display: flex">
      <vs-input
        label="被保険者"
        :disabled="insurance.hihokensha.relation === '本人'"
        v-model="insurance.hihokensha.name"
        placeholder="入力"
        style="width: 180px"
      />
      <vs-radio
        v-model="insurance.hihokensha.relation"
        @input="
          checkDoubleInsurance();
          setName();
        "
        val="配偶者"
        >配偶者</vs-radio
      >
      <vs-radio
        v-model="insurance.hihokensha.relation"
        @input="
          checkDoubleInsurance();
          setName();
        "
        val="本人"
        style="margin-left: 20px"
        >本人</vs-radio
      >
    </div>
    <div style="display: flex">
      <vs-input
        :state="hokenOK"
        @input="
          checkDoubleInsurance();
          getHokensha();
        "
        label="保険者番号"
        v-model="insurance.hokenshaNumber"
        placeholder="入力"
        style="width: 180px"
      />
      <vs-input
        readonly
        label="保険者名"
        v-model="display.hokensha"
        style="width: 180px"
      />
    </div>
    <div style="padding: 0 0 20px 20px">
      <div style="margin-left: 10px; font-size: 12px">資格取得</div>
      <date-picker
          v-model="insurance.getDate"
          :append-to-body="false"
          placeholder="選択"
          format="YYYY年MM月DD日"
          value-type="YYYY-MM-DD"
          input-class="vs-input cc-mx-input"
          popup-class="cc-date-picker"
          >
      </date-picker>
    </div>
    <div style="padding: 0 0 20px 20px">
      <div style="margin-left: 10px; font-size: 12px">資格期限</div>
      <date-picker
          range
          v-model="insurance.validDate"
          :append-to-body="false"
          placeholder="選択"
          format="YYYY年MM月DD日"
          value-type="YYYY-MM-DD"
          input-class="vs-input cc-mx-input"
          popup-class="cc-date-picker"
          >
      </date-picker>
    </div>
    <fileSelect title="保険証写真" @change="updateFiles"></fileSelect>
    <vs-alert danger v-if="display.doubleIns">
      <template #title>
        保険の重複
      </template>
      <div>
        <div class="el-alert__description">記号・番号・保険者の組み合わせは既に登録されてます。</div>
        <div class="el-alert__description">患者名： {{ display.doubleInsName }} </div>
      </div>
      <div style="padding; display: flex; justify-content: flex-end">
        <vs-button dark @click="$emit('doubleDetails', display.doubleInsId)">患者詳細</vs-button>
        <vs-button dark @click="$emit('doubleAdd', display.doubleInsId)">配偶者として登録</vs-button>      </div>
    </vs-alert>
    <div class="cc-dialog-footer" v-else>
      <vs-button dark @click="$emit('close')" transparent>キャンセル</vs-button>
      <vs-button @click="submit()" :disabled="!inputOK">追加</vs-button>
    </div>
  </div>
</template>

<script>
import fileSelect from "../shared/CC_comp_file_select";

export default {
  components: {
    fileSelect: fileSelect,
  },
  props: {
    patientName: { default: "" },
  },
  created() {
    this.insurance.hihokensha.name = this.patientName;
  },
  data() {
    return {
      insurance: {
        hihokensha: {
          name: "",
          relation: "本人",
        },
        kigou: "",
        getDate: "",
        bangou: "",
        validDate: ["", ""],
        hokenshaNumber: "",
        files: null,
      },
      fileName: "",
      display: {
        hokensha: "",
        doubleIns: false,
        doubleInsName: "",
        doubleInsId: "",
        loading: false,
      },
    };
  },
  computed: {
    inputOK() {
      if (
        this.insurance.kigou !== "" &&
        this.insurance.bangou !== "" &&
        this.insurance.hokenshaNumber !== "" &&
        this.insurance.hihokensha.name !== "" &&
        this.insurance.files &&
        this.hokenOK === ""
      ) {
        return true;
      }
      return false;
    },
    hokenOK() {
      let data = this.insurance.hokenshaNumber;
      if (data === "") {
        return "";
      }
      if (data.length != 8 && data.length != 6) {
        return "danger";
      }
      var ns = data.toString(10);
      if (ns.length == 6) {
        ns = "00" + ns;
      }
      ns = ns.split("");
      var x1 = ns[0] * 2;
      if (x1 > 9) {
        x1 = x1 - 9;
      }
      var x2 = ns[1];
      var x3 = ns[2] * 2;
      if (x3 > 9) {
        x3 = x3 - 9;
      }
      var x4 = ns[3];
      var x5 = ns[4] * 2;
      if (x5 > 9) {
        x5 = x5 - 9;
      }
      var x6 = ns[5];
      var x7 = ns[6] * 2;
      if (x7 > 9) {
        x7 = x7 - 9;
      }
      var x8 = ns[7];
      if (x8 !== "") {
        var check =
          x1 * 1 + x2 * 1 + x3 * 1 + x4 * 1 + x5 * 1 + x6 * 1 + x7 * 1;
        var check_str = check.toString();
        var check_pos = check_str.length - 1;
        var check_number = 10 - check_str[check_pos];

        if (check_str[check_pos] == 0) {
          check_number = 0;
        }
      }
      if (check_number != x8) {
        return "danger";
      } else {
        return "";
      }
    },
  },
  methods: {
    updateFiles(files) {
      this.insurance.files = files;
    },
    setName() {
      if (this.insurance.hihokensha.relation === "本人") {
        this.insurance.hihokensha.name = this.patientName;
      }
    },
    checkDoubleInsurance() {
      if (
        this.insurance.kigou !== "" &&
        this.insurance.bangou !== "" &&
        this.insurance.hokenshaNumber !== ""
      ) {
          let sendData = {
            kigou : this.insurance.kigou,
            bangou : this.insurance.bangou,
            hokenshaNumber: this.insurance.hokenshaNumber
          }

          this.$get('insurances/1', sendData)
          .then((result) => {
            console.log(result);
            if (result.data.length > 0) {
              this.display.doubleInsName = result.data[0].hihknjaname
              this.display.doubleInsId = result.data[0].ptid
              this.display.doubleIns = true
            }
          })
          .catch(result => {
            this.$apiError(result)
          })
      }
      this.insurance.name = "";
    },
    getHokensha() {
      if (this.hokenOK === '' && this.insurance.hokenshaNumber !== '') {

        this.$get('insuranceproviders/1' + this.insurance.hokenshaNumber)
        .then(
          (result) => {
            this.display.hokensha = result.data
          }
        )
        .catch(result => {
          this.$apiError(result)
        })

      } else {
        this.display.hokensha = ''
      }
    },
    submit() {
      if (this.inputOK) {
				const isLoading = this.$vs.loading({
					target: this.$refs.loadingCont,
					color: 'dark'
				})
				this.insurance.hokenshaName = this.display.hokensha
				this.$emit('add', this.insurance)
				isLoading.close()
				this.$emit('close')
      }
    }
  }
};
</script>

<style>
</style>