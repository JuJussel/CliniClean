<template>
    <div class="flex flex-col h-full p-2">
        <Menubar :model="menuItems" class="">
            <template #end>
                <Chip :label="userStore.fullName" :image="avatarUrl" @click="toggleUserMenu" />
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

<script>

import { useUserStore } from '@/stores/user'
import { useListStore } from '@/stores/list'
import { useNotificationStore } from '@/stores/notification'
import { useUiStore } from '@/stores/ui'
import { useSettingStore } from '@/stores/setting'
import { mapStores } from 'pinia'

import reception from '../layouts/receptionv2.vue'

export default {
    components: {
        reception
    },
    data() {
        return {
            menuItems: [{
                label: this.$lang.home,
                icon: 'pi pi-home',
                command: () => {
                    this.uiStore.activeTab = 'dashboard'
                }
            },{
                label: this.$lang.reception,
                icon: 'pi pi-home',
                command: () => {
                    this.uiStore.activeTab = 'reception'
                }
            },]
        }
    },

    computed: {
        ...mapStores(useUserStore, useListStore, useNotificationStore, useUiStore, useSettingStore),
        avatarUrl() {
            return (
                this.$GLOBALS.filesUrl +
                "user" +
                this.userStore.userData?.id +
                ".png"
            );
        },
        hasNewNotification() {
            let not = this.notificationStore.notifications;
            let hasNot = not.filter((item) => !item.recepients[0].read);
            return hasNot.length > 0 ? true : false;
        },
    },

    methods: {
        logout() {
            this.$auth().remove();
            this.$router.push("/");
        },
        toggleUserMenu(event) {
            this.$refs.userMenu.toggle(event);
        }
    },
}

</script>