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
      this.$auth.check()
      .then(() => {
          this.$router.push('/home')
      })
      .catch(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
