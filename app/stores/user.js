export const useUserStore = defineStore('userStore', {
    persist: true,
    state: () => ({
        loading: false,
        userData: null
    }),
    getters: {
        fullName() {
            return this.userData?.nameLast + this.userData?.nameFirst
        }
    },
    actions: {
        setUser(user) {
            this.userData = user
        },
        clearUser() {
            this.userData = null
        }
    }
})