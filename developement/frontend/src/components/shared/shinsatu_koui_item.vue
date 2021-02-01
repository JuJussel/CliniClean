<template>
  <div style="padding: 20px; background: white; border-radius: 14px">
    <div style="display: flex; justify-content: space-between">
      <!-- Kensa -->
      <span style="display: flex; align-items: center" v-if="koui.type === '60'">
        <vs-select
          filter
          multiple
          active
          label="検索結果追加"
          collapse-chips
          placeholder="検索"
          v-model="koui.var.results"
          :key="resultsListFull.length"
          style="width: 250px !important; margin: 0"
        >
          <vs-option
            v-for="result in resultsListFull"
            :key="result.kensa_code"
            :label="result.name"
            :value="result"
          >
            {{ result.name }}
          </vs-option>
        </vs-select>
      </span>
      <!-- Treat OP -->
      <span style="display: flex; align-items: center" v-if="koui.type === '40' || koui.type === '50'">
        コメント追加又は削除
      </span>
      <!-- Shot Prev -->
      <span style="display: flex; align-items: center" v-if="koui.type === '30' || koui.type === '31'">
        <vs-select
          placeholder="位置選択"
          @input="shotTypeChange"
          v-model="koui.var.location"
          label="位置選択"
          :key="shotLocations.length"
          style="width: 250px !important; margin: 0"
        >
          <vs-option
            v-for="item in shotLocations"
            :key="item"
            :label="item"
            :value="item"
          >
            {{ item }}
          </vs-option>
        </vs-select>
      </span>
      <!-- Med -->
      <span style="display: flex; align-items: center" v-if="koui.type === '25'">
        <span style="display: flex">
          <vs-radio v-model="koui.var.type" val="1" @input="getShohouTiming">
            内服
          </vs-radio>
          <vs-radio v-model="koui.var.type" val="3" @input="getShohouTiming">
            屯服
          </vs-radio>
          <vs-radio v-model="koui.var.type" val="5" @input="getShohouTiming">
            外用
          </vs-radio>
        </span>
      </span>
      <!-- Shindan -->
      <span style="display: flex; align-items: center" v-if="koui.type === '90'">
        <span>
          <vs-button dark @click="showKenkoushindan">健康診断表示</vs-button>
        </span>
      </span>
    </div>
    <!-- lower part -->
    <!-- Kensa -->
    <div v-if="koui.type === '60'" style="margin-top: 10px">
      <vs-row v-for="(tr, index) in koui.var.results" :key="index" class="results-container">
        <vs-col w="6" style="padding: 5px"> {{ tr.name }} </vs-col>
        <vs-col w="5" style="padding-right: 5px">
          <vs-input icon-after state="dark" v-model="tr.value" placeholder="値">
            <template #icon v-if="tr.unit !=='' && tr.unit !== '　'">
              {{ tr.unit }}
            </template>
          </vs-input>
        </vs-col>
        <vs-col w="1">
          <vs-button
            @click="removeResult(tr)"
            icon
            border
            danger
            size="small"
            animation-type="scale"
          >
            <i class="far fa-trash-alt" style="font-size: 14px"></i>
            <template #animate>削</template>
          </vs-button>
        </vs-col> 
      </vs-row>
    </div>
    <!-- Shot Prev -->
    <div v-if="koui.type === '30' || koui.type === '31'">
      <vs-row style="margin-top: 10px">
        <vs-col w="6">
          <vs-input v-model="koui.var.amount" icon-after label="接種量" type="number">
            <template #icon>ml</template>
          </vs-input>
        </vs-col>
        <vs-col w="6">
          <vs-input v-model="koui.var.lotNo" label="LotNo">
          </vs-input>
        </vs-col>
      </vs-row>
    </div>
    <!-- Med -->
    <div v-if="koui.type === '25'">
        <vs-select
          label="検索結果追加"
          placeholder="検索"
          @input="chooseTiming"
          v-model="koui.var.timing"
          :key="medTimings.length"
          style="width: 200px!important; margin-left: 10px"
        >
          <vs-option
            v-for="item in medTimings"
            :key="item.id"
            :label="item.name"
            :value="item"
          >
            {{ item.name }}
          </vs-option>
        </vs-select>
      <vs-row style="margin-top: 10px">
        <vs-col w="6">
          <vs-input v-model="koui.var.amount" icon-after label="薬剤量" type="number" style="margin: 0">
            <template #icon> {{ koui.var.unit }} </template>
          </vs-input>
        </vs-col>
        <vs-col w="6">
          <vs-input v-model="koui.var.times" icon-after label="回・日数" type="number" style="margin: 0">
            <template #icon> {{koui.var.timing.unit}} </template>
          </vs-input>
        </vs-col>

      </vs-row>
    </div>
    <!-- Common -->
    <div>
      <vs-input v-if="koui.type !== '90'" maxlength=145 v-model="koui.comment.content" placeholder="コメント"></vs-input>
    </div>
  </div>
</template>

<script>
import { log } from 'util';
export default {
  props: {
    kouiInit: {default: null},
    insurances: {default: function() {
      return []
    }},
    mainIns: {default: null},
    noDelete: {type: Boolean, default: false}
  },
  created() {
    if (this.koui.type === "60") {

      this.$get('examinationresults/' + this.koui.kouiCode)
      .then((result) => {
        this.resultsListFull = result.data;
      })
      .catch(result => {
        this.$apiError(result)
      })

    }
    if (this.koui.type === "25") {
      this.getShohouTiming();
    }
    this.originalIns = this.mainIns;
  },
  data() {
    return {
      resultsListFull: [],
      resultsFilter: "",
      shotLocations: [
        "右上腕",
        "左上腕",
        "右大腿",
        "左大腿",
        "右臀部",
        "左臀部",
        "静脈",
      ],
      medTimings: [],
      koui: this.kouiInit,
      originalIns: "",
    };
  },
  watch: {
    koui: {
      deep: true,
      handler() {
        this.$emit("update", this.koui);
      },
    },
  },
  methods: {
    showKenkoushindan() {
      this.$emit("showShindan");
    },
    addResult(result) {
      this.koui.var.results.push(result);
    },
    removeResult(result) {
      this.koui.var.results = this.koui.var.results.filter(
        (r) => r.result_code !== result.result_code
      );
    },
    removeKoui() {
      this.$emit("remove");
    },
    shotTypeChange(sel) {
      if (sel === "静脈") {
        this.koui.kouiCode = "130003510";
      } else {
        this.koui.kouiCode = "130000510";
      }
      this.$emit("shotTypeChange");
    },
    getShohouTiming() {

      this.$get('medicationtimings/' + this.koui.var.type)
      .then((result) => {
        this.medTimings = result.data;
      })
      .catch(result => {
        this.$apiError(result)
      })

    },
    chooseTiming(item) {
      this.koui.var.timing = item;
      this.timingOpen = false;
    },
    toggleComment() {
      if (this.koui.comment.present) {
        this.koui.comment.present = false;
        this.koui.comment.content = "";
      } else {
        this.koui.comment.present = true;
      }
    }
  },
};
</script>

<style scoped>
.results-container {
  align-items: center;
  padding: 10px
}
</style>
