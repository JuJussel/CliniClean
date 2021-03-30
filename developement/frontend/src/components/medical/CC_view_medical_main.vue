<template>
  <div style="height: 100%">
    <div style="height: 30px; display: flex; justify: flex-start; padding-left: 10px">
      <vs-button-group>
        <vs-button
          border
          dark
          :active="activeTab == index"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          >
          <span> {{ tab.label }} </span>
          <span class="cc-hover-icon" style="margin-left: 5px" v-if="tab.closable"><i class="fas fa-times" @click="closeTab(index)"></i></span>
        </vs-button>
      </vs-button-group>
    </div>
    <div style="height: calc(100% - 30px)">
      <transition-group name="juzoom" >
          <child-component
            v-for="(tab, index) in tabs"
            :key="index"
            :is="tab.type"
            :ref="tab.type + index"
            :meta="tab.meta"
            :data="tab.meta"
            class="hidden-tab"
            v-bind:class="{'active-tab': index === activeTab}"
            @showKarte="showKarte"
            @showShindan="showShindan"
            @close="closeTab(index)"
            @showPatient="showPatient"
            ></child-component>
      </transition-group>
    </div>
</div>
</template>

<script>

import karteEdit from './CC_view_karte_edit'
import shindan from './CC_view_shindan_edit'
import list from './CC_view_medical_list'
import karteView from './CC_view_karte_viewer'
import patientView from '../patient/CC_view_patient_view'

export default {
  components: {
    'list': list,
    'karteEdit': karteEdit,
    'shindan': shindan,
    'karteView': karteView,
    'patientView': patientView
  },
  data() {
    return {
      tabs: [
        {label: '医療ホーム', name: 'medicalMain', type: 'list'}
      ],
      activeTab: 0,
    }
  },
  created() {
    this.$eventHub.$on('showKarteView', this.showKarteView)
  },
  beforeDestroy: function() {
    this.$eventHub.$off('showKarteView')
  },
  methods: {
    closeTab(index) {
      let newIndex = index
      if (this.tabs.length - 1 === index) {
        newIndex = this.tabs.length - 2
      }
      this.tabs.splice(index, 1)
      this.activeTab =  newIndex
    },
    showPatient(patient) {
      let tabName = 'patientview_' + patient.id
      let tabIndex = this.tabs.findIndex(tab => tab.name === tabName)
      if(tabIndex < 0) {
        let tabData = {
          label: '患者情報：' + patient.name,
          name: tabName,
          type: 'patientView',
          meta: patient
        }
        this.tabs.push(tabData)
        tabIndex = this.tabs.length -1
      }
      this.activeTab = tabIndex
    },
    showKarte(item) {
      let tabName = 'shinsatu_' + item.patientID
      let tabIndex = this.tabs.findIndex(tab => tab.name === tabName)
      if(tabIndex < 0) {
        let tabData = {
          label: 'カルテ(診察中)：' + item.name,
          name: tabName,
          type: 'karteEdit',
          meta: item
        }
        this.tabs.push(tabData)
        tabIndex = this.tabs.length -1
      }
      this.activeTab = tabIndex
    },
    showKarteView(item) {
      let tabName = 'karteView' + item.id
      let tabIndex = this.tabs.findIndex(tab => tab.name === tabName)
      if(tabIndex < 0) {
        let tabData = {
          label: 'カルテ表示：' + item.patientName + '・' + this.$moment(item.date).format("YYYY年M月D日"),
          name: 'karteView' + item.id,
          type: 'karteView',
          meta: item,
          closable: true
        }
        this.tabs.push(tabData)
        tabIndex = this.tabs.length -1
      }
      this.activeTab = tabIndex
    },
    showShindan(item, noClose=false) {
      let tabName = 'shindan_' + item.patientID
      item.noClose = noClose
      let tabIndex = this.tabs.findIndex(tab => tab.name === tabName)
      if(tabIndex < 0) {
        let tabData = {
          label: '健康診断：' + item.name,
          name: 'shindan_' + item.patientID,
          type: 'shindan',
          meta: item,
          closable: true
        }
        this.tabs.push(tabData)
        tabIndex = this.tabs.length -1
      }
      this.activeTab = tabIndex
    },
  }
}


</script>
<style>
</style>