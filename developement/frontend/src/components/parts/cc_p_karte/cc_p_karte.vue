<template>
    <div
        class="cc-medical-karte-main"
        v-bind:class="{ 'fixed-proc': fixedProcBrowser }"
    >
        <cui-side-bar
            v-if="!fixedProcBrowser"
            noButton
            :sidebar="$lang.procedursOnly + $lang.register"
            ref="procedureSelector"
            icon="fa-solid fa-xmark"
            width="400px"
        >
            <proceduresBrowser
                style="width: calc(100% - 20px); height: calc(100% - 60px)"
                @select="addProcedure"
            />
        </cui-side-bar>
        <div
            style="
                padding: 5px;
                display: flex;
                align-items: center;
                grid-area: karte1;
            "
        >
            <div v-if="saving" class="cc-medical-exam-loader-cont">
                <div
                    class="loader"
                    style="background-color: transparent; scale: 0.6"
                />
                <div style="margin-left: -10px">{{ $lang.saving }}</div>
            </div>
            <div v-else-if="saved" class="cc-medical-exam-loader-cont">
                <i class="fas fa-check" style="margin-right: 3px"></i>
                <div>{{ $lang.save }}{{ $lang.done }}</div>
            </div>
        </div>
        <div style="grid-area: karte2">
            <div
                class="cc-medical-exam-controls"
                v-if="encounter?.status === 3"
            >
                <cui-button
                    plain
                    :label="$lang.view"
                    icon="fas fa-columns"
                    @click="fixedProcBrowser = !fixedProcBrowser"
                ></cui-button>
                <cui-button
                    :label="$lang.reservation"
                    icon="fas fa-calendar-plus"
                ></cui-button>
                <cui-button
                    warn
                    :label="$lang.pause"
                    icon="fas fa-pause"
                ></cui-button>
                <cui-button
                    primary
                    :label="$lang.finish"
                    icon="fas fa-check-double"
                    @click="modal.confirmEncounterClose = true"
                ></cui-button>
            </div>
            <div v-else-if="encounter?.status === 10">
                <cui-button
                    primary
                    :label="$lang.next"
                    icon="fas fa-check-double"
                ></cui-button>
            </div>
        </div>
        <div class="cc-medical-karte-soap" style="grid-area: karte3">
            <div class="cc-headers">
                <b>{{ $lang.soapObservation }}</b>
            </div>
            <cui-editor
                style="height: calc(60% - 40px)"
                :customMenuItems="customMenuItems"
                :customExtensions="customTextExtensions"
                :content="soap"
                ref="textEditor"
                @update="updateState"
            />
            <div class="h2-header">
                <b>{{ $lang.image }}</b>
            </div>
            <div class="cc-image-cont" style="height: calc(40% - 40px)">
                <cui-card
                    v-for="(img, index) in images"
                    :key="index"
                    no-padding
                    @click="showImage(img)"
                    class="cc-image-card"
                >
                    <div class="cc-image-card-schema-cont">
                        <img
                            class="cc-image-card-img"
                            :src="
                                $GLOBALS.filesUrl +
                                img.id +
                                '.' +
                                img.extension +
                                '?' +
                                random
                            "
                            :alt="$lang.image + index"
                        />
                        <div class="cc-image-card-text">
                            <span>{{ $lang.image + index }} </span>
                            <i
                                v-if="img.meta.source === 'schema'"
                                class="fas fa-edit hover-icon"
                                style="margin-left: 10px"
                                @click.stop="editSchema(img, index)"
                            ></i>
                        </div>
                    </div>
                </cui-card>
            </div>
            <input
                style="display: none"
                type="file"
                ref="file"
                v-on:change="addImage()"
                accept="image/png, image/gif, image/jpeg"
            />
        </div>
        <div style="grid-area: karte4">
            <div class="cc-headers proc-head">
                <b> {{ $lang.procedures }} </b>
                <cui-button
                    v-if="!fixedProcBrowser"
                    icon="fa-solid fa-plus"
                    label="行為登録"
                    plain
                    @click="$refs.procedureSelector.toggle()"
                ></cui-button>
            </div>
            <proceduresList
                style="height: calc(100% - 40px)"
                :encounter="encounter"
                :procedures="procedures"
                :random="random"
                @remove="removeProcedure"
            />
        </div>
        <proceduresBrowser
            v-if="fixedProcBrowser"
            class="fixed-proc-browser"
            @select="addProcedure"
        />
        <cui-modal
            :visible="modal.schema"
            closable
            @close="modal.schema = false"
        >
            <cui-card style="width: 1160px; height: 700px" noPadding>
                <template #header>
                    <h2>{{ $lang.schema }}</h2>
                </template>
                <schema-editor
                    @addSchema="addSchema"
                    @cancel="modal.schema = false"
                ></schema-editor>
            </cui-card>
        </cui-modal>
        <cui-modal
            :visible="modal.schemaEdit"
            closable
            @close="modal.schemaEdit = null"
        >
            <cui-card style="width: 600px; height: 700px" noPadding>
                <template #header>
                    <h2>{{ $lang.schema }}</h2>
                </template>
                <painter
                    :schema="modal.schemaEdit.file"
                    ref="schemaEditor"
                ></painter>
                <template #footer>
                    <cui-button
                        :label="$lang.cancel"
                        plain
                        @click="modal.schemaEdit = null"
                    ></cui-button>
                    <cui-button
                        :label="$lang.save"
                        primary
                        @click="updateSchema"
                    ></cui-button>
                </template>
            </cui-card>
        </cui-modal>
        <cui-modal
            :visible="modal.confirmEncounterClose"
            @close="modal.confirmEncounterClose = false"
            :closable="!loading"
        >
            <cui-card
                style="
                    width: 250px;
                    height: 150px;
                    border-radius: 20px;
                    padding: 0;
                "
                :loading="loading"
            >
                <template #header> {{ $lang.confirm }} </template>
                <div>{{ $lang.confirmEncounterClose }}</div>
                <div
                    style="
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 10px;
                    "
                >
                    <cui-button
                        plain
                        :label="$lang.cancel"
                        @click="modal.confirmEncounterClose = false"
                    />
                    <cui-button
                        primary
                        :label="$lang.finish"
                        @click="closeEncounter"
                    />
                </div>
            </cui-card>
        </cui-modal>
        <cui-modal
            :visible="submitErrors.length > 0"
            @close="submitErrors = []"
        >
            <cui-card style="width: 1000px; height: 400px" noPadding>
                <div
                    style="
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    "
                >
                    <cui-table
                        square
                        :data="submitErrors"
                        style="height: auto; max-height: 400px"
                    >
                        <template #header>
                            <div>
                                <h2>
                                    {{ $lang.procedureErrors }}
                                    {{ $lang.confirmInput }}
                                </h2>
                            </div>
                        </template>
                        <template v-slot:row="row">
                            <td>
                                {{ encounter.karte.procedures[row.index].name }}
                            </td>
                            <td>
                                <div v-for="(item, i) in row.errors" :key="i">
                                    {{
                                        $lang.validationMessages[
                                            item.context.label
                                        ]
                                    }}
                                    <span v-if="item.context.label">:</span>
                                    {{ item.message }}
                                </div>
                            </td>
                        </template>
                    </cui-table>
                    <div
                        style="
                            display: flex;
                            justify-content: flex-end;
                            padding: 10px;
                        "
                    >
                        <cui-button
                            plain
                            :label="$lang.cancel"
                            @click="submitErrors = []"
                        />
                        <cui-button
                            primary
                            :label="$lang.finish"
                            @click="closeExamination"
                        />
                    </div>
                </div>
            </cui-card>
        </cui-modal>
    </div>
</template>

<script>

import { useUserStore } from '@/stores/user'
import { useSettingStore } from '@/stores/setting'
import { mapStores } from 'pinia'

import imageTag from "./cc_tiptap_imageTag/cc_tiptap_imageTag";
import schemaEditor from "./cc_p_schema_editor.vue";
import proceduresList from "./cc_p_procedures_list";
import painter from "../cc_p_painter.vue";
import baseCostUtil from "../../../utils/encounterBaseCost";
import procedureCheck from "../../../utils/procedureCheck";
import proceduresBrowser from "./cc_p_procedures_browser";

export default {
    components: {
        schemaEditor,
        proceduresList,
        painter,
        proceduresBrowser,
    },
    emits: ["update"],
    data() {
        return {
            schemaEditHolder: null,
            saving: false,
            saved: false,
            customMenuItems: [
                {
                    icon: "fas fa-image",
                    title: this.$lang.image,
                    action: () => this.$refs.file.click(),
                },
                {
                    icon: "fas fa-pencil-alt",
                    title: "Redo",
                    action: () => (this.modal.schema = true),
                },
            ],
            customTextExtensions: [imageTag],
            images: [],
            procedures: [],
            soap: null,
            editorContent: null,
            modal: {
                schema: false,
                schemaEdit: null,
                confirmEncounterClose: false,
            },
            timer: null,
            random: 1,
            encounter: null,
            submitErrors: [],
            loading: false,
            fixedProcBrowser: true,
        };
    },
    watch: {
        procedures: {
            handler() {
                this.updateState();
            },
            deep: true,
        },
    },
    async mounted() {
        if (this.$store.getters.layoutData.medical.encounter?.id) {
            let encounterId =
                this.$store.getters.layoutData.medical.encounter?.id;
            this.encounter = await this.$dataService().get.encounters.findOne(
                encounterId
            );
        }

        if (this.encounter.baseCost.length < 1) {
            let baseCost = await baseCostUtil(
                this.encounter,
                this.$store.getters.staticLists.encounterBaseCost,
                this.settingStore.settingData.clinicBaseInfo.public
            );
            this.encounter.baseCost = baseCost;
        }

        this.encounter.doctor = this.userStore.userData.id;

        if (this.encounter?.karte?.soap?.html) {
            this.$refs.textEditor.setContent(this.encounter.karte.soap.html);
            this.soap = this.encounter.karte.soap;
        }
        if (this.encounter?.karte?.images)
            this.images = this.encounter.karte.images;
        if (this.encounter?.karte?.procedures)
            this.procedures = this.encounter.karte.procedures;
    },
    computed: {
        ...mapStores(useUserStore, useSettingStore)
    },
    methods: {
        async closeEncounter() {
            this.loading = true;
            this.modal.confirmEncounterClose = true;
            let errors = [];
            this.encounter.karte.procedures.forEach((proc, index) => {
                let error = procedureCheck(index, proc);
                if (error) errors.push(error);
            });
            if (errors.length > 0) {
                this.modal.confirmEncounterClose = false;
                this.loading = false;
                this.submitErrors = errors;
                return;
            }

            let encounter = this.encounter;
            let encStatus = encounter.status;
            encounter.status = 10;
            encounter.closeEncounter = true;
            try {
                await this.$dataService().put.encounters(encounter);
                this.$cui.notification({
                    text: this.$lang.examinationClosed,
                    duration: 3000,
                    color: "primary",
                });
                this.modal.confirmEncounterClose = false;
            } catch (error) {
                this.modal.confirmEncounterClose = false;
                encounter.status = encStatus;
                this.loading = false;
            }
        },
        showImage(img) {
            let url = this.$GLOBALS.filesUrl + img.id + "." + img.extension;
            window.open(
                url,
                "_blank",
                "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10"
            );
        },
        addSchema(schema) {
            schema.toBlob(
                function (blob) {
                    let img = new File([blob], "fileName.jpg", {
                        type: "image/png",
                    });
                    this.uploadImage("schema", img);
                }.bind(this)
            );
        },
        editSchema(img, index) {
            this.modal.schemaEdit = {
                file: this.$GLOBALS.filesUrl + img.id + "." + img.extension,
                meta: img,
                index: index,
            };
        },
        addImage() {
            let img = this.$refs.file.files[0];
            this.uploadImage("soapImage", img);
        },
        async updateState(text) {
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(
                async function () {
                    if (text) this.soap = text;
                    this.saved = false;
                    this.saving = true;
                    let encounter = JSON.parse(JSON.stringify(this.encounter));
                    encounter.karte = {
                        soap: this.soap,
                        procedures: this.procedures,
                        images: this.images,
                    };

                    await this.$dataService().put.encounters(encounter);

                    this.$store.commit("SET_LAYOUT_DATA", [
                        "medical",
                        { encounter: encounter },
                    ]);

                    this.saving = false;
                    this.saved = true;
                }.bind(this),
                1000
            );
        },
        updateSchema() {
            let img = this.$refs.schemaEditor.getPainting();
            img.toBlob(
                async function (blob) {
                    let file = new File([blob], "fileName.jpg", {
                        type: "image/png",
                    });
                    let sendData = {
                        file: file,
                        meta: this.modal.schemaEdit.meta,
                    };
                    await this.$dataService().put.uploads.single(sendData);
                    this.random++;
                    this.modal.schemaEdit = null;
                }.bind(this)
            );
        },
        async uploadImage(target, img) {
            let accept = [".PNG", ".png", ".JPEG", ".jpeg", "JPG", ".jpg"];
            let file = img;
            let ext = file.name.split(".");
            let last = ext.length - 1;
            ext = "." + ext[last];
            if (accept.includes(ext)) {
                let sendData = {
                    file: file,
                    meta: {
                        source: target,
                        patient: this.encounter.patient.id,
                        encounter: this.encounter.id,
                    },
                };
                let imgData = await this.$dataService().post.uploads.single(
                    sendData
                );
                this.images.push(imgData);
                const index = this.images.length - 1;
                let url =
                    this.$GLOBALS.filesUrl +
                    imgData.id +
                    "." +
                    imgData.extension;
                this.$refs.textEditor.editor.commands.insertContent(
                    "<imageTag index='" +
                        index +
                        "' url='" +
                        url +
                        "'></imageTag>"
                );
            }
        },
        addProcedure(item) {
            let proc = JSON.parse(JSON.stringify(item));
            this.procedures.push(proc.row);
        },
        removeProcedure(item) {
            this.procedures.splice(item, 1);
        },
    },
};
</script>

<style scoped>
.cc-medical-karte-main {
    display: grid;
    grid-template-columns: 50% auto;
    grid-template-rows: 50px calc(100% - 50px);
    grid-template-areas:
        "karte1 karte2"
        "karte3 karte4";
    height: 100%;
}
.cc-medical-karte-main.fixed-proc {
    grid-template-columns: 35% calc(65% - 400px) 400px;
    grid-template-areas:
        "karte1 karte2 karte2"
        "karte3 karte4 proc";
}
.cc-medical-exam-loader-cont {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    opacity: 0.7;
}
.cc-medical-exam-loader-cont .loader {
    position: relative;
    width: 50px;
    align-items: center;
    justify-content: center;
    display: flex;
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
    color: var(--cui-primary);
}
.cc-medical-exam-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
}
.proc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
<style>
.cc-medical-karte-image-card .cui-card {
    cursor: pointer;
}
.fixed-proc-browser {
    grid-area: proc;
    border-left: solid 1px var(--cui-gray-5);
    border-top: solid 1px var(--cui-gray-5);
    height: calc(100% - 1px);
}
</style>