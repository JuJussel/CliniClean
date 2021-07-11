<template>
    <div>
        <div id="customToolbar" :style="headerStyle">
            <button class="ql-italic"></button>
            <button class="ql-bold"></button>
            <button class="ql-underline"></button>
            <select style="margin-top: -3px" class="ql-color"></select>
            <button class="ql-image"></button>
            <button @click="schemaOpen = true" style="width: 82px" class="ql-customBtn"><i class="fas fa-pencil-alt"> シェーマ</i></button>
        </div>
        <vue-editor
            :disabled="loading || loadingLocal"
            style="overflow: auto; height: calc(100% - 40px)"
            ref="editor"
            useCustomImageHandler
            @image-added="addImage"
            :customModules="editorModules"
            :editorOptions="editorOptions"
            v-model="text">
        </vue-editor>
    </div>
</template>

<script>

import { VueEditor } from 'vue3-editor'
import ImageResize from 'quill-image-resize'
// import painter from '../shared/CC_comp_painter'
// import schemaSelect from '../shared/CC_comp_schema_select'

export default {
    components: {
        VueEditor,
        // painter,
        // schemaSelect
    },
    props: {
        headerStyle: {
            default: ''
        },
        bodyStyle: {
            default: ''
        },
        meta: {
            default: {}
        },
        loading: {
            default: false
        }
    },
    data() {
        return {
            loadingLocal: false,
            text: '',
            schemaOpen: false,
            editorModules: [
                {alias: 'imageResize', module: ImageResize}
            ],
            editorOptions: {
                modules: {
                    imageResize: {},
                    toolbar: {
                        container: "#customToolbar",
                        handlers: {
                            customBtn: () => {
                            }
                        }
                    }
                }
            }
        }
    },
    watch: {
        soapContent() {
            this.text = this.soapContent
        },
         loading() {
         }
    },
    methods: {
        async addImage(file, Editor, cursorLocation) {
            this.loadingLocal = true;
            let sendData  = {
                fileList: [file],
                hasFiles: true,
                meta: {
                    fileInfo: ['soapImage'],
                    info: this.$store.getters.activePatient,
                    type: 10
                }
            }


            const url = await this.$dataService().post.uploads(sendData);
            Editor.insertEmbed(cursorLocation, 'image', url);
            this.loadingLocal = false;


        },
        // schemaTemplateSelect(img) {
        //     // this.$refs.schemaPainter.addImage(img);
        // },
        // schemaAdd() {
        // },
        // provideData() {
        //     return this.text
        // },
        // setContent(cont) {
        //     this.text = cont
        // }

    }



}
</script>

<style>
    .ql-container {
        border-left: none!important;
        border-right: none!important;
        border-bottom: none!important;
        border-top: solid 1px var(--cui-gray-5);
    }
</style>
