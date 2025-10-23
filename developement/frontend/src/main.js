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

// Form Inputs
// Formkit does not work with automatic registration :(
import AutoComplete from 'primevue/autocomplete';
import CascadeSelect from 'primevue/cascadeselect';
import Checkbox from 'primevue/checkbox';
import ColorPicker from 'primevue/colorpicker';
import DatePicker from 'primevue/datepicker';
import Editor from 'primevue/editor';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputOtp from 'primevue/inputotp';
import InputText from 'primevue/inputtext';
import Knob from 'primevue/knob';
import Listbox from 'primevue/listbox';
import MultiSelect from 'primevue/multiselect';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import Rating from 'primevue/rating';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Slider from 'primevue/slider';
import Textarea from 'primevue/textarea';
import ToggleButton from 'primevue/togglebutton';
import ToggleSwitch from 'primevue/toggleswitch';
import TreeSelect from 'primevue/treeselect';
import Button from 'primevue/button'

// // Import Quill styles for Editor
// import 'quill/dist/quill.core.css';
// import 'quill/dist/quill.snow.css';

import { plugin as formkitPlugin, defaultConfig as formkitDefaultConfig } from '@formkit/vue'
import formkitConfig from './config/formkit.config.js'
import '@sfxcode/formkit-primevue/dist/style.css'

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
            preset: {
                ...Aura,
                semantic: {
                    ...Aura.semantic,
                    primary: {
                        50: "{  slate.50}",
                        100: "{ slate.100}",
                        200: "{ slate.200}",
                        300: "{ slate.300}",
                        400: "{ slate.400}",
                        500: "{ slate.500}",
                        600: "{ slate.600}",
                        700: "{ slate.700}",
                        800: "{ slate.800}",
                        900: "{ slate.900}",
                        950: "{ slate.950}"
                    }
                }
            },
            options: {
                darkModeSelector: '.my-app-dark'
            },

        },
        locale: primeVueLocale.primeVue,
        ripple: true
    });
    app.use(ToastService);

    app.use(i18n)

    app.use(
        formkitPlugin,
        formkitDefaultConfig(formkitConfig)
    )

    app.directive('tooltip', Tooltip);

    // Register Form Input Components
    // Formkit does not work with automatic registration :(
    app.component('AutoComplete', AutoComplete);
    app.component('CascadeSelect', CascadeSelect);
    app.component('Checkbox', Checkbox);
    app.component('ColorPicker', ColorPicker);
    app.component('DatePicker', DatePicker);
    app.component('Editor', Editor);
    app.component('InputMask', InputMask);
    app.component('InputNumber', InputNumber);
    app.component('InputOtp', InputOtp);
    app.component('InputText', InputText);
    app.component('Knob', Knob);
    app.component('Listbox', Listbox);
    app.component('MultiSelect', MultiSelect);
    app.component('Password', Password);
    app.component('RadioButton', RadioButton);
    app.component('Rating', Rating);
    app.component('Select', Select);
    app.component('SelectButton', SelectButton);
    app.component('Slider', Slider);
    app.component('Textarea', Textarea);
    app.component('ToggleButton', ToggleButton);
    app.component('ToggleSwitch', ToggleSwitch);
    app.component('TreeSelect', TreeSelect);
    app.component('Button', Button);

    app.mount('#app')

})();

