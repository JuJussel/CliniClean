<template>
    <div>
        <cui-button-group v-model="activeTab" style="margin-left: 10px">
            <cui-button-group-item label="User Administration" value="users"></cui-button-group-item>
            <cui-button-group-item label="System" value="system"></cui-button-group-item>
        </cui-button-group>
        
        <cui-card class="cc-settings-main-tab-hidden" v-bind:class="{ 'cc-settings-main-tab-visible': 'users' === activeTab }">
            <component :is="activeTab"></component>
        </cui-card>


    </div>
</template>

<script>
import users from "./users/cc_settings_users.vue"

export default {
    components: {
        users
    },
    data() {
        return {
            activeTab: 'users'
        }
    }
}
</script>

<style scoped>
    .cc-settings-main-tab-hidden {
        height: calc(100% - 70px);
        display: none;
    }
    .cc-settings-main-tab-visible {
        display: block;
    }
</style>