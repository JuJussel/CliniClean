<template>
    <div style="height: 100%; padding: 10px">
        <vs-row style="height: 100%">
            <vs-col w="6" style="height: 100%">
                <vs-table>
                    <template #header>
                        <h3 style="display: flex; align-items: center; justify-content: space-between; margin: 0">
                            一覧
                            <vs-button
                                icon dark
                                size="small"
                                animation-type="scale"
                                @click="showEdit(null)"
                                >
                                <i class="fas fa-plus" style="font-size: 14px"></i>
                                <template #animate>登録</template>
                            </vs-button>
                        </h3>
                    </template>
                    <template #thead>
                        <vs-tr>
                            <vs-th>名前</vs-th>
                            <vs-th>ユーザー名</vs-th>
                            <vs-th>タイプ</vs-th>
                            <vs-th>ダイレクトリー</vs-th>
                            <vs-th>オルカあり</vs-th>
                            <vs-th>ステータス</vs-th>
                            <vs-th>登録日</vs-th>
                            <vs-th></vs-th>
                        </vs-tr>
                    </template>
                    <template #tbody>
                        <vs-tr v-for="(tr, index) in users" :key="index">
                            <vs-td> {{ tr.name_last }} {{ tr.name_first }}</vs-td>
                            <vs-td> {{ tr.user_name }} </vs-td>
                            <vs-td> {{ tr.role }} </vs-td>
                            <vs-td>
                                <span v-if="tr.is_directory">ダイレクトリー</span>
                                <span v-else>ローカル</span>
                            </vs-td>
                            <vs-td>
                                <span v-if="tr.has_orca">有</span>
                            </vs-td>
                            <vs-td>
                                <span v-if="!tr.active">無効</span>
                            </vs-td>
                            <vs-td><dateDisplay :date="tr.created"></dateDisplay></vs-td>
                            <vs-td style="width: 60px">
                                <vs-button
                                    v-if="!tr.is_directory"
                                    @click="showEdit(tr)"
                                    icon dark border
                                    size="small"
                                    animation-type="scale"
                                    class="cc-hover-button"
                                    >
                                    <i class="far fa-edit" style="font-size: 14px"></i>
                                    <template #animate>編集</template>
                                </vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
        <vs-dialog           
            blur
            v-model="editOpen"
            width="500px">
            <template #header>
                <h3 class="dialog-title"> ユーザー編集 </h3>
            </template>
            <userEdit :user="editUser"></userEdit>

        </vs-dialog>
    </div>
</template>

<script>

import userEdit from '../shared/CC_comp_user_edit'

export default {

    components: {
        userEdit: userEdit
    },
    created() {
        this.$get('users')
        .then(result => {
            this.users = result.data
        })
        .catch(result => {
            this.$apiError(result)
        })
    },
    data() {
        return {
            users: [],
            editOpen: false,
            editUser: null
        }
    },
    methods: {
        showEdit(user) {
            if (user) {
                console.log('is');
                this.editUser = JSON.parse(JSON.stringify(user))                
            } else {
                this.editUser = null
            }
            this.editOpen = true
        }
    }
    
}
</script>