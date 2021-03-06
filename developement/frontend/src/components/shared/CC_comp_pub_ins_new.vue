<template>
  <div ref="loadingCont">
		<vs-input :state="validateKouhi1" label="公費負担者番号" v-model="khData.khFuSha" placeholder="入力" />
		<vs-input :state="validateKouhi2" label="公費受給者番号" v-model="khData.khRecp" placeholder="入力" />
    <div style="padding: 0 0 20px 20px">
      <div style="margin-left: 10px; font-size: 12px">資格期限</div>
      <date-picker
          range
          v-model="khData.valid"
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
    <div class="cc-dialog-footer">
      <vs-button @click="$emit('close')" transparent dark>キャンセル</vs-button>
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
  data() {
    return {
      khData: {
        khFuSha: "",
        khRecp: "",
        valid: [null, null],
        files: null,
      }
    };
  },
  computed: {
    inputOK() {
      if (
        this.khData.khFuSha !== "" &&
        this.khData.khRecp !== "" &&
				this.khData.valid[0] &&
				this.khData.valid[1] &&
				this.khData.files &&
				this.validateKouhi1 === "" &&
				this.validateKouhi2 === ""
      ) {
        return true;
      }
      return false;
		},
		validateKouhi1() {
			let data = this.khData.khFuSha;
      let check_number = 0;
      if (data.length != 8) {
        return 'danger'
      }
      var ns = data.toString(10);
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
        check_number = 10 - check_str[check_pos];
        if (check_str[check_pos] == 0) {
          check_number = 0;
        }
      }
      if (check_number != x8) {
        return 'danger'
      } else {
        return ''
      }
    },
    validateKouhi2() {
			let data = this.khData.khRecp;
      let check_number = 0;
      if (data.length != 7) {
        return 'danger'
      }
      var ns = data.toString(10);
      ns = ns.split("");
      var x1 = ns[0];
      var x2 = ns[1] * 2;
      if (x2 > 9) {
        x2 = x2 - 9;
      }
      var x3 = ns[2];
      var x4 = ns[3] * 2;
      if (x4 > 9) {
        x4 = x4 - 9;
      }
      var x5 = ns[4];
      var x6 = ns[5] * 2;
      if (x6 > 9) {
        x6 = x6 - 9;
      }
      var x7 = ns[6];
      if (x7 !== "") {
        var check = x1 * 1 + x2 * 1 + x3 * 1 + x4 * 1 + x5 * 1 + x6 * 1;
        var check_str = check.toString();
        var check_pos = check_str.length - 1;
        check_number = 10 - check_str[check_pos];
        if (check_str[check_pos] == 0) {
          check_number = 0;
        }
      }
      if (check_number != x7) {
        return 'danger'
      } else {
        return ''
      }
    }
  },
  methods: {
		updateFiles(files) {
      this.khData.files = files;
    },
    submit() {
      if (this.inputOK) {
				const isLoading = this.$vs.loading({
					target: this.$refs.loadingCont,
					color: 'dark'
				})
				this.$emit('add', this.khData)
				isLoading.close()
				this.$emit('close')
      }
    }
	}
};
</script>

<style>
</style>