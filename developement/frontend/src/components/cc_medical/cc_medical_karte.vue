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
            <div></div>
            <input style="display: none" type="file" ref="file" v-on:change="addImage()" accept="image/png, image/gif, image/jpeg"/>
        </div>
        <div>
            <div class="cc-medical-karte-headers"><b> {{ $lang.procedures }} </b></div>
            <cui-table style="height: calc(100% - 40px)"></cui-table>
        </div>
    </div>
</template>

<script>

import imageTag  from "../shared/cc_shared_tiptap_extensions/cc_tiptap_imageTag/cc_tiptap_imageTag"

export default {
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
                    title: 'Redo',
                    action: () => this.$refs.file.click()
                }
            ],
            customTextExtensions: [
                imageTag
            ],
            images: [],
            procedures: [],
            
        }
    },
    methods: {
        test() {
            this.$refs.textEditor.editor.commands.insertContent("<imageTag index='1' url='https://localhost:3003/files/user16.png'></imageTag>")

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
    .cc-medical-karte-soap-image {
        color: green
    }
</style>