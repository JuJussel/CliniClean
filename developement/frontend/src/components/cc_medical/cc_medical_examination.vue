<template>
    <div class="control-floater">
        <cui-button :label="$lang.save"></cui-button>
        <cui-button :label="$lang.save"></cui-button>
        <cui-button :label="$lang.save"></cui-button>
    </div>
    <div class="cc-medical-examination-main">
        <cui-card></cui-card>
        <cui-card no-padding>
            <template #header>
                <h2>{{ $lang.karte }}</h2>
            </template>
            <karte :encounter="encounter"/>
        </cui-card>
        <cui-card></cui-card>
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
    }
}
</script>

<style>
    .cc-medical-examination-main {
        height: 100%;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 40% calc(60% - 200px) 200px;
    }
    .control-floater {
        position: absolute;
        right: 0;
        top: 0;
        width: 400px;
        height: 45px;
        margin: 5px 10px;
        border-radius: 10px;
        padding-top: 3px;
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 30%);
        display: flex;
    }
</style>