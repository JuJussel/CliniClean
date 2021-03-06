<template>
    <div style="height: 100%">
      <vs-navbar :color="$globals.theme.colors.darkGray" text-white center-collapsed v-model="currentView">
        <template #left>
          <vs-navbar-item :active="currentView == 'dashboard'" id="dashboard">
            <i class="fa fa-home menu-icon"/>
          </vs-navbar-item>
          <vs-navbar-item :active="currentView == 'reception'" id="reception">
            <i class="fas fa-user-clock"></i>
            <span style="margin-left: 5px">受付</span>
          </vs-navbar-item>
          <vs-navbar-item :active="currentView == 'patient'" id="patient">
            <i class="fas fa-users"></i>
            <span style="margin-left: 5px">患者</span>
          </vs-navbar-item>
          <vs-navbar-item :active="currentView == 'medical'" id="medical">
            <i class="fas fa-notes-medical"></i>
            <span style="margin-left: 5px">医療</span>
          </vs-navbar-item>
          <vs-navbar-item :active="currentView == 'order'" id="order">
            <i class="fas fa-list"></i>
            <span style="margin-left: 5px">オーダー</span>
          </vs-navbar-item>
        </template>
        <template #right>
            <vs-avatar size="30">
              <img v-if="hasAvatar" :src="avatarURL"  @error="(() => hasAvatar = null)">
              <span v-else> {{ $store.getters.userFullName.charAt(0) }} </span>
            </vs-avatar>
            <span style="margin: 0 10px; opacity: 0.7"> {{ $store.getters.userFullName }} </span>
            <vs-button
              success
              border
              icon
              @click="currentView = 'settings'"
              size="mini"
              style="min-width: 40px"
              animation-type="scale"
            >
              <i class="fas fa-cog" style="font-size: 14px"></i>
              <template #animate >
                設定
              </template>
            </vs-button>
            <vs-button
              @click="logout()"
              success
              border
              icon 
              size="mini"
              style="min-width: 60px"
              animation-type="scale"
            >
              <i class="fas fa-sign-out-alt" style="font-size: 14px"></i>
              <template #animate >
                ログアウト
              </template>
            </vs-button>

        </template>
      </vs-navbar>

      <div class="home-main-cont">
        <transition name="juzoom" >
          <child-component :is="currentView" ref="childComp"></child-component>
        </transition>
      </div>

      <vs-dialog blur not-close prevent-close v-model="timeoutMsgOpen" style="position: absolute; z-index: 999999">
        <template #header>
          <h3 class="dialog-title">タイムアウト</h3>
        </template>
        <div>
          <div>セッションがあと <b>{{ timeRemaining }}</b> 分後無効にります。</div>
          <div>セッションを延長しますか？</div>
        </div>
        <template #footer>
          <vs-button transparent dark @click="logout()">ログアウト</vs-button>
          <vs-button dark @click="extendSession()">延長する</vs-button>
        </template>
      </vs-dialog>
      <vs-dialog blur not-close prevent-close v-model="sessionTimedOut">
        <template #header>
          <h3 class="dialog-title">セッションタイムアウト</h3>
        </template>
        <div>
          <div>セッションがタイムアウトしました。</div>
          <div>再ログインしてください。</div>
        </div>
        <template #footer>
          <vs-button transparent dark @click="logout()">再ログイン</vs-button>
        </template>
      </vs-dialog>
    </div>
</template>

<script>
import patient from '../components/patient/CC_view_patient_main'
import reception from '../components/reception/CC_view_reception_main'
import medical from '../components/medical/CC_view_medical_main'
import order from '../components/order/CC_view_order_main'
import dashboard from '../components/dashboard/CC_view_dashboard_main'
import settings from '../components/Settings/CC_view_settings_main'

export default {
  name: 'home',
  components: {
    'patient': patient,
    'reception': reception,
    'medical': medical,
    'order': order,
    'dashboard': dashboard,
    'settings': settings
  },
  data() {
    return (
      
      {
        loading: false,
        hasAvatar: true,
        currentView: "dashboard",
        timeRemaining: 0,
        timeoutMsgOpen: false,
        sessionTimedOut: false,
        cacheBreaker: 1
      }
    )
  },
  computed: {
    avatarURL() {
      return this.$globals.filesUrl + 'user' + this.$store.getters.userInfo.id + '.png?' + this.cacheBreaker
    }
  },
  created() {
    this.$eventHub.$on('apiError', this.apiError)
    this.$eventHub.$on('loading', this.setLoading)
    this.$eventHub.$on('loadingDone',  this.removeLoading)
    this.$eventHub.$on('updateCacheBreaker',  this.incrementCacheBreaker)

    this.$get('users/0')
    .then(result => {
      this.$store.commit('SET_USER_DATA', result.data)
    })
    .catch(result => {
      this.$apiError(result)
    })
    setTimeout(function(){this.checkSession()}.bind(this), 1000)
    this.setHoliday()
  },
  beforeDestroy: function() {
    this.$eventHub.$off('loading')
    this.$eventHub.$off('apiError')
    this.$eventHub.$off('loadingDone')
    this.$eventHub.$off('loadingDone')
  },
  methods: {
    incrementCacheBreaker() {
      this.cacheBreaker++
    },
    apiError(msg) {
      if (msg === 'Session Invalid') {
        this.sessionTimedOut = true
      } else {
        this.$vs.notification({
          color: 'danger',
          duration: 'none',
          position: 'top-center',
          title: 'API ERROR',
          text: msg
        })
      }
    },
    setHoliday() {
      let date = this.$moment().format("YYYY-M-D")  
      let holidayCheck = fetch('https://api.national-holidays.jp/' + '2021-01-02')
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          this.$store.commit('SET_HOLIDAY', true)
        }
      })
    },
    setLoading() {
      this.loading = true
    },
    removeLoading() {
      this.loading = false
    },
    checkSession() {
      if (!this.$store.getters.userInfo.id) {
        return
      }
      let warningThreshold = 5 //in min

      this.$get('sessions/' + this.$store.getters.userInfo.id)
      .then(result => {
          if (result.data < 1) {
            clearTimeout(deadline)
            this.logout()
          } else if (result.data < warningThreshold) {
            this.timeoutMsgOpen = true
          }
          this.timeRemaining = result.data
          var deadline = setTimeout(function(){this.checkSession()}.bind(this), 60000)
      })
      .catch(result => {
        this.$apiError(result)
      })
    },
    extendSession() {
      this.timeoutMsgOpen = false
      this.$put('sessions/' + this.$store.getters.userInfo.id)
      .catch(result => {
        this.$apiError(result)
      })

    },
    sessionTimeout() {
      alert('invalid')
      this.sessionTimedOut = true
    },
    logout() {

      this.$delete('sessions/' + this.$store.getters.userInfo.id)
      .then(result => {
        document.cookie = "PHPSESSID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        this.$store.commit('RESET_STATE')
        this.$router.push(result.data)
      })
      .catch(result => {
        this.apiError(result)
      })
    }
  },
  sockets: {
    connect() {
      console.log('connected to notification system');
    },
    disconnect() {
      console.log('disconnected from notification system');
    },
    broadcast(data) {
      console.log(data);
      
    }
  }
}
</script>

<style>
  .home-main-cont {
    padding: 0;
    overflow: hidden;
    padding-top: 50px;
    width: 100%;
    height: calc(100% - 50px)
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0
  }
  .displayForm .el-form-item {
    margin: 0
  }
  @keyframes selectJu1 {
  from {padding-left: 30px; opacity: 0}
  to {padding-left: 0; opacity: 1}

  }
  .selectAnimation {
    padding-left: 0px;
    opacity: 1;
    animation-name: selectJu1;
    animation-duration: .5s
  }
  .button_del_plain:hover {
    background: #F56C6C!important;
    border-color: #F56C6C!important;
    color: #FFF!important
  }
  .table-header-icon {
    color: #909399;
    font-size: 12px;
    margin-right: 5px
  }
  .table-header-icon-active {
    color: #00c7b2;
  }
  .border-tree {
    border: solid #bdbdbd 1px!important;
    border-radius: 5px
  }
</style>

<style scoped>
.home {
  height: 100%
}
</style>