<template>
    <div style="height: calc(100% - 40px); padding: 20px">
        <vs-row>
            <vs-avatar size="180">
                <img v-if="hasAvatar" :src="avatarURL"  @error="(() => hasAvatar = null)">
                <span v-else> {{ $store.getters.userFullName.charAt(0) }} </span>
            </vs-avatar>
            <div style="margin-left: 20px">
                <h2> {{ $store.getters.userFullName }} </h2>
                <vs-button dark @click="avatarSelectOpen = true">
                    <i class="far fa-user-circle" style="margin-right: 10px"></i>
                    ユーザーアバター編集
                </vs-button>
                <vs-button dark @click="avatarSelectOpen = true">
                    <i class="fas fa-lock" style="margin-right: 10px"></i>
                    パスワード変更
                </vs-button>
            </div>
        </vs-row>
        <vs-dialog           
            blur
            v-model="avatarSelectOpen"
            width="700px">
            <template #header>
                <h3 class="dialog-title"> ユーザーアバター編集 </h3>
            </template>
            <div ref="avaDia">
                <imageCropper
                    ref="cropper"
                    @selected="selected = true"
                    previewRadius="35px"
                    :width="200"
                    :height="200"
                />
                <div style="display: flex; justify-content: flex-end; margin-top: 20px">
                    <vs-button transparent dark @click="avatarSelectOpen = false">キャンセル</vs-button>
                    <vs-button
                        :disabled="!selected"
                        @click="saveAvatar"
                    >
                        保存
                    </vs-button>
                </div>
            </div>
        </vs-dialog>
    </div>
</template>

<script>

import imageCropper from '../shared/CC_comp_image_cropper'

export default {
    components: {
        imageCropper
    },
    data() {
        return {
            avatarSelectOpen: false,
            selected: false,
            hasAvatar: true,
            cacheBreaker: 1
        }
    },
    computed: {
        avatarURL() {
        return this.$globals.filesUrl + 'user' + this.$store.getters.userInfo.id + '.png?' + this.cacheBreaker
        }
    },
    methods: {
        saveAvatar() {
            const loading = this.loadingElm = this.$vs.loading({
                target: this.$refs.avaDia,
                color: 'dark'
            })

            let img = this.$refs.cropper.getImage()
            let that = this
            img.toBlob(function(blob) {
                let sendData =  {
                    fileList: [new File([blob], "fileName.png", { type: "image/png" })],
                    hasFiles: true,
                    fileMeta: {
                        fileInfo: ['avatar'],
                        info: null,
                        type: 0
                    }
                }
                that.$post('files', sendData)
                .then(() => {
                    loading.close()
                    that.cacheBreaker++
                    that.avatarSelectOpen = false
                    that.$eventHub.$emit('updateCacheBreaker')
                })
                .catch(result => {
                    that.$apiError(result)
                })
            })

        }
    },
    
}
</script>
