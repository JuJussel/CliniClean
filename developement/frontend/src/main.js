import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'
import './css/custom.css'
import '@fortawesome/fontawesome-free/css/all.css'
import VueNativeSock from "vue-native-websocket-vue3";
import i18n from '@/lang/i18n'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import primeVueLocale from "./lang/ja.json"


(async () => {
    const app = createApp(App);

    // Pinia Store
    const pinia = createPinia();
    pinia.use(piniaPersist);
    app.use(pinia)

    const settingStore = useSettingStore()
    const globals = await (await fetch('/api/settings/frontend')).json();
    settingStore.settingData = Object.assign(settingStore.settingData, globals);

    app.use(router);

    app.use(VueNativeSock, 'wss://' + window.location.hostname + ':3003', {
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
        locale: primeVueLocale.primeVue,
        ripple: true
    });
    app.use(ToastService);

    app.use(i18n)

    app.directive('tooltip', Tooltip);

    app.mount('#app')

})();

