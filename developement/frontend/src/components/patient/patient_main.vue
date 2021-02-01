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

    <div class="content-card" style="height: calc(100% - 50px)">
      <transition-group name="juzoom" >
          <child-component
            v-for="(tab, index) in tabs"
            :key="index"
            :is="tab.type"
            :ref="tab.type + index"
            :newP="tab.new"
            :data="tab.data"
            :caller="tab.caller"
            @newPatient="newPatient"
            @showDetails="showPatientView"
            @cancel="closeTab(index)"
            @updatePatient="updatePatient"
            @edit="editPatient(...arguments, tab.type + index)"
            class="hidden-tab"
            v-bind:class="{'active-tab': index === activeTab}"
            ></child-component>
      </transition-group>
    </div>
  </div>
</template>

<script>
import patientList from './patient_list'
import patientEdit from './patient_edit'
import patientView from './patient_view'
import { log } from 'util'

export default {
  components: {
    'patientList': patientList,
    'patientEdit': patientEdit,
    'patientView': patientView
  },
  data() {
    return {
      tabs: [
        {label: '患者一覧', name: 'patientList', type: 'patientList', new: false, closable: false}
      ],
      activeTab: 0
    }
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
    newPatient() {
      let name =  String(new Date().getTime())
      this.tabs.push({label: '患者登録',caller: false, name: name, type: 'patientEdit', new: true, data: {}, closable: true})
      this.activeTab = this.tabs.length -1
    },
    editPatient(data, tabInd) {
      let name =  String(new Date().getTime())
      this.tabs.push({label: '編集：' + data.name, caller: tabInd, name: name, type: 'patientEdit', new: false, data: data, closable: true})
      this.activeTab = this.tabs.length -1
    },
    updatePatient(caller) {
      this.$refs[caller][0].updateData()
    },
    showPatientView(pat) {
      let name =  String(new Date().getTime())
      this.tabs.push({label: pat.name, name: name, type: 'patientView', new: false, data: pat, closable: true})
      this.activeTab = this.tabs.length -1
    }
  }
}


</script>
