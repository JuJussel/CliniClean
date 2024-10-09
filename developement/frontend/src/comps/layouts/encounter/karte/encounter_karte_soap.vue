<template>
    <div class="border rounded-md h-full">
        <Editor :content="encounterStore.encounterData.karte.soap" :customMenuItems="customMenuItems"
            :customExtensions="customTextExtensions" @update="updateStore" ref="textEditor" />
    </div>
    <input style="display: none" type="file" ref="file" v-on:change="addImage()"
        accept="image/png, image/gif, image/jpeg" />

</template>

<script setup>

import Editor from '@/comps/shared/editor'
import imageTag from '@/comps/shared/editor/image_tag';
import useApi from "@/composables/apiComposable.js"


const encounterStore = useEncounterStore()
const settingStore = useSettingStore()


const file = ref(null)
const textEditor = ref(null)

const { t } = useI18n();
const modals = reactive({
    schema: {
        open: false
    }
})

const customMenuItems = [
    {
        icon: "fas fa-image",
        title: t('image'),
        action: () => file.value.click(),
    },
    {
        icon: "fas fa-pencil-alt",
        title: "Redo",
        action: () => (modals.schema.open = true),
    },
]
const customTextExtensions = [imageTag]

const addImage = () => {
    let img = file.value.files[0];

    uploadImage("soapImage", img);


}

const updateStore = (text) => {
    encounterStore.encounterData.karte.soap = text.html
}

const uploadImage = async (target, img) => {
    let accept = [".PNG", ".png", ".JPEG", ".jpeg", "JPG", ".jpg"];
    let file = img;
    let ext = file.name.split(".");
    let last = ext.length - 1;
    ext = "." + ext[last];
    if (accept.includes(ext)) {
        let sendData = {
            file: file,
            meta: {
                patientId: Number(encounterStore.patientData.id),
                source: target,
                encounter: encounterStore.encounterData.id,
            },
        };
        let imgData = await useApi.post('uploads/single', sendData);
        encounterStore.encounterData.karte.images.push(imgData);
        const index = encounterStore.encounterData.karte.images.length - 1;
        let url =
            settingStore.settingData.filesUrl +
            imgData.id +
            "." +
            imgData.extension;
        textEditor.value.editor.commands.setImage({ src: url, index: index })

    }
}

</script>