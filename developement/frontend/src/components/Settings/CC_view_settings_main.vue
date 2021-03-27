<template>
    <div style="height: 100%">
        <div style="height: 30px; display: flex; justify: flex-start; padding-left: 10px">
            <vs-button-group>
                <vs-button
                    border
                    dark
                    :active="activeTab == index"
                    v-for="(tab, index) in allowedTabs"
                    :key="index"
                    @click="activeTab = index"
                >
                    <span> {{ tab.label }} </span>
                </vs-button>
            </vs-button-group>
        </div>
        <vs-row style="height: calc(100% - 30px)">
            <child-component
                :is="allowedTabs[activeTab].name"
                ref="childComp"
                style="width: 100%"
            />
        </vs-row>

    </div>
</template>

<script>

import account from './CC_view_settings_account'
import users from './CC_view_settings_users'
import sets from './CC_view_settings_sets'
import other from './CC_view_settings_other'
import shindan from './CC_view_settings_shindan'
import system from './CC_view_settings_system'

export default {
    components: {
        account: account,
        users: users,
        sets: sets,
        other: other,
        shindan: shindan,
        system: system
    },
    data() {
        return {
            activeTab: 0,
            tabs: [
                {name: 'account', label: 'アカウント', acl: ['open', 1]},
                {name: 'users', label: 'ユーザー', acl: [false, false]},
                {name: 'sets', label: 'セット', acl: ['settings.sets', 2]},
                {name: 'shindan', label: '健康診断設定', acl: [false, false]},
                {name: 'customacts', label: 'カスタム行為', acl: ['open', 1]},
                {name: 'system', label: 'システム', acl: [false, false]},
                {name: 'other', label: 'その他', acl: ['open', 1]}
            ]
        }
    },
    computed: {
        allowedTabs() {
            return this.tabs.filter(tab => this.$acl(tab.acl[0], tab.acl[1]))
        }
    }
    
}
</script>