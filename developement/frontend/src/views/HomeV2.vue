<template>
    <div class="flex flex-col h-full p-2">
        <Menubar :model="menuItems" class="">
            <template #end>
                <Chip :label="uiStore.activeTab" :image="avatarUrl" @click="toggleUserMenu" />
                <OverlayPanel ref="userMenu">
                    <Button label="Profile" icon="pi pi-user" severity="secondary" size="small" />
                </OverlayPanel>
            </template>
        </Menubar>
        <main class="grow mt-2">
            <component
                :is="uiStore.activeTab"
                style="height: 100%"
            ></component>
        </main>
    </div>
</template>

<script setup>

import reception from '../layouts/receptionv2.vue'

const uiStore = useUiStore() 

const menuItems =
    [{
        label: lang.home,
        icon: 'pi pi-home',
        command: () => {
            uiStore.activeTab = 'dashboard'
        }
    },{
        label: lang.reception,
        icon: 'pi pi-home',
        command: () => {
            uiStore.activeTab = markRaw(reception)
        }
    },]

const avatarUrl = computed(() => {
    return this.$GLOBALS.filesUrl + "user" + ".png"
})

function logout() {
    this.$auth().remove();
    this.$router.push("/");
}

</script>

<script>


export default {

    computed: {
        // ...mapStores(useUserStore, useListStore, useNotificationStore, useUiStore, useSettingStore),
        hasNewNotification() {
            let not = this.notificationStore.notifications;
            let hasNot = not.filter((item) => !item.recepients[0].read);
            return hasNot.length > 0 ? true : false;
        },
    },
}

</script>