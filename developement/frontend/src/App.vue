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
          this.$router.push('/')
        })
      .catch(() => {
        this.$auth.remove()
        this.$router.push('/login')
      })
    }
  }
}
</script>
