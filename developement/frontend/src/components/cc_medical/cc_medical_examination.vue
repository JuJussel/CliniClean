<template>
    <div class="control-floater">
        <div>
            <cui-button plain :label="$lang.view" icon="fas fa-columns"></cui-button>
        </div>
        <div style="display: flex">
            <cui-button :label="$lang.reservation" icon="fas fa-calendar-plus"></cui-button>
            <cui-button warn :label="$lang.pause" icon="fas fa-pause"></cui-button>
            <cui-button primary :label="$lang.finish" icon="fas fa-check-double" @click="confirmExaminationClose = true"></cui-button>
        </div>
    </div>
    <div class="cc-medical-examination-main">
        <cui-card></cui-card>
        <cui-card no-padding>
            <template #header>
                <div style="display: flex; justify-content: space-between; width: calc(100% - 20px)">
                    <h2>{{ $lang.karte }}</h2>
                    <div class="cc-medical-exam-loader-cont" v-if="saving">
                        <div> {{ $lang.saving }} </div>
                        <div class="loader" style="background-color: transparent"/>
                    </div>
                    <div v-else-if="saved">
                        <i class="fas fa-check"></i>
                        {{ $lang.save }}{{ $lang.done }}
                    </div>
                </div>
            </template>
            <karte :encounter="encounter" ref="karte" @update="updateState"/>
        </cui-card>
        <cui-card>
            <procedures-browser @select="addProcedure"></procedures-browser>
        </cui-card>
    </div>
    <div class="loader" v-if="loading"></div>

    <!-- Modals -->
    <cui-modal :visible="confirmExaminationClose" @close="confirmExaminationClose = false">
        <cui-card style="width: 250px; height: 180px">
            <template #header> {{ $lang.confirm }} </template>
            <h4> {{ $lang.confirmExaminationClose }} </h4>
            <div style="display: flex; justify-content: flex-end">
                <cui-button plain :label="$lang.cancel" @click="confirmExaminationClose = false"/>
                <cui-button primary :label="$lang.finish" @click="closeExamination"/>
            </div>
        </cui-card>
    </cui-modal>
    <cui-modal :visible="postExaminationClose" @close="postExaminationClose = false">
        <cui-card style="width: 250px; height: 180px">
            <template #header> {{ $lang.confirm }} </template>
            <h4> {{ $lang.postExaminationClose }} </h4>
            <div style="display: flex; justify-content: flex-end">
                <cui-button plain :label="$lang.cancel" @click="postExaminationClose = false"/>
                <cui-button primary :label="$lang.finish" @click="closeExamination"/>
            </div>
        </cui-card>
    </cui-modal>


</template>

<script>

import karte from "./cc_medical_karte.vue"
import proceduresBrowser from "../shared/cc_shared_procedures_browser.vue"

export default {
    components: {
        karte,
        proceduresBrowser
    },
    emits: [
        'cancel'
    ],
    props: {
        encounter: {
            default: null
        }
    },
    data() {
        return {
            saving: false,
            saved: false,
            encounterState: null,
            loading: false,
            confirmExaminationClose: false,
            postExaminationClose: false
        }
    },
    mounted() {
        this.encounterState = JSON.parse(JSON.stringify(this.encounter));
    },
    methods: {
        addProcedure(item) {
            item = JSON.parse(JSON.stringify(item.row));
            this.$refs.karte.addProcedure(item);
        },
        async updateState(state) {
            this.saved = false;
            this.saving = true;
            this.encounterState.karte = state;
            await this.$dataService().put.encounter(this.encounterState);
            this.saving = false;
            this.saved = true;
        },
        async closeExamination() {
            this.loading = true;
            this.confirmExaminationClose = false;
            let encounter = this.encounterState;
            encounter.status = 10;
            encounter.pushNotification = true;
            await this.$dataService().put.encounter(encounter);
            this.$cui.notification({
                text: this.$lang.examinationClosed,
                duration: 3000,
                color: 'primary'
            })
            this.postExaminationClose = true;
        }
    }
}
</script>

<style scoped>
    .cc-medical-examination-main {
        height: 100%;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 30% auto 400px;
    }
    .control-floater {
        position: absolute;
        right: 0;
        top: 0;
        width: 430px;
        height: 45px;
        margin: 5px 10px;
        border-radius: 10px;
        padding-top: 3px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 30%);
        display: flex;
        justify-content: space-between;
    }
    .cc-medical-exam-loader-cont {
        position: relative;
        display: flex;
        width: 200px;
        justify-content: flex-end;
        align-items: center;
        margin-right: -20px;
        opacity: 0.7
    }
    .cc-medical-exam-loader-cont .loader {
        position: relative;
        width: 50px;
        align-items: center;
        justify-content: center;
        display: flex;
    }
</style>