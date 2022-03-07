<template>
    <div class="loader" v-if="!ready"></div>
    <div v-if="ready">
        <cui-menu-bar @change="changeMenu" :value="activeTab">
            <template v-slot:left>
                <cui-menu-bar-item 
                    icon="fa fa-home menu-icon" 
                    :label="$lang.home"
                    value="dashboard"
                    v-if="$aclService(0, 'dashboard')"
                />
                <cui-menu-bar-item
                    icon="fas fa-user-clock"
                    :label="$lang.reception"
                    value="reception"
                    v-if="$aclService(1, 'reception')"
                />
                <cui-menu-bar-item
                    icon="fas fa-users menu-icon"
                    :label="$lang.patient"
                    value="patient"
                    v-if="$aclService(1, 'patient')"
                />
                <cui-menu-bar-item
                    icon="fas fa-laptop-medical menu-icon"
                    :label="$lang.medical"
                    value="medical"
                    v-if="$aclService(1, 'medical')"
                />
                <cui-menu-bar-item
                    icon="fas fa-laptop-medical menu-icon"
                    :label="$lang.order"
                    value="order"
                    v-if="$aclService(1, 'order')"
                />
            </template>
            <template v-slot:center>
            </template>
            <template v-slot:right>
                <div style="display: flex; align-items: center; margin-right: 20px" >
                    <cui-avatar :image="avatarUrl" />
                    <div style="margin-left: 10px; color:var(--cui-gray-5); display: flex">
                        {{ $store.getters.userFullName }}
                        <cui-tooltip >
                            <cui-badge :visible="hasNewNotification">
                                <i class="fas fa-bell" style="cursor: pointer; margin-left: 5px"></i>
                            </cui-badge>
                            <template #tooltip>
                                <notification />
                            </template>
                        </cui-tooltip>

                    </div>
                </div>
                <cui-menu-bar-item 
                    style="padding: 10px!important" 
                    plainIcon icon="fas fa-cog" 
                    value="settings" 
                    v-if="true"
                />
                <!-- $aclService(1, 'settings') -->
                <cui-menu-bar-item style="padding: 10px!important" plainIcon icon="fas fa-sign-out-alt" value="logout" />
            </template>
        </cui-menu-bar>
        <div class="cc-home-main-cont">
            <transition name="juzoom">
                <component :is="activeTab" style="height: 100%"></component>
            </transition>
        </div>
    </div>
</template>

<script>
import reception from "../components/cc_reception/cc_reception_main";
import patient from "../components/cc_patient/cc_patient_main";
import medical from "../components/cc_medical/cc_medical_main.vue";
import order from "../components/cc_order/cc_order_main.vue";
import notification from "../components/shared/cc_shared_notifications.vue"
import dashboard from "../components/cc_dashboard/cc_dashboard.vue"
import settings from "../components/cc_settings/cc_settings_main.vue"

export default {
    name: "HomeView",
    components: {
        reception,
        patient,
        medical,
        order,
        notification,
        dashboard,
        settings
    },
    async created() {
        await this.$dataService().get.lists.static();
        await this.$dataService().get.settings.public();
        this.ready = true;
        this.$connect()
        this.$options.sockets.onmessage = (data) => {
            data = JSON.parse(data.data)
            if(data.event === "updateNotifications") this.getNotifications()
        };

    },
    data() {
        return {
            activeTab: "dashboard",
            ready: false
        };
    },
    methods: {
        changeMenu(val) {
            if (val === "logout") {
                this.$auth.remove();
                this.$router.push("/");
            } else {
                this.activeTab = val;
                this.$store.commit("SET_ACTIVE_VIEW", val);
            }
        }
    },
    computed: {
        avatarUrl() {
            return (
                this.$GLOBALS.filesUrl +
                "user" +
                this.$store.getters.user?.id +
                ".png"
            );
        },
        activeView() {
            return this.$store.getters.activeView;
        },
        hasNewNotification() {
            let not = this.$store.getters.notifications;
            let hasNot = not.filter(item => !item.recepients[0].read);
            return hasNot.length > 0 ? true : false;
        }

    }
};
</script>

<style scoped>
.cc-home-main-cont {
    height: calc(100% - 70px);
    width: 100%;
    position: absolute;
    overflow: hidden;
}
.juzoom-enter-active {
    transition: all 0.3s;
}
.juzoom-enter-from,
.juzoom-leave-to {
    opacity: 0;
    transform: scale3d(1.03, 1.03, 1.03);
}

</style>
<style >
.h2-header {
    background: var(--cui-gray-0);
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}
.cc-headers {
    border-bottom: solid 1px var(--cui-gray-5);
    border-top: solid 1px var(--cui-gray-5);
    padding: 5px;
    background: var(--cui-gray-0);
    height: 25px;
}
.cc-image-card {
    width: 170px!important;
    height: 170px!important;
    overflow: hidden;
}
.cc-image-card-img {
    max-width: 100%;
    max-height: calc(100% - 30px);
    display: block;
}
.cc-image-card-text {
    color: var(--cui-dark);
    padding: 3px 10px;
}
.cc-image-card-schema-cont {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}
.cc-image-cont {
  display: flex;
  flex-wrap: wrap;
  overflow: auto
}

</style>