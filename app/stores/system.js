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
                this.system = res.data;
            } catch (e) {
                console.error(e);
                this.system = null;
            }
        }
    }
})