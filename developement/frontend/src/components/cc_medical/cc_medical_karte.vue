<template>
    <div class="cc-medical-karte-main">
        <div class="cc-medical-karte-soap">
            <div class="cc-medical-karte-headers"><b>{{ $lang.soapObservation }}</b></div>
            <cui-editor
                style="height: calc(60% - 40px)"
                :customMenuItems="customMenuItems"
                :customExtensions="customTextExtensions"
                ref="textEditor"
            />
            <div class="h2-header"> <b>{{ $lang.image }}</b> </div>
            <div class="cc-medical-karte-image-cont">
                <cui-card v-for="(img, index) in images" :key="index" no-padding @click="showImage(img)" class="cc-medical-karte-image-card">
                    <img class="cc-medical-karte-image-card-img" :src="img" :alt=" $lang.image + index ">
                    <div class="cc-medical-karte-image-card-text"> {{ $lang.image + index }} </div>
                </cui-card>
            </div>
            <input style="display: none" type="file" ref="file" v-on:change="addImage()" accept="image/png, image/gif, image/jpeg"/>
        </div>
        <div>
            <div class="cc-medical-karte-headers"><b> {{ $lang.procedures }} </b></div>
            <cui-table style="height: calc(100% - 40px)"></cui-table>
        </div>
        <cui-modal :visible="modal.schema" closable  @close="modal.schema = false">
            <cui-card style="width: 1000px; height: 700px" noPadding>
                <template #header> <h2>{{ $lang.schema }}</h2> </template>
                <schema-editor></schema-editor>
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import imageTag  from "../shared/cc_shared_tiptap_extensions/cc_tiptap_imageTag/cc_tiptap_imageTag";
import schemaEditor from "../shared/cc_shared_schema_editor.vue"

export default {
    components: {
        schemaEditor
    },
    props: {
        encounter: {
            default: null
        }
    },
    data() {
        return {
            customMenuItems: [
                {
                    icon: 'fas fa-image',
                    title: this.$lang.image,
                    action: () => this.$refs.file.click()
                },
                {
                    icon: 'fas fa-pencil-alt',
                    title: 'Redo',
                    action: () => this.modal.schema = true
                }

            ],
            customTextExtensions: [
                imageTag
            ],
            images: [],
            procedures: [],
            modal: {
                schema: false
            }
        }
    },
    methods: {
        showImage(img) {
            window.open(img, '_blank', "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10")
        },
        async addImage() {
            let accept = ['.png','.jpeg','.jpg'];
            let file = this.$refs.file.files[0]
            let ext = file.name.split('.');
            let last = ext.length - 1;
            ext = '.' + ext[last];
            if (accept.includes(ext)) {
                let sendData  = {
                    file: file,
                    meta: {
                        source: 'soapImage',
                        patient: this.encounter.patient.id,
                        encounter: this.encounter.id
                    }
                }
                const url = await this.$dataService().post.uploads.single(sendData);
                this.images.push(url);
                const index = this.images.length - 1;
                this.$refs.textEditor.editor.commands.insertContent(
                    "<imageTag index='" + index + "' url='" + url + "'></imageTag>"
                )
            }
        }
    }
}
</script>

<style scoped>
    .cc-medical-karte-main {
        display: grid;
        grid-template-columns: 50% 50%;
        height: 100%
    }
    .cc-medical-karte-soap {
        border-right: solid 1px var(--cui-gray-5);
        overflow: hidden;
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
<style>
 .cc-medical-karte-image-card .cui-card {
    cursor: pointer;
 }
    
</style>