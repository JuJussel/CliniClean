<template>
    <div style="height: 100%">
        <div style="height: 30px; display: flex; justify: flex-start; padding-left: 10px">
            <vs-button-group>
                <vs-button
                border
                dark
                v-acl="tab.acl"
                :active="activeTab == index"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = index"
                >
                    <span> {{ tab.label }} </span>
                </vs-button>
            </vs-button-group>
        </div>
        <vs-row>
            <div class="content-card" style="height: calc(100% - 50px); width: 100%">
                <div class="cc-card-has-header">
                    <div class="cc-card-header" style="border-radius: 15px">
                        <h2> {{ tabs[activeTab].label }} </h2>
                    </div>
                </div>
            </div>
        </vs-row>
        <vs-row style="height: calc(100% - 100px)">
            <child-component :is="tabs[activeTab].name" ref="childComp" style="width: 100%"></child-component>
        </vs-row>

    </div>
</template>

<script>

import account from './CC_view_settings_account'
import users from './CC_view_settings_users'
import sets from './CC_view_settings_sets'
import other from './CC_view_settings_other'


export default {
    components: {
        account: account,
        users: users,
        sets: sets,
        other: other
    },
    data() {
        return {
            activeTab: 0,
            tabs: [
                {name: 'account', label: 'アカウント'},
                {name: 'users', label: 'ユーザー', acl: 'settings.user'},
                {name: 'sets', label: 'セット'},
                {name: 'other', label: 'その他'}
            ]
        }
    }
    
}
</script>