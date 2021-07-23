<template>
  <div>
    <cui-menu-bar @change="changeMenu" :value="activeTab">
      <template v-slot:left>
        <cui-menu-bar-item icon="fa fa-home menu-icon" value="home"/>
        <cui-menu-bar-item icon="fas fa-user-clock" :label="$lang.reception" value="reception"/>
        <cui-menu-bar-item icon="fas fa-users menu-icon" :label="$lang.patient" value="patient"/>
        <cui-menu-bar-item icon="fas fa-laptop-medical menu-icon" :label="$lang.medical" value="medical" />
      </template>
      <template v-slot:center>CliniClean</template>
      <template v-slot:right>
        <div style="display: flex; align-items: center;margin-right: 20px">
          <cui-avatar :image="avatarUrl" />
          <div style="margin-left: 10px"> {{ $store.getters.userFullName }} </div>
        </div>
        <cui-menu-bar-item icon="fas fa-cog" value="settings"/>
        <cui-menu-bar-item icon="fas fa-sign-out-alt" value="logout"/>
      </template>
    </cui-menu-bar>
    <div class="cc-home-main-cont">
      <transition name="juzoom" >
        <component :is="activeTab" style="height: 100%"></component>
      </transition>
    </div>
  </div>
</template>

<script>

import reception from '../components/cc_reception/cc_reception_main'
import patient from'../components/cc_patient/cc_patient_main'
import medical from '../components/cc_medical/cc_medical_main.vue'

export default {
  name: 'HomeView',
  components: {
    reception, patient, medical
  },
  data() {
    return {
      activeTab: 'home'
    }
  },
  methods: {
    changeMenu(val) {
      if (val === 'logout') {
        this.$auth.remove()
        this.$router.push('/login')
      } else {
        this.activeTab = val
        this.$store.commit('SET_ACTIVE_VIEW', val)
      }
    }
  },
  computed: {
    avatarUrl() {
      return this.$GLOBALS.filesUrl + 'user' + this.$store.getters.user?.id + '.png'
    },
    activeView() { return this.$store.getters.activeView }
  }
}
</script>

<style scoped>
  .cc-home-main-cont {
    height: calc(100% - 45px);
    width: 100%;
    position: absolute;
  }
  .juzoom-enter-active {
    transition: all .3s
  }
  .juzoom-enter, .juzoom-leave-to {
    opacity: 0;
    transform: scale3d(1.03, 1.03, 1.03);
  }
</style>
<style >
  .h2-header {
    background: var(--cui-gray-0);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }
  .cc-medical-karte-headers {
      border-bottom: solid 1px var(--cui-gray-5);
      border-top: solid 1px var(--cui-gray-5);
      padding: 5px;
      background: var(--cui-gray-0);
      height: 25px;
    }

</style>