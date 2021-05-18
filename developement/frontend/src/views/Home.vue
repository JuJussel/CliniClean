<template>
  <div>
    <cui-menu-bar @change="changeMenu" :value="activeView">
      <template v-slot:left>
        <cui-menu-bar-item icon="fa fa-home menu-icon" value="home"/>
        <cui-menu-bar-item icon="fas fa-user-clock" label="受付" value="reception"/>
        <cui-menu-bar-item icon="fa fa-home menu-icon" label="患者" value="patient"/>
        <cui-menu-bar-item icon="fa fa-home menu-icon" label="医療" value="medical" />
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
        <component :is="activeView" ref="childComp"></component>
      </transition>
    </div>
  </div>
</template>

<script>

import reception from '../components/cc_reception/cc_reception_main'

export default {
  name: 'Home',
  components: {
    'reception': reception
  },
  data() {
    return {
      
    }
  },
  methods: {
    changeMenu(val) {
      if (val === 'logout') {
        this.$auth.remove()
        this.$router.push('/login')
      }
      this.$store.commit('SET_ACTIVE_VIEW', val)
    }
  },
  computed: {
    avatarUrl() {
      return this.$GLOBALS.filesUrl + 'user' + this.$store.getters.user.id + '.png'
    },
    activeView() { return this.$store.getters.activeView}
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