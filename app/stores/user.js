export const useUserStore = defineStore('userStore', {
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