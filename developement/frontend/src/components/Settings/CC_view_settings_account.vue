<template>
    <div style="height: calc(100% - 40px); padding: 20px">
        <vs-row ref="loadElm">
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
                <vs-button dark @click="passOpen = true">
                    <i class="fas fa-lock" style="margin-right: 10px"></i>
                    パスワード変更
                </vs-button>
            </div>
        </vs-row>
        <vs-dialog
            blur
            v-model="avatarSelectOpen"
            width="700px"
        >
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
        <vs-dialog           
            blur
            v-model="passOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> パスワードリセット </h3>
            </template>
            <vs-row>
                <vs-col w="6">
                    <vs-input type="password" v-model="oldPassword" label="古いパスワード"/>
                </vs-col> 
            </vs-row>
            <vs-row>
                <vs-col w="6">
                    <vs-input type="password" @blur="checkPassword" v-model="password" label="新しいパスワード">
                        <template #message-danger>
                            <vs-tooltip v-if="!passwordStrong">
                                <span>
                                    パスワード条件満たしてません。
                                    <i class="fas fa-info-circle"></i>
                                </span>
                                <template #tooltip>
                                    <p>・8文字以上</p>
                                    <p>・半角英字大文字と小文字をそれぞれ1文字以上</p>
                                    <p>・数字1文字以上</p>
                                    <p>・記号1文字以上</p>
                                </template>
                            </vs-tooltip>
                        </template>
                    </vs-input>
                </vs-col>
                <vs-col w="6">
                    <vs-input type="password" @blur="checkPassword" v-model="passwordConfirm" label="新しいパスワード再入力">
                        <template #message-danger>
                            <span v-if="!passwordsMatch">パスワードが一致しません。</span>
                        </template>
                    </vs-input>
                </vs-col>
            </vs-row>
            <div style="display: flex; justify-content: flex-end">
                <vs-button transparent dark @click="passOpen = false">キャンセル</vs-button>
                <vs-button :disabled="
                    password === ''
                    || oldPassword === ''
                    || passwordConfirm === ''
                    || !passwordStrong
                    || !passwordsMatch" 
                    @click="changePassword"
                    >
                    保存
                </vs-button>
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
            passOpen: false,
            selected: false,
            hasAvatar: true,
            cacheBreaker: 1,
            oldPassword: '',
            password: '',
            passwordConfirm: '',
            passwordStrong: true,
            passwordsMatch: true,
            loading: false,
            loadingElm: null
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

        },
        changePassword() {
            this.loading = true
            this.passOpen = false
            let sendData = {
                changePassword: true,
                user_password_update: true,
                user_name: this.$store.getters.userInfo.user_name,
                id: this.$store.getters.userInfo.id,
                has_orca: this.$store.getters.userInfo.has_orca,
                old_password: this.oldPassword,
                password: this.password
            }
            this.$put('users', sendData)
            .then(() => {
                this.loading = false
                this.$vs.notification({
                    duration: 2000,
                    color: "primary",
                    position: "top-center",
                    title: "成功",
                    text: "パスワードを変更します！",
                    icon: '<i class="fas fa-info"></i>',
                })
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })

        },
        checkPassword() {
            if (this.password !== "" && this.passwordConfirm !== "") {
                if (this.password !==  this.passwordConfirm) {
                    this.passwordsMatch = false
                } else {
                    this.passwordsMatch = true
                }
            } else {
                this.passwordsMatch = true
            }
            var strength = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
            if(strength.test(this.password)) {
                this.passwordStrong = true
            } else {
                this.passwordStrong = false
            }

        }

    },
    watch: {
        loading() {
        if (this.loading) {
            this.loadingElm = this.$vs.loading({
                target: this.$refs.loadElm,
                color: 'dark'
            })
        } else if (this.loadingElm) {
            this.loadingElm.close()
        }
        }
    }
    
}
</script>
