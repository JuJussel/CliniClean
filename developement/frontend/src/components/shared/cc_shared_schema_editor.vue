<template>
    <div style="height: 100%">
        <div class="cc_shared_schema_editor_cont">
            <div style="border-right: solid 1px var(--cui-gray-5); overflow: hidden" v-if="!editOnly">
                <div class="cc-headers">
                    {{ $lang.schema}}
                    {{ $lang.select}}
                </div>
                <div class="cc-image-cont" style="height: calc(100% - 37px)">
                    <cui-card v-for="(img, index) in schemas" :key="index" no-padding class="cc-image-card">
                        <div class="cc-image-card-schema-cont" @click="setSchemaImage(img)">
                            <img class="cc-image-card-img" :src="img.url" :alt="img.name">
                            <div class="cc-image-card-text"> {{ img.name }} </div>
                        </div>
                    </cui-card>
                </div>
            </div>
            <div v-bind:class="{spanTwoCols: editOnly}">
                <div class="cc-headers">
                    {{ $lang.painter}}
                </div>
                <painter :height="500" :width="580" ref="painter"></painter>
            </div>
            <div class="cc-shared-schema-editor-footer"></div>
            <div class="cc-shared-schema-editor-footer">
                <cui-button plain :label="$lang.cancel" @click="$emit('cancel')"></cui-button>
                <cui-button :label="$lang.add" @click="addSchema"></cui-button>
            </div>
        </div>
    </div>
</template>

<script>

    import painter from './cc_shared_painter.vue'

export default {
    props: {
        editOnly: {
            type: Boolean,
            default: false
        }
    },
    components: {
        painter
    },
    emits: [
        'cancel',
        'addSchema'
    ],
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
        setSchemaImage(img) {
            console.log(img);
            // this.$refs.painter.addImage(img.url);
            // let url = this.$GLOBALS.schemaUrl + img.url;
            this.$refs.painter.addImage(img.url);
        },
        async getSchemas() {
            this.loading.schemas = true;
            this.schemas = await this.$dataService().get.lists.schemas();
            this.loading.schemas = false;
        },
        addSchema() {
            let img = this.$refs.painter.getPainting();
            this.$emit('addSchema', img);
            this.$emit('cancel');
        },
        getSchema() {
            return(this.$refs.painter.getPainting());
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
    .cc-shared-schema-editor-footer {
        border-top: solid 1px var(--cui-gray-5);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
    }
    .spanTwoCols {
        grid-column-end: span 2;    
    }
</style>