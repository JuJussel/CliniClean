<template>
    <div>
        <div v-if="notificationStore.notifications?.length < 1" class="wrapper">
            <img src="/img/empty2.8ccd6968.jpg" style="width: 200px;">
            <b> {{ $lang.noNotifications }} </b>
        </div>
        <div v-for="(item, index) in notificationStore.notifications" :key="index" class="notification-item" @click="handelClick(item)">
            <cui-badge :visible="!item.recepients[0].read">
                <div v-if="item.content.meta.type === 'examResultsAvailable'" style="display:flex">
                    <div style="width:50px; height:50px; display:flex; align-items:center; justify-content:center">
                        <i class="fas fa-microscope" style="margin-right: 10px; font-size: 40px" />
                    </div>
                    <div>
                        <div>
                            <span style="font-weight: normal; color: var(--cui-primary)"> {{ $lang.examResultsAvailable }} </span>
                        </div>
                        <div>
                            <span> {{ item.content.meta.order.patient.name }} </span>
                            <span> {{ item.content.meta.order.procedure.name }} </span>
                        </div>
                    </div>
                </div>
            </cui-badge>

        </div>


    </div>
</template>

<script>

import { useNotificationStore } from '@/stores/notification';
import { mapStores } from 'pinia';

export default {
    created() {
        this.getNotifications();
    },
    methods: {
        async handelClick(item) {
            await this.$api.put('notifications/' + item.id, { read: true });
            this.getNotifications();
            this.$emit('clickNotification', item);
        },
        async getNotifications() {
            let notifications = await this.$api.get('notifications');
            this.notificationStore.notifications = notifications
        }
    },
    computed: {
        ...mapStores(useNotificationStore)
    }
}
</script>

<style scoped>
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .notification-item {
        padding: 15px;
        border-radius: 10px;
        transition: all .2s ease;
    }
    .notification-item:hover {
        background: var(--cui-gray-2);
        cursor: pointer;
    }
     </style>