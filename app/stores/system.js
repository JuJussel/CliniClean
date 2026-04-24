export const useSystemStore = defineStore('systemStore', {
    persist: true,
    state: () => ({
        system: null,

    }),
    actions: {
        async getSystemData() {
            try {
                const res = await $fetch("api/system", {
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
        }
    }
})