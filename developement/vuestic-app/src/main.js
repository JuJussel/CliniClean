import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/styles/essential.css'
import 'vuestic-ui/styles/typography.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(createVuestic({
    config: {
        colors: {
            variables: {
                primary: "#15c18d",
                secondary: "#666E75",
                success: "#15c18d",
                info: "#4b7b8b",
                danger: "#E42222",
                warning: "#fed748",
                backgroundPrimary: "#FFFFFF",
                backgroundSecondary: "#FFFFFF",
                backgroundElement: "#ECF0F1",
                backgroundBorder: "#DEE5F2",
                textPrimary: "#262824",
                textInverted: "#FFFFFF",
                shadow: "rgba(0, 0, 0, 0.12)",
                focus: "#15c18d",
                transparent: "rgba(0, 0, 0, 0)",
                backgroundLanding: "#f4f9fc",
                backgroundLandingBorder: "rgba(155, 179, 206, 0.8)"
            }
        }
    }
}));
app.mount('#app')
