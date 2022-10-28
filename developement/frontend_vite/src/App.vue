<template>
    <router-view />
</template>

<script>
export default {
    name: "App",
    created() {
        this.isAuthenticated();
    },
    methods: {
        isAuthenticated() {
            this.$auth()
                .check()
                .then(() => {
                    this.$router.push("/home");
                })
                .catch(() => {
                    this.$router.push("/");
                });
        },
    },
};
</script>