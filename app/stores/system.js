export const useSystemStore = () => {
    const innerStore = defineStore('systemStore', {
        persist: true,
        state: () => ({
            system: null,
            icons: {
                phone: "fa-solid fa-phone",
                email: "fa-solid fa-envelope",
                work: "fa-solid fa-briefcase",
                home: "fa-solid fa-house",
                mobile: "fa-solid fa-mobile-screen"
            }

        }),
        actions: {
            async getSystemData() {
                try {
                    const res = await $fetch("/api/system", {
                        method: "GET",
                    });
                    if (res.success && res.data) {
                        this.system = res.data;
                    } else {
                        console.error('API Error:', res.message);
                        this.system = null;
                    }
                } catch (e) {
                    console.error('System data error:', e);
                    this.system = null;
                }
            },
        },

    })

    const store = innerStore();

    if (!store.system) {
        store.getSystemData();
    }
    return store;



}