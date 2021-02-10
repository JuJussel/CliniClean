<template>
    <div>
        <vs-button id="changeAvatar">Choose</vs-button>
        <avatar-cropper
            inline
            @uploaded="saveAvatar"
            trigger="#changeAvatar"
            upload-url="/files/upload"
            :cropper-options="{preview: '#avatarPreview', aspectRatio: 1}"
        />
        <div id="avatarPreview" style="height: 100px; width: 100px; overflow: hidden; border-radius: 50%"></div>

    </div>
</template>

<script>

import AvatarCropper from "vue-avatar-cropper"

export default {
    components: {
        AvatarCropper
    },
    data() {
        return {
        }
    },
    methods: {
        saveImage(img) {
            console.log(img);
        }
    }

}
</script>
