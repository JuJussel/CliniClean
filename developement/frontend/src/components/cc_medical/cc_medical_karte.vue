<template>
    <div class="cc-medical-karte-main">
        <div class="cc-medical-karte-soap">
            <div class="cc-medical-karte-headers"><b>{{ $lang.soapObservation }}</b></div>
            <textEditor
                :meta="encounter"
                headerStyle="border: none"
                bodyStyle=""
                style="height: calc(100% - 40px);"
                ref="soapText"
            ></textEditor>
        </div>
        <div>
            <div class="cc-medical-karte-headers">{{ $lang.procedures }}</div>
            <cui-table style="height: calc(100% - 40px)"></cui-table>
        </div>
    </div>
</template>

<script>

import textEditor from "../shared/cc_shared_text_editor.vue"

export default {
    components: {
        textEditor
    },
    props: {
        encounter: {
            default: null
        }
    }
}
</script>

<style>
    .cc-medical-karte-main {
        display: grid;
        grid-template-columns: 50% 50%;
        height: 100%
    }
    .cc-medical-karte-soap {
        border-right: solid 1px var(--cui-gray-5);
        overflow: hidden;
    }
    .cc-medical-karte-headers {
        border-bottom: solid 1px var(--cui-gray-5);
        border-top: solid 1px var(--cui-gray-5);
        padding: 5px;
        background: var(--cui-gray-0);
        height: 25px;
    }
</style>