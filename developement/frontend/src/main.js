import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'
import router from './router'
import Auth from '@/services/auth.service'
import Globals from '@/config/global';

import moment from 'moment'
import 'moment/locale/ja';
import Cui from 'clini-ui-lib'
import 'clini-ui-lib/src/css/globals.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Lang from './lang/jp'

import DataService from '@/services/data.service'


import { addDevtools } from "@/devtools/index" //TODO remove once DEvtools support VUEX4



const app = createApp(App)

moment.locale('ja')
app.config.globalProperties.$moment = moment
app.config.globalProperties.$GLOBALS = Globals
app.config.globalProperties.$lang = Lang
app.config.globalProperties.$apiError = function(msg) {
    this.$cui.notification({ text: msg, color: 'danger' })
}
app.use(store)
app.use(Cui)
app.provide('$notification', Cui.notification)
app.use(router)
app.use(DataService)
app.use(Auth)
app.mount('#app')



addDevtools(app, store) //TODO remove once DEvtools support VUEX4