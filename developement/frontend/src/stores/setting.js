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
            settingDataRaW: null
        }
    },
    getters: {
        settingData() {
            if (this.settingDataRaW) {
                return this.settingDataRaW
            }
            this.getData()
        }
    },
    actions: {
        async getData() {
            this.loading = true
            try {
                let dbData = await apiService.get('settings/public');
                this.settingDataRaW = dbData
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        }
    }
})