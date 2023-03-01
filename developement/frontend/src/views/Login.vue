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
            style="float: right" primary
          />

        </div>
      </div>
    </cui-card>
  </div>
</template>

<script>

import { useUserStore } from '@/stores/user'
import { mapStores } from 'pinia'

export default {
  name: 'LoginView',
  data() {
    return {
      user: {
        username: 'ekurosu2',
        password: 'Passw0rd'
      },
      loading: false,
      test: null
    }
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const res = await this.$api.post('auth/login', this.user);
        this.userStore.userData = res
        this.$router.push('/home');
      } catch {
        this.loading = false;
      }

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