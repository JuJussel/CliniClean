import { defineStore } from 'pinia'
import useApi from "@/composables/apiComposable.js"

export const useSettingStore = defineStore({
    id: 'setting',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            settingData: {}
        }
    },
    actions: {
        async getData() {
            this.loading = true
            try {
                let dbData = await useApi.get('settings/public');
                this.settingData = Object.assign(this.settingData, dbData)
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        }
    }
})