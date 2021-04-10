<template>
    <div style="display: flex; flex-direction: column; height: 100%">
        <div class="cc-card-header" style="display: flex; justify-content: space-between; border-radius: 15px; margin:10px">
            <vs-button-group>
                <vs-button
                    border
                    dark
                    :active="activeTab == tab.label"
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click="activeTab = tab.label"
                    >
                    <span> 
                        <i :class="tab.icon"></i>
                        {{ tab.name }} 
                    </span>
                </vs-button>
            </vs-button-group>
            <vs-button
                @click="$emit('changeView')"
                icon
                dark
                size="small"
                animation-type="scale"
            >
                <i class="fas fa-expand-arrows-alt"></i>
                <template #animate>拡大</template>
            </vs-button>
        </div>
        <div style="height: calc(100% - 84px)">
            <child-component
                @update="updateData"
                :is="activeTab"
                ref="childComp"
                :data="patientData"
                v-if="patientData"
            />
        </div>
    </div>
</template>

<script>

import dashboard from './CC_view_patient_history_dashboard'
import vitals from './CC_view_patient_history_vitals'
import meds from './CC_view_patient_history_meds'
import koui from './CC_view_patient_history_procedure'
import byoumei from './CC_view_patient_history_disease'
import karte from './CC_view_patient_history_record_history'
import kensa from './CC_view_patient_history_kensa'

export default {
    props: {
        patientID: {default: null},
        height: {default: 0}
    },
    components: {
        'dashboard': dashboard,
        'vitals': vitals,
        'meds': meds,
        'koui': koui,
        'byoumei': byoumei,
        'karte': karte,
        'kensa': kensa
    },
    data() {
        return {
            activeTab: "dashboard",
            loading: false,
            loadingElm: null,
            patientData: null,
            tabs: [
                {name: "基本", label: "dashboard", icon: "fas fa-info"},
                {name: "バイタル", label: "vitals", icon: "fas fa-chart-line"},
                {name: "検査", label: "kensa", icon: "fas fa-microscope"},
                {name: "処方歴", label: "meds", icon: "fas fa-pills"},
                {name: "行為歴", label: "koui", icon: "fas fa-list"},
                {name: "病歴", label: "byoumei", icon: "fas fa-disease"},
                {name: "カルテ歴", style: "padding: 0", label: "karte", icon: "fas fa-file-alt"}
            ]
        }
    },
    watch: {
        loading() {
            if (this.loading) {
                this. loadingElm = this.$vs.loading({
                    target: this.$refs.childComp,
                    color: 'dark'
                })
            }else {
                this.loadingElm.close()
            }
        }
    },
    created() {
        this.updateData()
    },
    methods: {
        updateData() {

            this.loading = true

            this.$get('medicalinfos/' + this.patientID)
            .then(result => {
                this.patientData = result.data
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
            })

        }
    }

}
</script>