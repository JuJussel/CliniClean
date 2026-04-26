<script setup>
const { loggedIn, user, fetch: refreshSession } = useUserSession();
const credentials = reactive({
    username: "ekurosu2",
    password: "Passw0rd",
});
const userStore = useUserStore();

if (loggedIn.value) {
    // If already logged in, redirect to home page
    navigateTo("/");
}

async function login() {
    try {
        const userData = await $fetch("/api/login", {
            method: "POST",
            body: credentials,
        });

        // Refresh the session on client-side and redirect to the home page
        await refreshSession();
        userStore.setUser(userData.user); // Update the user store with the logged-in user's
        await navigateTo("/");
    } catch {
        alert("Bad credentials");
    }
}
</script>

<template>
    <form @submit.prevent="login">
        <input v-model="credentials.username" placeholder="Username" />
        <input
            v-model="credentials.password"
            type="password"
            placeholder="Password"
        />
        <button type="submit">Login</button>
    </form>
</template>
