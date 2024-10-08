<template>
    <div class="flex flex-col h-full">
        <Toast position="top-center" />
        <Menubar :model="menuItems">
            <template #end>
                <div class="flex">
                    <encounterWidget />
                    <Chip :label="userStore.fullName" :image="avatarUrl" @click="toggleUserMenu"
                        class="cursor-pointer" />
                    <Popover ref="userMenu">
                        <Button label="Profile" icon="pi pi-user" severity="secondary" size="small" />
                    </Popover>
                </div>
            </template>
        </Menubar>
        <main class="grow overflow-hidden p-2">
            <transition name="juzoom">
                <component :is="uiStore.activeTab" style="height: 100%"></component>
            </transition>
        </main>
    </div>
</template>

<script setup>

import reception from '@/comps/layouts/reception'
import encounter from '@/comps/layouts/encounter'
import encounterWidget from '@/comps/shared/widgets/encounter_widget.vue'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Popover from 'primevue/popover';

const toast = useToast();
const { t } = useI18n({})
const uiStore = useUiStore()
const userStore = useUserStore()
const settingStore = useSettingStore()
const listStore = useListStore()
const { proxy } = getCurrentInstance()

const userMenu = ref(null);

await listStore.getData()
await settingStore.getData()
proxy.$connect();

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
        icon: 'fas fa-basket-shopping',
        command: () => {
            uiStore.activeTab = reception
        }
    }, {
        label: t("patientInfo"),
        icon: 'fas fa-laptop-medical',
        command: () => {
            uiStore.activeTab = medical
        }
    }
    ]

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


watch(uiStore.toasts, () => {
    uiStore.toasts.forEach((item, index) => {
        toast.add(item);
        uiStore.toasts.splice(index, 1)
    })
})

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