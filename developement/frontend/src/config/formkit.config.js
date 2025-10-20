import { ja } from '@formkit/i18n'
import { primeInputs, primeOutputs } from '@sfxcode/formkit-primevue'


export default {
    locales: { ja },
    locale: 'ja',
    inputs: { ...primeInputs, ...primeOutputs },
    messages: {
        ja: {
            name: '名前',
        }
    }
}