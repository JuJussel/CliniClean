<template>
    <div ref="loadElm">
        <vs-row>
            <vs-input v-model="editUser.user_name" label="ユーザー名"></vs-input>
        </vs-row>
        <vs-row>
            <vs-col w="6">
                <vs-input v-model="editUser.name_last" label="性"></vs-input>
            </vs-col>
            <vs-col w="6">
                <vs-input v-model="editUser.name_first" label="名"></vs-input>
            </vs-col>
        </vs-row>
        <vs-row v-if="!edit">
            <vs-col w="6">
                <vs-input type="password" @blur="checkPassword" v-model="password" label="パスワード">
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
                <vs-input type="password" @blur="checkPassword" v-model="passwordConfirm" label="パスワード再入力">
                    <template #message-danger>
                        <span v-if="!passwordsMatch">パスワードが一致しません。</span>
                    </template>
                </vs-input>
            </vs-col>
        </vs-row>

        <vs-row>
            <vs-select label="グループ" placeholder="選択" v-model="editUser.group" :key="groups.length">
                <vs-option v-for="(item, i) in groups" :key="i" :label="item.label" :value="item.id">
                    {{item.label}}
                </vs-option>
            </vs-select>
        </vs-row>
        <vs-row style="margin-left: 20px">
            <vs-checkbox v-model="editUser.has_orca" dark>オルカ使用</vs-checkbox>
        </vs-row>
        <vs-row style="margin-left: 20px">
            <vs-checkbox v-model="editUser.active" dark>有効</vs-checkbox>
        </vs-row>
        <vs-row style="margin-top: 40px" justify="space-between">
            <span style="display: flex">
                <vs-button danger v-if="edit">ユーザー名削除</vs-button>
                <vs-button warn v-if="edit" @click="passOpen = true">パスワードのリセット</vs-button>
            </span>
            <span style="display: flex">
                <vs-button transparent dark @click="$emit('close')">キャンセル</vs-button>
                <vs-button :disabled="!inputOk" v-if="edit" @click="update">保存</vs-button>
                <vs-button :disabled="!inputOk" v-else @click="create">作成</vs-button>
            </span>
        </vs-row>
        <vs-dialog           
            blur
            v-model="passOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> パスワードリセット </h3>
            </template>
            <vs-row>
                <vs-col w="6">
                    <vs-input type="password" @blur="checkPassword" v-model="password" label="パスワード">
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
                    <vs-input type="password" @blur="checkPassword" v-model="passwordConfirm" label="パスワード再入力">
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
                    || passwordConfirm === ''
                    || !passwordStrong
                    || !passwordsMatch" 
                    @click="changePassword"
                    >
                    保存
                </vs-button>
            </div>
        </vs-dialog>
        <vs-dialog           
            blur
            v-model="passwordRequestOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> ユーザーパスワード入力 </h3>
            </template>
            <p style="margin: 20px 30px">オルカアカウントを有効するには、ユーザーパスワードが必要です。</p>
            <vs-input type="password" v-model="password" label="パスワード"></vs-input>
            <div style="display: flex; justify-content: flex-end">
                <vs-button transparent dark @click="passwordRequestOpen = false">キャンセル</vs-button>
                <vs-button 
                    :disabled="password === ''"
                    @click="confirmOrcaEdit"
                    >
                    保存
                </vs-button>
            </div>
        </vs-dialog>


    </div>
</template>

<script>
export default {
    props: {
        user: {default: null}
    },
    created() {
        if(this.user) {
            Object.assign(this.editUser, this.user)
        }
    },
    data() {
        return {
            loading: false,
            loadingElm: null,
            passOpen: false,
            passwordRequestOpen: false,
            password: "",
            passwordsMatch: true,
            passwordConfirm: "",
            passwordStrong: true,
            editUser: {
                has_orca: false,
                name_first: '',
                name_last: '',
                group: 1,
                user_name: '',
                active: true,
                old_user_name: this.user ? JSON.parse(JSON.stringify(this.user.user_name)) : null,
                had_orca: this.user ? JSON.parse(JSON.stringify(this.user.has_orca)) : false
            },
            groups: this.$store.getters.user_groups
        }
    },
    computed: {
        edit() {
            if (this.editUser.id) {
                return true
            }
            return false
        },
        inputOk() {
            if (this.edit) {
                if (
                    this.editUser.user_name === ''
                    || this.editUser.name_first === ''
                    || this.editUser.name_last === ''
                ) {
                    return false
                }
            } else if (
                this.editUser.user_name === ''
                || this.editUser.name_first === ''
                || this.editUser.name_last === ''
                || this.password === ''
                || this.passwordConfirm === ''
                || !this.passwordsMatch
                || !this.passwordStrong
            ) {
                return false
            }
            return true
        }
    },
    methods: {
        update() {

            if(this.editUser.has_orca !== this.editUser.had_orca && this.editUser.has_orca && !this.passwordRequestOpen) {
                this.passwordRequestOpen = true
                return
            }

            this.passwordRequestOpen = false

            this.loading = true
            this.$put('users', this.editUser)
            .then(() => {
                this.loading = false
                this.saved()
            })
            .catch(result => {
                this.loading = false
                this.$apiError(result)
            })
        },
        confirmOrcaEdit() {
            this.editUser.password = this.password
            this.update()
        },
        create() {
            this.loading = true
            this.editUser.password = this.password
            this.$post('users', this.editUser)
            .then(() => {
                this.loading = false
                this.saved()
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })
        },
        saved() {
            this.$vs.notification({
                duration: 2000,
                color: "primary",
                position: "top-center",
                title: "保存しました！",
                text: "ユーザーを保存しました",
                icon: '<i class="fas fa-info"></i>',
            })
            this.$emit('saved')
            this.$emit('close')
        },
        changePassword() {
            this.loading = true
            this.passOpen = false
            this.editUser.password = this.password
            this.editUser.changePassword = true
            this.$put('users', this.editUser)
            .then(() => {
                this.saved()
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