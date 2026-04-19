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
                        resolve(res.patients);
                    } catch (e) {
                        console.error(e);
                        resolve([]);
                    }
                }, 500);
            });
        }
    }
})