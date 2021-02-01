<template>
    <div>
        <div id="customToolbar" :style="headerStyle">
            <button class="ql-italic"></button>
            <button class="ql-bold"></button>
            <button class="ql-underline"></button>
            <select style="margin-top: -3px" class="ql-color"></select>
            <button class="ql-image"></button>
            <button @click="schemaOpen = true" style="width: 82px" slot="reference" class="ql-customBtn"><i class="fas fa-pencil-alt"> シェーマ</i></button>
        </div>
        <vue-editor
            :disabled="loading"
            style="max-height: 770px; overflow: auto"
            ref="editor"
            useCustomImageHandler
            @image-added="addImage"
            :customModules="editorModules"
            :editorOptions="editorOptions"
            v-model="text">
        </vue-editor>

        <vs-dialog
            blur
            v-model="schemaOpen"
            width="1100px">
            <template #header>
                <h3 class="dialog-title">シェーマ編集</h3>
            </template>
            <div style="display: flex">
                <schemaSelect @select="schemaTemplateSelect" style="overflow: auto; height: 530px; padding: 10px; margin: -10px 0px -10px -10px"></schemaSelect>
                <painter ref="schemaPainter" v-if="schemaOpen" :parentWidth="670" :parentHeight="500" style="margin-left: 10px"></painter>
            </div>
            <div class="cc-dialog-footer">
                <vs-button @click="schemaOpen = false" transparent dark>キャンセル</vs-button>
                <vs-button @click="schemaAdd">追加</vs-button>
            </div>
        </vs-dialog>

    </div>
</template>

<script>

import { VueEditor } from 'vue2-editor'
import ImageResize from 'quill-image-resize'
import painter from '../shared/painter'
import schemaSelect from '../shared/schema_select'
import { log } from 'util'

export default {
    components: {
        VueEditor,
        painter,
        schemaSelect
    },
    props: {
        headerStyle: {
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
            loadingConst: null,
            text: "",
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
             if (this.loading) {
                 this.loadingConst = this.$vs.loading({
                     target: this.$refs.editor,
                     color: 'dark'
                 })
             } else {
                 if (this.loadingConst) {
                     this.loadingConst.close()
                 }
             }
         }
    },
    methods: {
        addImage(file, Editor, cursorLocation, resetUploader) {
            this.loadingConst = this.$vs.loading({
                target: this.$refs.editor,
                color: 'dark'
            })
            let sendData  = {
                fileList: [file],
                hasFiles: true,
                fileMeta: {
                    fileInfo: ['soapImage'],
                    info: this.$store.getters.activePatient,
                    type: 10
                }
            }

            this.$post('files', sendData)
            .then(result => {
                let url = this.$globals.filesUrl + result.data
                console.log(url);
                Editor.insertEmbed(cursorLocation, 'image', url)
                this.loadingConst.close()
            })
            .catch(result => {
                this.$apiError(result)
            })

        },
        schemaTemplateSelect(img) {
            this.$refs.schemaPainter.addImage(img);
        },
        schemaAdd() {
            this.loadingConst = this.$vs.loading({
                target: this.$refs.editor,
                color: 'dark'
            })
            let cursorLocation = this.$refs.editor.quill.getSelection()
            let img = this.$refs.schemaPainter.getPainting()
            let that = this
            img.toBlob(function(blob) {
                let sendData =  {
                    fileList: [new File([blob], "fileName.jpg", { type: "image/png" })],
                    hasFiles: true,
                    fileMeta: {
                        fileInfo: ['soapSchema'],
                        info: that.$store.getters.activePatient,
                        type: 10
                    }
                }
                that.$post('files', sendData)
                .then(result => {
                    let url = that.$globals.filesUrl + result.data
                    that.$refs.editor.quill.insertEmbed(cursorLocation, 'image', url)
                    that.schemaOpen = false
                    that.loadingConst.close()
                })
                .catch(result => {
                    this.$apiError(result)
                })
            })

        },
        provideData() {
            return this.text
        },
        setContent(cont) {
            this.text = cont
        }

    }



}
</script>

<style>

</style>