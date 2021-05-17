<template>
  <div>
    <cui-menu-bar @change="changeMenu" :value="activeMenu">
      <template v-slot:left>
        <cui-menu-bar-item icon="fa fa-home menu-icon"  value="home"/>
        <cui-menu-bar-item icon="fas fa-user-clock" label="受付" value="reception"/>
        <cui-menu-bar-item icon="fa fa-home menu-icon" label="患者" value="patient"/>
        <cui-menu-bar-item icon="fa fa-home menu-icon" label="医療" value="medical" />
      </template>
      <template v-slot:center>CliniClean</template>
      <template v-slot:right>
        <div style="display: flex; align-items: center">
          <cui-avatar />
          <div> {{ $store.getters.user.lastName }} </div>
        </div>
        <cui-menu-bar-item icon="fas fa-sign-out-alt" value="logout"/>
      </template>
    </cui-menu-bar>
    <div class="cc-home-main-cont"></div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      activeMenu: 'reception'
    }
  },
  methods: {
    changeMenu(val) {
      if (val === 'logout') {
        this.$auth.remove()
        this.$router.push('/login')
      }
      this.activeMenu = val
    }
  }
}
</script>

<style scoped>
  .cc-home-main-cont {
    height: calc(100% - 45px);
    width: 100%;
    position: absolute;
  }
</style>