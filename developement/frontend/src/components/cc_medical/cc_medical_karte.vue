<template>
    <div class="cc-medical-karte-main">
        <div class="cc-medical-karte-soap">
            <div class="cc-headers"><b>{{ $lang.soapObservation }}</b></div>
            <cui-editor
                style="height: calc(60% - 40px)"
                :customMenuItems="customMenuItems"
                :customExtensions="customTextExtensions"
                :content="soap"
                ref="textEditor"
                @update="updateState"
            />
            <div class="h2-header"> <b>{{ $lang.image }}</b> </div>
            <div class="cc-image-cont" style="height: calc(40% - 40px)">
                <cui-card v-for="(img, index) in images" :key="index" no-padding @click="showImage(img)" class="cc-image-card">
                    <div class="cc-image-card-schema-cont">
                        <img class="cc-image-card-img" :src="'/files/' + img.id +'.' + img.extension" :alt=" $lang.image + index ">
                        <div class="cc-image-card-text">
                            <span>{{ $lang.image + index }} </span>
                            <i v-if="img.meta.source === 'schema'" class="fas fa-edit hover-icon" style="margin-left: 10px" @click.stop="editSchema(img)"></i>     
                        </div>
                    </div>
                </cui-card>
            </div>
            <input style="display: none" type="file" ref="file" v-on:change="addImage()" accept="image/png, image/gif, image/jpeg"/>
        </div>
        <div>
            <div class="cc-headers"><b> {{ $lang.procedures }} </b></div>
            <proceduresList style="height: calc(100% - 40px)" :encounter="encounter" :procedures="procedures" @remove="removeProcedure" />
        </div>
        <cui-modal :visible="modal.schema" closable  @close="modal.schema = false">
            <cui-card style="width: 1160px; height: 700px" noPadding>
                <template #header> <h2>{{ $lang.schema }}</h2> </template>
                <schema-editor @addSchema="addSchema" @cancel="modal.schema = false"></schema-editor>
            </cui-card>
        </cui-modal>
        <cui-modal :visible="modal.schemaEdit" closable  @close="modal.schemaEdit = false">
            <cui-card style="width: 600px; height: 700px" noPadding>
                <template #header> <h2>{{ $lang.schema }}</h2> </template>
                <schema-editor @cancel="modal.schemaEdit = false" editOnly :schema="modal.schemaEdit" ref="schemaEdit"></schema-editor>
            </cui-card>
        </cui-modal>

    </div>
</template>

<script>

import imageTag  from "../shared/cc_shared_tiptap_extensions/cc_tiptap_imageTag/cc_tiptap_imageTag";
import schemaEditor from "../shared/cc_shared_schema_editor.vue"
import proceduresList from "../shared/cc_shared_procedures_list/cc_shared_procedures_list.vue"

export default {
    components: {
        schemaEditor,
        proceduresList
    },
    emits: [
        'update'
    ],
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
            soap: null,
            editorContent: null,
            modal: {
                schema: false,
                schemaEdit: false
            },
            timer: null
        }
    },
    watch: {
        procedures: {
            handler() {
                this.updateState()
            },
            deep: true
        }
    },
    mounted() {
        if (this.encounter?.karte?.soap?.html) {
            this.$refs.textEditor.setContent(this.encounter.karte.soap.html);
            this.soap = this.encounter.karte.soap;
        }
        if (this.encounter?.karte?.images) this.images = this.encounter.karte.images;
        if (this.encounter?.karte?.procedures) this.procedures = this.encounter.karte.procedures;
    },
    methods: {
        showImage(img) {
            window.open(img, '_blank', "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10")
        },
        addSchema(schema) {
            schema.toBlob(function(blob) {
                let img = new File([blob], "fileName.jpg", { type: "image/png" });
                this.uploadImage('schema', img)
            }.bind(this))
        },
        editSchema(img) {
            console.log(img);
            this.modal.schemaEdit = true;
            setTimeout(function() {
                this.$refs.schemaEdit.addImage("/files/" + img.id + '.' + img.extension);
            }.bind(this), 1000)
        },
        addImage() {
            let img = this.$refs.file.files[0];
            this.uploadImage('soapImage', img);
        },
        updateState(text) {
            if(this.timer) clearTimeout(this.timer);
            this.timer = setTimeout( function() {
                if(text) this.soap = text;
                this.$emit('update', {
                    soap: this.soap,
                    procedures: this.procedures,
                    images: this.images
                })
            }.bind(this), 1000)
        },
        async uploadImage(target, img) {
            let accept = ['.png','.jpeg','.jpg'];
            let file = img;
            let ext = file.name.split('.');
            let last = ext.length - 1;
            ext = '.' + ext[last];
            if (accept.includes(ext)) {
                let sendData  = {
                    file: file,
                    meta: {
                        source: target,
                        patient: this.encounter.patient.id,
                        encounter: this.encounter.id
                    }
                }
                let url = await this.$dataService().post.uploads.single(sendData);
                url = url.replace('/files/','');
                url = url.split('.')[0];
                this.images.push(url);
                const index = this.images.length - 1;
                this.$refs.textEditor.editor.commands.insertContent(
                    "<imageTag index='" + index + "' url='" + url + "'></imageTag>"
                )
            }
        },
        addProcedure(item) {
            this.procedures.push(item);
        },
        removeProcedure(item) {
            this.procedures.splice(item, 1)
        }
    }
}
</script>

<style scoped>
    .cc-medical-karte-main {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
        height: 100%
    }
    .cc-medical-karte-soap {
        border-right: solid 1px var(--cui-gray-5);
        overflow: hidden;
    }
    .cc-image-card-text {
        display: flex;
        align-items: center;
    }
    .hover-icon:hover {
        color: var(--cui-primary)
    }
</style>
<style>
 .cc-medical-karte-image-card .cui-card {
    cursor: pointer;
 }
    
</style>