<template>
    <div style="height: 100%">
        <div class="cc_shared_schema_editor_cont">
            <div style="border-right: solid 1px var(--cui-gray-5)">
                <div class="cc-medical-karte-headers">
                    {{ $lang.schema}}
                    {{ $lang.select}}
                </div>
                <div class="cc-medical-karte-image-cont">
                    <cui-card v-for="(img, index) in schemas" :key="index" no-padding @click="addImage(img)" class="cc-medical-karte-image-card">
                        <img class="cc-medical-karte-image-card-img" :src="img" :alt="img.name">
                        <div class="cc-medical-karte-image-card-text"> {{ img.name }} </div>
                    </cui-card>
                </div>
            </div>
            <div>
                <div class="cc-medical-karte-headers">
                    {{ $lang.painter}}
                </div>
                <painter :height="500" :width="500"></painter>
            </div>
            <div style="border-top: solid 1px var(--cui-gray-5);">a</div>
            <div style="border-top: solid 1px var(--cui-gray-5);">b</div>
        </div>
    </div>
</template>

<script>

    import painter from './cc_shared_painter.vue'

export default {

    components: {
        painter
    },
    data() {
        return {
            schemas: [],
            loading: {
                schemas: false
            }
        }
    },
    created() {
        this.getSchemas();
    },
    methods: {
        addImage() {

        },
        async getSchemas() {
            this.loading.schemas = true;
            this.schemas = await this.$dataService().get.lists.schemas();
            this.loading.schemas = false;
        }
    }
    
}
</script>

<style scoped>

    .cc_shared_schema_editor_cont {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: auto 60px;
        height: 100%
    }
    .cc-medical-karte-image-cont {
        height: calc(40% - 40px);
        display: flex;
        flex-wrap: wrap;
        overflow: auto
    }
    .cc-medical-karte-image-card {
        width: 170px;
        height: 132px;
        overflow: hidden
    }
    .cc-medical-karte-image-card-img {
        width: 150px
    }
    .cc-medical-karte-image-card-text {
        color: var(--cui-dark);
        padding: 3px 10px
    }

</style>