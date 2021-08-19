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
import VueNativeSock from "vue-native-websocket-vue3";


const app = createApp(App);

moment.locale('ja');
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$GLOBALS = Globals;
app.config.globalProperties.$lang = Lang;
app.config.globalProperties.$apiError = function(msg) {
    this.$cui.notification({ text: msg, color: 'danger' })
};
app.use(store);
app.use(Cui);
app.provide('$notification', Cui.notification);
app.use(router);
app.use(DataService);
app.use(Auth);
app.use(VueNativeSock, Globals.websocketUrl, {
    connectManually: true,
    format: "json",
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
});

app.mount('#app')
