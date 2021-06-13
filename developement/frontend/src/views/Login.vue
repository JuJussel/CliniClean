<template>
  <div class="cc-login-main">
    <cui-card style="width: 400px; height: 320px">
      <div class="cc-login-card">
        <span class="logo"></span>
        <div style="width: 300px">
          <cui-input
            :disabled="loading"
            placeholder="ユーザ名"
            icon="fas fa-user"
            v-model="user.username"
          />
          <cui-input
            :disabled="loading"
            placeholder="パスワード"
            icon="fas fa-lock"
            type="password"
            v-model="user.password"
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
  name: 'LoginView',
  data() {
    return {
      user: {
        username: 'ekurosu2',
        password: 'Passw0rd!'
      },
      loading: false,
      test: null
    }
  },
  methods: {
    async login() {
      this.loading = true;
      const res = await this.$dataService().post.auth(this.user);
      this.loading = false;
      this.$store.commit('SET_USER', res);
      this.$router.push('/');


      // this.$api.auth.login(this.user)
      // .then(res => {
      //     this.$store.commit('SET_USER', res)
      //     this.$router.push('/')
      // })
      // .catch(res => {
      //   this.loading = false
      //   if (res.status === 401) {
      //     this.$apiError('ユーザー名又はパスワードが違います。ご確認してください。')
      //   } else {
      //     this.$apiError(res.statusText)
      //   }
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