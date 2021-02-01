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
    <div style="height: calc(100% - 50px)">
      <transition-group name="juzoom" >
          <child-component
            v-for="(tab, index) in tabs"
            :key="index"
            :is="tab.type"
            :ref="tab.type + index"
            :meta="tab.meta"
            class="hidden-tab"
            v-bind:class="{'active-tab': index === activeTab}"
            @showKarte="showKarte"
            @showShindan="showShindan"
            @close="closeTab(index)"
            ></child-component>
      </transition-group>
    </div>
</div>
</template>

<script>

import karteEdit from './karte_edit'
import shindan from './shindan_edit'
import list from './medical_list'
import karteView from './karte_viewer'

export default {
  components: {
    'list': list,
    'karteEdit': karteEdit,
    'shindan': shindan,
    'karteView': karteView
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
    showKarte(item) {
      let tabName = 'shinsatu_' + item.patientID
      let tabIndex = this.tabs.findIndex(tab => tab.name === tabName)
      if(tabIndex < 0) {
        let tabData = {
          label: 'カルテ(診察中)：' + item.name,
          name: 'shinsatu_' + item.patientID,
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