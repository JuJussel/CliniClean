export const usePersonStore = defineStore('PersonStore', {
    state: () => ({
        searchTimeout: null,

    }),
    actions: {
        async searchPersons(query, patientsOnly = false) {
            if (!query) {
                return [];
            }

            if (this.searchTimeout) clearTimeout(this.searchTimeout);
            return new Promise((resolve) => {
                this.searchTimeout = setTimeout(async () => {
                    try {
                        const res = await $fetch("api/person/search", {
                            params: {
                                query: query,
                                patientsOnly: patientsOnly
                            },
                            method: "GET",
                        });
                        resolve(res.persons);
                    } catch (e) {
                        console.error(e);
                        resolve([]);
                    }
                }, 500);
            });
        }
    }
})