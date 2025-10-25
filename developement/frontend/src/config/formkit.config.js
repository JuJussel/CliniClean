import { ja } from '@formkit/i18n'
import { primeInputs, primeOutputs } from '@sfxcode/formkit-primevue'
// wanakana provides helpers to detect Japanese script types
import { isKatakana, isKana, isKanji, isRomaji } from 'wanakana'
import i18n from '@/lang/i18n'


// shorthand for translations inside this config
const t = (key) => i18n?.global?.t(key)

const legends = ['checkbox_multi', 'radio_multi', 'repeater', 'transferlist'];

function addAsteriskPlugin(node) {
    if (['button', 'submit', 'hidden', 'group', 'list', 'meta'].includes(node.props.type)) return;

    node.on('created', () => {
        const legendOrLabel = legends.includes(`${node.props.type}${node.props.options ? '_multi' : ''}`) ? 'legend' : 'label';

        if (node.props.definition.schemaMemoKey) {
            node.props.definition.schemaMemoKey += `${node.props.options ? '_multi' : ''}_add_asterisk`;
        };

        const schemaFn = node.props.definition.schema
        node.props.definition.schema = (sectionsSchema = {}) => {
            sectionsSchema[legendOrLabel] = {
                children: ['$label', {
                    $el: 'span',
                    if: '$state.required',
                    attrs: {
                        class: '$classes.asterisk',
                    },
                    children: ['*']
                }]
            }

            return schemaFn(sectionsSchema)
        }
    })
}




export default {
    // Plugins (e.g. custom AST modifications)
    plugins: [addAsteriskPlugin],
    // Localization
    locales: { ja },
    locale: 'ja',
    // Include PrimeVue inputs and outputs for formkit-primevue
    inputs: { ...primeInputs, ...primeOutputs },

    // Custom validation rules available in FormKit schema using the rule name
    // Example usage in schema: validation: "required|katakana"
    rules: {
        kanji(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            return isKanji(String(value.value))
        },
        notKanji(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            return !isKanji(String(value.value)) || t('validationMessages.notKanji')
        },
        kana(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            return isKana(String(value.value)) || t('validationMessages.kana')
        },
        hiragana(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            return isHiragana(String(value.value)) || t('validationMessages.kana')
        },
        katakana(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            return isKatakana(String(value.value)) || t('validationMessages.katakana')
        },
        romaji(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            return isRomaji(String(value.value)) || t('validationMessages.romaji')
        }
        ,
        japanesePhone(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            // allow hyphens and spaces in input
            const raw = String(value.value)
            const normalized = raw.replace(/[\s-]/g, '')

            // Accept local (0...) or international (+81...) formats
            const local = /^0\d{9,10}$/.test(normalized)
            const intl = /^\+81\d{9,10}$/.test(normalized)

            return (local || intl)
        }
        ,
        japanesePostal(value) {
            if (value.value === undefined || value.value === null || value.value === '') return true
            // allow hyphens, spaces and the postal mark '〒'
            const raw = String(value.value)
            const normalized = raw.replace(/[\s\-〒]/g, '')

            // Japanese postal codes are 7 digits (e.g. 123-4567 or 1234567)
            const ok = /^\d{7}$/.test(normalized)
            return ok
        }
    },
    messages: {
        ja: {
            validation: {
                kanji: () => t('validationMessages.kanji'),
                notKanji: () => t('validationMessages.notKanji'),
                kana: () => t('validationMessages.kana'),
                hiragana: () => t('validationMessages.hiragana'),
                katakana: () => t('validationMessages.katakana'),
                romaji: () => t('validationMessages.romaji'),
                japanesePhone: () => t('validationMessages.invalidPhone'),
                japanesePostal: () => t('validationMessages.invalidPostal'),
            }
        }
    }
}