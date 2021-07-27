<template>
    <div style="height: 100%">
        <div class="cc_shared_schema_editor_cont">
            <div style="border-right: solid 1px var(--cui-gray-5); overflow: hidden">
                <div class="cc-headers">
                    {{ $lang.schema}}
                    {{ $lang.select}}
                </div>
                <div class="cc-image-cont" style="height: calc(100% - 37px)">
                    <cui-card v-for="(img, index) in schemas" :key="index" no-padding @click="addImage(img)" class="cc-image-card">
                        <div class="cc-image-card-schema-cont">
                            <img class="cc-image-card-img" :src="img.url" :alt="img.name">
                            <div class="cc-image-card-text"> {{ img.name }} </div>
                        </div>
                    </cui-card>
                </div>
            </div>
            <div>
                <div class="cc-headers">
                    {{ $lang.painter}}
                </div>
                <painter :height="500" :width="580"></painter>
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
</style>