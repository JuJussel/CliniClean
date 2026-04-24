export const usePatientStore = defineStore('PatientStore', {
    state: () => ({
        searchTimeout: null,

    }),
    actions: {
        async searchPatients(query, patientsOnly = false) {
            if (!query) {
                return [];
            }

            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            return new Promise((resolve) => {
                this.searchTimeout = setTimeout(async () => {
                    try {
                        const res = await $fetch("api/patient/search", {
                            params: {
                                query: query,
                            },
                            method: "GET",
                        });
                        if (res.success && res.data) {
                            resolve(res.data.patients || []);
                        } else {
                            console.error('API Error:', res.message);
                            resolve([]);
                        }
                    } catch (e) {
                        console.error('Search error:', e);
                        resolve([]);
                    }
                }, 500);
            });
        }
    }
})