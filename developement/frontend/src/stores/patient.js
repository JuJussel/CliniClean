import { defineStore } from 'pinia'
import useApi from "@/composables/apiComposable.js"

export const usePatientStore = defineStore({
    id: 'patient',
    persist: {
        enabled: false
    },
    state: () => {
        return {
            search: {
                timeout: null,
                loading: true,
                results: [],
            },
            basic: {
                loading: false,
                data: [],
            },
            medical: {
                loading: false,
                data: [],
            },
        }
    },
    actions: {
        async getBasic(id = null) {
            this.basic.loading = true;
            if (id) {
                this.basic = {
                    id: id
                }
            }
            try {
                let dbData = await useApi.get('patients/' + this.basic.id);
                this.basic.data = dbData
                this.basic.loading = false;

            } catch (err) {
                console.log(err);
            }
        },
        async searchPatients(params) {
            if (!params || params.length < 1) {
                this.search.results = [];
                return;
            }
            if (this.search.timeout) clearTimeout(this.search.timeout);
            this.search.timeout = setTimeout(async () => {
                this.search.loading = true;
                this.search.results = Array.from({ length: 10 }).map((_, i) => ({ id: "" }));
                try {
                    this.search.results = await useApi.get("persons/search?query=" + params);
                } catch (err) {
                    this.search.results = [];
                    console.log(err);
                }
                this.search.loading = false;
            }, 500);
        }
    },
    getters: {
        fullName: (state) => {
            const n = state.basic.data?.name || {};
            return [n.family, n.given].filter(Boolean).join(' ');
        },
    },
})