import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

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
                let dbData = await apiService.get('settings/public');
                this.settingData = Object.assign(this.settingData, dbData)
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        }
    }
})