<template>
    <div class="flex flex-col h-full p-2">
        <Toast position="top-center" />
        <Menubar :model="menuItems">
            <template #end>
                <Chip :label="userStore.fullName" :image="avatarUrl" @click="toggleUserMenu" class="cursor-pointer" />
                <OverlayPanel ref="userMenu">
                    <Button label="Profile" icon="pi pi-user" severity="secondary" size="small" />
                </OverlayPanel>
            </template>
        </Menubar>
        <main class="grow mt-2 overflow-hidden">
            <transition name="juzoom">
                <component :is="uiStore.activeTab" style="height: 100%"></component>
            </transition>
        </main>
    </div>
</template>

<script setup>

import reception from '@/comps/layouts/reception '
import Toast from 'primevue/toast';


const { t } = useI18n({})
const uiStore = useUiStore()
const userStore = useUserStore()
const settingStore = useSettingStore()
const listStore = useListStore()
const { proxy } = getCurrentInstance()

const userMenu = ref(null);

await listStore.getData()
await settingStore.getData()
proxy.$connect("");

const menuItems =
    [{
        label: t("home"),
        icon: 'fa fa-home menu-icon',
        command: () => {
            uiStore.activeTab = 'dashboard'
        }
    }, {
        label: t("reception"),
        icon: 'fas fa-user-clock',
        command: () => {
            uiStore.activeTab = reception
        }
    }, {
        label: t("order"),
        icon: 'fas fa-laptop-medical',
        command: () => {
            uiStore.activeTab = reception
        }
    }]

const avatarUrl = computed(() => {
    return settingStore.settingData.filesUrl +
        "user" +
        userStore.userData?.id +
        ".png"
})

function toggleUserMenu(event) {
    userMenu.value.toggle(event);
}

function logout() {
    this.$auth().remove();
    this.$router.push("/");
}

</script>

<style scoped>
.juzoom-enter-active {
    transition: all 0.3s;
}

.juzoom-enter-from,
.juzoom-leave-to {
    opacity: 0;
    transform: scale3d(1.03, 1.03, 1.03);
}
</style>
