import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'
import router from './router'
import Auth from '@/services/auth.service'
import Globals from '@/config/global';
import Cui from 'clini-ui-lib'
import 'clini-ui-lib/src/css/globals.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Lang from './lang/jp'
import parseDate from './utils/dateParse'
import DataService from '@/services/data.service'
import VueNativeSock from "vue-native-websocket-vue3";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/ja";
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App);

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.locale("ja");
app.config.globalProperties.$dayjs = dayjs;
app.config.globalProperties.$parseDate = parseDate;
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
app.use(VueGoogleMaps, {
    load: {
        key: Globals.googleMapsApiKey
    }
})

app.mount('#app')
