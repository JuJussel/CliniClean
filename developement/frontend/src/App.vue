<template>
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
            router.push("/clinicare/app");
        })
        .catch(() => {
            router.push("/");
        });
};

// Created
isAuthenticated();
</script>
