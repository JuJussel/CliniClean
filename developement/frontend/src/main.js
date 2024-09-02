import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'
import Auth from '@/services/auth.service'
import Cui from 'clini-ui-lib'
// import 'clini-ui-lib/src/css/globals.css'
import './css/custom.css'
import '@fortawesome/fontawesome-free/css/all.css'
// import Lang from './lang/jp'
import { parseDate, copy } from './utils'
import ApiService from '@/services/api.service'
import AclService from '@/services/acl.service'
import VueNativeSock from "vue-native-websocket-vue3";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import isBetween from "dayjs/plugin/isBetween";
// import "dayjs/locale/ja";
import i18n from '@/lang/i18n'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';


(async () => {
    const app = createApp(App);

    // Pinia Store
    const pinia = createPinia();
    pinia.use(piniaPersist);
    app.use(pinia)

    // DayJs Config
    // dayjs.extend(relativeTime);
    // dayjs.extend(isBetween);
    // dayjs.locale("ja");

    // To remove
    // app.use(Cui);
    // app.config.globalProperties.$dayjs = dayjs;
    // app.config.globalProperties.$parseDate = parseDate;
    // app.config.globalProperties.$copy = copy;
    // app.config.globalProperties.$apiError = function (msg) {
    //     this.$cui.notification({ text: msg, color: 'danger' })
    // };
    // app.provide('$notification', Cui.notification);

    const settingStore = useSettingStore()
    const globals = await (await fetch('/api/settings/frontend')).json();
    settingStore.settingData = Object.assign(settingStore.settingData, globals);

    app.use(router);
    app.use(AclService, globals);
    app.use(ApiService)

    app.use(Auth);
    app.use(VueNativeSock, 'wss://localhost:3003', {
        connectManually: true,
        format: "json",
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
    });

    app.use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.my-app-dark'
            }
        },
        ripple: true
    });
    app.use(ToastService);

    app.use(i18n)

    app.mount('#app')

})();

