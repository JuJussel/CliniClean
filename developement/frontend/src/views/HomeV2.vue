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
        <main class="grow grid gap-2 grid-rows-2 grid-cols-2 mt-2">
            <Card>

                <template #title>Simple Card</template>

                <template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                        repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                        quam perferendis esse, cupiditate neque
                        quas!
                    </p>
                </template>
            </Card>
            <Card>

                <template #title>Simple Card</template>

                <template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                        repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                        quam perferendis esse, cupiditate neque
                        quas!
                    </p>
                </template>
            </Card>
            <Card>

                <template #title>Simple Card</template>

                <template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                        repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                        quam perferendis esse, cupiditate neque
                        quas!
                    </p>
                </template>
            </Card>
            <Card>

                <template #title>Simple Card</template>

                <template #content>
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error
                        repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione
                        quam perferendis esse, cupiditate neque
                        quas!
                    </p>
                </template>
            </Card>

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

export default {
    data() {
        return {
            menuItems: [{
                label: this.$lang.home,
                icon: 'pi pi-home',
                command: () => {
                    changeMenu("home")
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
        changeMenu(val) {
            if (val === "logout") {
                this.$auth().remove();
                this.$router.push("/");
            } else {
                this.uiStore.activeTab = val
            }
        },
        toggleUserMenu(event) {
            this.$refs.userMenu.toggle(event);
        }
    },
}

</script>