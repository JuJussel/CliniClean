<template>
    <div class="cc-medical-karte-main">
        <div class="cc-medical-karte-soap">
            <div class="cc-medical-karte-headers"><b>{{ $lang.soapObservation }}</b></div>
            <cui-editor
                style="height: calc(100% - 40px)"
                :customMenuItems="customMenuItems"
                :customExtensions="customTextExtensions"
                ref="textEditor"
            />
            <input style="display: none" type="file" ref="file" v-on:change="addImage()" accept="image/png, image/gif, image/jpeg"/>
        </div>
        <div>
            <div class="cc-medical-karte-headers">{{ $lang.procedures }}</div>
            <cui-table style="height: calc(100% - 40px)"></cui-table>
        </div>
    </div>
</template>

<script>

import { Node } from '@tiptap/core'

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
                    action: () => this.test()
                }
            ],
            customTextExtensions: [
                Node.create({
                    name: 'imageTag',
                    group: 'inline',
                    inline: true,
                    atom: true,
                    content: 'text*',
                    addAttributes() {
                        return {
                            color: {
                                default: 'red',
                                // Take the attribute values
                                renderHTML: () => {
                                    // … and return an object with HTML attributes.
                                    return {
                                        style: 'color: red',
                                    }
                                },
                            },
                        }
                    },
                })
            ],
            images: [],
            procedures: [],
            
        }
    },
    methods: {
        test() {
                this.$refs.textEditor.editor.commands.insertContent({
                    "type": 'imageTag',
                    content: ['tre']
                })

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
                this.$refs.textEditor.editor.commands.insertContent({
                    type: 'imageTag',
                    content: 'gggg'
                })
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