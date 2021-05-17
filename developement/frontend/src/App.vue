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
        console.log('OK');
          this.$router.push('/')
        })
      .catch(() => {
        console.log('NOGO');
        this.$router.push('/login')
      })

      // let auth = this.$store.getters.isAuthenticated
      // console.log(auth);
      // let a = false
      // // a = Auth.isAuthenticated()
      // if (a) {
      //   this.$router.push('/')
      // } else {
      //   this.$router.push('/login')
      // }
    }
  }
}
</script>
