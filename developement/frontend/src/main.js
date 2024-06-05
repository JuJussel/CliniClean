import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'
import Auth from '@/services/auth.service'
import Cui from 'clini-ui-lib'
import 'clini-ui-lib/src/css/globals.css'
import './css/custom.css'
import '@fortawesome/fontawesome-free/css/all.css'
import Lang from './lang/jp'
import { parseDate, copy } from './utils'
import ApiService from '@/services/api.service'
import AclService from '@/services/acl.service'
import VueNativeSock from "vue-native-websocket-vue3";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/ja";

import PrimeVue from 'primevue/config';
import Aura from 'primevue/themes/aura';
import 'primeicons/primeicons.css'



(async () => {
    const app = createApp(App);
    const pinia = createPinia();
    pinia.use(piniaPersist);

    let Globals = await (await fetch('/api/settings/frontend')).json();

    dayjs.extend(relativeTime);
    dayjs.extend(isBetween);
    dayjs.locale("ja");

    app.config.globalProperties.$dayjs = dayjs;
    app.config.globalProperties.$parseDate = parseDate;
    app.config.globalProperties.$copy = copy;
    app.config.globalProperties.$GLOBALS = Globals;
    app.config.globalProperties.$lang = Lang;
    app.config.globalProperties.$apiError = function (msg) {
        this.$cui.notification({ text: msg, color: 'danger' })
    };

    app.use(pinia)
    app.use(Cui);
    app.provide('$notification', Cui.notification);
    app.use(router);
    app.use(AclService, Globals);
    app.use(ApiService)

    app.use(Auth);
    app.use(VueNativeSock, "wss://" + window.location.hostname + ":" + Globals.websocketPort, {
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
                darkModeSelector: '.my-app-dark',
            }
        }
    });

    app.mount('#app')

})();

