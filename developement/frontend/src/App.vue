<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Auth from './services/auth.service'

export default {
  name: 'App',
  created() {
    this.isAuthenticated()
  },
  methods: {
    isAuthenticated() {
      let a = false
      Auth.isAuthenticated()
      .then(() => {console.log('AUTHISOK');})
      .catch(() => {console.log('NOTOKAUTH');})
      if (a) {
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
