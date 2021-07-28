<template>
    <div class="control-floater">
        <div>
            <cui-button plain :label="$lang.view" icon="fas fa-columns"></cui-button>
        </div>
        <div style="display: flex">
            <cui-button :label="$lang.reservation" icon="fas fa-calendar-plus"></cui-button>
            <cui-button warn :label="$lang.pause" icon="fas fa-pause"></cui-button>
            <cui-button primary :label="$lang.finish" icon="fas fa-check-double"></cui-button>
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
                </div>
            </template>
            <karte :encounter="encounter"/>
        </cui-card>
        <cui-card>
            Procedures
        </cui-card>
    </div>
</template>

<script>

import karte from "./cc_medical_karte.vue"

export default {
    components: {
        karte
    },
    props: {
        encounter: {
            default: null
        }
    },
    data() {
        return {
            saving: false
        }
    }
}
</script>

<style scoped>
    .cc-medical-examination-main {
        height: 100%;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 38% auto 450px;
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