<template>
    <div>
        <cui-button-group v-model="activeTab" style="margin-left: 10px">
            <cui-button-group-item
                label="User Administration"
                value="users"
            ></cui-button-group-item>
            <cui-button-group-item
                label="System"
                value="system"
            ></cui-button-group-item>
        </cui-button-group>

        <div
            class="cc-settings-main-tab-hidden"
            v-bind:class="{
                'cc-settings-main-tab-visible': 'users' === activeTab,
            }"
        >
            <div v-if="loading" class="loader"></div>
            <component
                :is="activeTab"
                @loading="loading = true"
                @done="loading = false"
            ></component>
        </div>
    </div>
</template>

<script>
import { users } from "../parts/cc_p_settings";

export default {
    components: {
        users,
    },
    data() {
        return {
            activeTab: "users",
            loading: false,
        };
    },
};
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