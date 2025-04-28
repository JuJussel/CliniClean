<template>
    <div v-if="modules.length > 1">Placeholder</div>
    <Suspense>
        <router-view />
    </Suspense>
</template>

<script setup>
import auth from "@/composables/authComposable.js";
import router from "./router";

// Methods
const isAuthenticated = function () {
    auth.check()
        .then(() => {
            router.push("/medical");
        })
        .catch(() => {
            router.push("/");
        });
};

const modules = ref(["medical"]);

// Created
isAuthenticated();
</script>
