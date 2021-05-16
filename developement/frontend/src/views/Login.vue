<template>
  <div class="cc-login-main">
    <cui-card style="width: 400px; height: 320px">
      <div class="cc-login-card">
        <span class="logo"></span>
        <div style="width: 300px">
          {{ $api.user.get }}
          <cui-input
            :disabled="loading"
            placeholder="ユーザ名"
            icon="fas fa-user"
            v-model="user.user"
          />
          <cui-input
            :disabled="loading"
            placeholder="パスワード"
            icon="fas fa-lock"
            type="password"
            v-model="user.pass"
          />
          <cui-button
            @click="login"
            :loading="loading"
            label="ログイン"
            style="fload: left; width: 100%" primary
          />

        </div>
      </div>
    </cui-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        user: '',
        pass: '',
        mobile: false
      },
      loading: false
    }
  },
  methods: {
    login() {
      this.loading = true
      return
      // this.$api.auth.post(this.user)
      // .then((r) => {
      //   if (r.data.ok) {
      //     this.$api.user.get(r.data.user.id).then(user => {
      //       this.$store.commit('SET_USER', user.data)
      //       this.$route.push('/')
      //     })
      //   } else {
      //     this.$cui.notification({ text: 'ユーザー名又はパスワードが違います。ご確認してください。', color: 'danger' })
      //   }
      // })
      // .catch(r => {
      //   this.$cui.notification({ text: r, color: 'danger' })
      // })

      
      
    }
  }
}
</script>

<style scoped>
  .cc-login-main {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cc-login-card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo {
    background: url('../assets/img/CliniCleanLogo.png');
    background-size: contain;
    background-repeat: no-repeat;
    height: 120px;
    width: 350px;
    display: block;
    margin-bottom: 20px;
  }

</style>