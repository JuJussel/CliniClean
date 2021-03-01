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
        <vs-row style="height: calc(100% - 30px)">
            <child-component :is="tabs[activeTab].name" ref="childComp" style="width: 100%"></child-component>
        </vs-row>

    </div>
</template>

<script>

import account from './CC_view_settings_account'
import users from './CC_view_settings_users'
import sets from './CC_view_settings_sets'
import other from './CC_view_settings_other'
import shindan from './CC_view_settings_shindan'

export default {
    components: {
        account: account,
        users: users,
        sets: sets,
        other: other,
        shindan: shindan
    },
    data() {
        return {
            activeTab: 0,
            tabs: [
                {name: 'account', label: 'アカウント'},
                {name: 'users', label: 'ユーザー', acl: 'settings.user'},
                {name: 'sets', label: 'セット'},
                {name: 'shindan', label: '健康診断設定'},
                {name: 'customacts', label: 'カスタム行為'},
                {name: 'orcasettings', label: 'オルカ設定'},
                {name: 'other', label: 'その他'}
            ]
        }
    }
    
}
</script>