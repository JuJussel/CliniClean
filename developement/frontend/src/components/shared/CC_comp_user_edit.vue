<template>
    <div>
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
        <vs-row>
            <vs-select label="役"></vs-select>
        </vs-row>
        <vs-row style="margin-left: 20px">
            <vs-checkbox v-model="editUser.has_orca" dark>オルカ使用</vs-checkbox>
        </vs-row>
        <vs-row style="margin-left: 20px">
            <vs-checkbox v-model="editUser.active" dark>有効</vs-checkbox>
        </vs-row>
        <vs-row style="margin-top: 40px" justify="space-between">
            <span style="display: flex">
                <vs-button danger>ユーザー名削除</vs-button>
                <vs-button warn>パスワードのリセット</vs-button>
            </span>
            <span style="display: flex">
                <vs-button transparent dark @click="$emit('close')">キャンセル</vs-button>
                <vs-button>保存</vs-button>
            </span>
        </vs-row>

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
            editUser: {
                has_orca: 0,
                name_first: '',
                name_last: '',
                role: null,
                user_name: '',
                active: 1
            }
        }
    }
}
</script>