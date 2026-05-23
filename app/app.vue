<script setup>
import { ja } from "@nuxt/ui/locale";
const { user, clear: clearSession, loggedIn } = useUserSession();

const active = ref();
const navItems = [
    { label: $t("home"), icon: "i-material-symbols-home-rounded", to: "/" },
    {
        label: $t("reception"),
        icon: "i-material-symbols-groups-2",
        to: "/reception",
    },
    {
        label: $t("patientInfo"),
        icon: "i-material-symbols-document-scanner-rounded",
        to: "/",
    },
];

async function logout() {
    await clearSession();
    localStorage.clear();
    await navigateTo("/login");
    window.location.reload();
}
</script>

<template>
    <UApp :locale="ja">
        <NuxtLayout>
            <UDashboardGroup>
                <UDashboardPanel id="reception">
                    <template #header>
                        <UDashboardNavbar
                            v-if="loggedIn"
                            :ui="{ right: 'gap-3' }"
                        >
                            <template #left>
                                <img
                                    src="~/assets/img/cclogo.png"
                                    alt="CliniClean Logo"
                                    class="h-8 w-8"
                                />
                                <h1 class="text-2xl font-bold">CliniClean</h1>
                            </template>
                            <template #right>
                                <UUser
                                    :name="user?.fullName"
                                    :avatar="{
                                        src:
                                            '/api/asset/avatar_' + user?.avatar,
                                    }"
                                    size="xl"
                                />
                                <UColorModeButton />
                                <UButton
                                    color="neutral"
                                    variant="ghost"
                                    icon="i-material-symbols-logout"
                                    aria-label="Logout"
                                    @click="logout"
                                />
                            </template>
                            <UNavigationMenu
                                v-model="active"
                                :items="navItems"
                            />
                        </UDashboardNavbar>
                    </template>
                    <template #body>
                        <NuxtPage />
                    </template>
                </UDashboardPanel>
            </UDashboardGroup>
        </NuxtLayout>
    </UApp>
</template>
