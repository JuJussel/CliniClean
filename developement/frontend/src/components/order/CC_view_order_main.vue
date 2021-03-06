<template>
    <div style="height: 100%">
        <div style="height: 30px; display: flex; justify: flex-start; padding-left: 10px">
        <vs-button-group>
            <vs-button
            border
            dark
            :active="activeTab == index"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="activeTab = index"
            >
            <span> {{ tab.label }} </span>
            <span class="cc-hover-icon" style="margin-left: 5px" v-if="tab.closable"><i class="fas fa-times" @click="closeTab(index)"></i></span>
            </vs-button>
        </vs-button-group>
        </div>
        <div style="height: calc(100% - 50px)">
        <transition-group name="juzoom" >
            <child-component
                v-for="(tab, index) in tabs"
                :key="index"
                :is="tab.type"
                :ref="tab.type + index"
                :meta="tab.meta"
                class="hidden-tab"
                v-bind:class="{'active-tab': index === activeTab}"
            />
        </transition-group>
        </div>

    </div>
</template>

<script>

import kensa from './CC_view_kensa_view'
import order from './CC_view_order_view'

export default {
    components: {
        'kensa': kensa,
        'order': order
    },
    data() {
        return {
            tabs: [
                {label: 'オーダー', meta: null, type: 'order'},
                {label: '検査結果入力', meta: null, type: 'kensa'}
            ],
            activeTab: 0
        }
    }
}
</script>

<style>

</style>