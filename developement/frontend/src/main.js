import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'
import router from './router'
import Api from '@/plugins/api'

import moment from 'moment'
import Cui from 'clini-ui-lib'
import 'clini-ui-lib/src/css/globals.css'
import '@fortawesome/fontawesome-free/css/all.css'



import { addDevtools } from "@/devtools/index" //TODO remove once DEvtools support VUEX4



const app = createApp(App)

app.config.globalProperties.$moment=moment
app.use(store)
app.use(Cui)
app.provide('$notification', Cui.notification)
app.use(router)
app.use(Api)
app.mount('#app')



addDevtools(app, store) //TODO remove once DEvtools support VUEX4