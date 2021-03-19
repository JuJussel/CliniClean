<template>
    <div class="back">
        <div class="content-card login-box" ref="content" style="position: relative">
            <span class="logo"></span>
            <div style="width: 300px">
                <vs-input 
                    @keyup.enter.native="login"
                    v-model="userData.user"
                    placeholder="ユーザー名"
                    style="min-width: 300px!important"
                >
                    <template #icon>
                        <i style="opacity: 0.7" class="fas fa-user"></i>
                    </template>
                </vs-input>
                <vs-input type="password" style="margin: 10px 0" @keyup.enter.native="login" v-model="userData.pass" placeholder="パスワード">
                    <template #icon>
                        <i style="opacity: 0.7" class="fas fa-lock"></i>
                    </template>
                </vs-input>
                <vs-button block style="float: right" @click="login()">ログイン</vs-button>
            </div>
        </div>
        <div class="footer">
           CliniClean Clinic Management System Version 0.4.1 Copyright Jussel Peter 2017-2020.
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            userData: {
                user: 'ekurosu',
                pass: 'Passw0rd!',
                mobile: false
            },
            noti: null
        }
    },
    methods: {
        login() {
            if(this.noti) {
                this.noti.close()
            }
            const loading = this.$vs.loading({
                target: this.$refs.content,
                color: 'dark'
            })

            this.$post('Sessions', this.userData)
            .then(result => {
                if(result.data.ok) {
                    this.$store.commit('SET_SESSION_ID', result.data.sessionID)
                    //document.cookie = 'PHPSESSID=' + result.data.sessionID + '; secure'
                    this.$router.push(result.data.location)
                } else {
                    loading.close()
                    this.noti = this.$vs.notification({
                        position: 'top-center',
                        color: 'danger',
                        duration: 3000,
                        icon: '<i class="fas fa-exclamation-circle"></i>',
                        buttonClose: false,
                        title: 'エラー',
                        text: 'ユーザー名又はパスワードが違います。ご確認してください。'
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
    .back {
        background: url('../assets/img/login_back_light.jpg');
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center
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
    .login-box {
        width: 400px; 
        height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center
    }
    .footer {
        background-color: white;
        position: absolute;
        width: 100%;
        height: 20px;
        text-align: center;
        bottom: 0px;
        color: #9d9d9d;
        font-size: 8px;
        line-height: 20px;
    }
</style>
