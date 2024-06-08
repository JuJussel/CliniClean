import { createI18n } from "vue-i18n";
import ja from "./ja.json";

function loadLocaleMessages() {
    const locales = [{ ja: ja }];
    const messages = {};
    locales.forEach((lang) => {
        const key = Object.keys(lang);
        messages[key] = lang[key];
    });
    return messages;
}
export default createI18n({
    locale: "ja",
    fallbackLocale: "ja",
    legacy: false,
    messages: loadLocaleMessages(),
});