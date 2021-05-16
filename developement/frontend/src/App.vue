<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    this.isAuthenticated()
  },
  methods: {
    isAuthenticated() {
      const user = this.$store.getters.user
      if (user) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
