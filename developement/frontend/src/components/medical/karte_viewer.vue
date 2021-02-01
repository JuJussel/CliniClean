<template>
    <div style="height: 100%">
        <vs-row style="height: 100%">
            <vs-col w="6" style="height: 100%">
                <div class="content-card">
                    <div class="cc-card-header" style="height: 30px">
                        <h2 style="display: flex; align-items: center">
                            <span>カルテA</span>
                            <vs-button @click="showSelect(0)" dark>カルテ選択</vs-button>
                        </h2>
                    </div>
                    <karteView :meta="meta" ref="karteA" style="calc(100% - 30px)"></karteView>
                </div>
            </vs-col>
            <vs-col w="6" style="height: 100%">
                <div class="content-card">
                    <div class="cc-card-header" style="height: 30px">
                        <h2 style="display: flex; align-items: center">
                            <span>カルテB</span>
                            <vs-button @click="showSelect(1)" dark>カルテ選択</vs-button>
                        </h2>
                    </div>
                    <karteView ref="karteB" style="calc(100% - 30px)"></karteView>
                </div>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>

import karteView from "../shared/karte_view.vue"

export default {
    components: {
        'karteView': karteView
    },
    props: {
        meta: {default: null}
    },
    methods: {
        showSelect(t) {
            if (t < 1) {
                this.$refs.karteA.showSelect()                
            } else {
                this.$refs.karteB.showSelect()     
            }
        }
    },
    data() {
        return {
        }
    },
}
</script>