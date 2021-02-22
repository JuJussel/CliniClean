<template>
    <div style="height: 100%">
        <vs-row ref="loadElm" style="height: 100%">
            <vs-col w="4" style="height: 100%">
                <div class="content-card">
                    <div class="cc-card-header">
                        <h3>フォルダー一覧</h3>
                    </div>
                    <tree
                        v-if="setFolders.length > 0"
                        ref="tree"
                        :data="sets"
                        @node:clicked="selectItem"
                        @node:editing:stop="saveNewFolder"
                        style="height: calc(100% - 80px)">
                        <div slot-scope="{ node }" style="width: 100%">
                            <template>
                                <span style="display: flex; justify-content: space-between; align-items: center; margin: -5px">
                                    <span v-if="node.data.isFolder">
                                        <i class="far fa-folder" v-if="!node.expanded()"></i>
                                        <i class="far fa-folder-open" v-else></i>
                                        {{ node.text }}
                                    </span>
                                    <span v-else>
                                        <i class="far fa-list-alt"></i>
                                        {{ node.text }}
                                    </span>
                                    <span v-if="node.data.isFolder" style="display: flex">
                                        <vs-button
                                            @click="folderDeleteOpen = true"
                                            icon
                                            danger
                                            border
                                            size="small"
                                            class="cc-tree-button"
                                            animation-type="scale"
                                            >
                                            <i class="far fa-trash-alt" style="font-size: 14px"></i>
                                            <template #animate>削除</template>
                                        </vs-button>
                                        <vs-button
                                            @click.stop="editFolder(node)"
                                            icon
                                            dark
                                            border
                                            size="small"
                                            class="cc-tree-button"
                                            animation-type="scale"
                                            >
                                            <i class="fas fa-edit" style="font-size: 14px"></i>
                                            <template #animate>編集</template>
                                        </vs-button>
                                        <vs-button
                                            v-if="node.id !== 'noParent'"
                                            @click.stop="newFolder(node)"
                                            icon
                                            dark
                                            border
                                            size="small"
                                            class="cc-tree-button"
                                            animation-type="scale"
                                            >
                                            <i class="fas fa-plus" style="font-size: 14px"></i>
                                            <template #animate>新規</template>
                                        </vs-button>
                                    </span>
                                </span>
                            </template>
                        </div>
                    </tree>
                </div>
            </vs-col>
            <vs-col w="4" style="height: 100%">
                <div class="content-card">
                    <vs-table
                        v-if="selectedItem && !selectedItem.data.isFolder"
                        style="height: 100%"
                    >
                        <template #header>
                            <h3 style="display: flex; justify-content: space-between; align-items: center">
                                <span>
                                    <vs-input v-model="selectedItem.data.text" state="dark">
                                        <template #icon>
                                            <i class='bx bx-lock-open-alt'></i>
                                        </template>
                                    </vs-input>
                                </span>
                                <span style="display: flex">
                                    <vs-button danger>削除</vs-button>
                                    <vs-button transparent dark>キャンセル</vs-button>
                                    <vs-button>保存</vs-button>
                                </span>
                            </h3>
                        </template>
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg" />
                            <div>
                                <b style="color: gray">項目なし</b>
                            </div>
                        </template>
                        <template #thead>
                            <vs-tr style="display: none">
                                <vs-th></vs-th>
                                <vs-th></vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr
                                class="vs-table__tr expand"
                                style="border-top: solid 5px white;"
                                v-for="(tr, index) in selectedItem.data.content.items"
                                :key="index"
                                >
                                <vs-td>
                                    <div>
                                        <!-- <i :class="kouiCats[tr.type].icon" style="margin-right: 10px"></i> -->
                                        <span style="padding: 3px">{{ tr.name }}</span>
                                    </div>
                                    <div>
                                        <kouiItem
                                            v-if="tr.type === '25' || tr.type === '30' || tr.type === '31'"
                                            :kouiInit="tr"
                                            noDelete
                                            @update="updateKoui(...arguments, index)"
                                        ></kouiItem>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <vs-button
                                        icon
                                        danger
                                        animation-type="scale"
                                        @click="removeKoui(index)"
                                        >
                                        <i class="far fa-trash-alt" style="font-size: 14px"></i>
                                        <template #animate>削</template>
                                    </vs-button>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <vs-table
                        v-else-if="selectedItem"
                        style="height: 100%"
                    >
                        <template #notFound>
                            <img style="width: 200px" src="../../assets/img/empty2.jpg" />
                            <div>
                                <b style="color: gray">項目なし</b>
                            </div>
                        </template>
                        <template #header>
                            <h3 style="display: flex; justify-content: space-between; align-items: center">
                                <span style="display: flex; align-items: center">
                                    <vs-button dark @click="folderUp"><i class="fas fa-level-up-alt"></i></vs-button>
                                    {{ selectedItem.data.text }}
                                    フォルダ内容一覧
                                </span>
                                <span style="display: flex">
                                    <vs-tooltip bottom shadow not-hover v-model="folderAddPop">
                                    <vs-button dark @click="folderAddPop=!folderAddPop">新規</vs-button>
                                    <template #tooltip>
                                        <div>
                                            <vs-button @click="newFolder(selectedItem)" dark block>
                                                <i class="far fa-folder" style="margin-right: 10px"></i>
                                                フォルダ
                                            </vs-button>
                                            <vs-button @click="folderAddPop=false" dark block>
                                                <i class="far fa-list-alt" style="margin-right: 10px"></i>
                                                セット
                                            </vs-button>
                                        </div>
                                        </template>
                                    </vs-tooltip>
                                    <vs-button danger @click="folderDeleteOpen = true">削除</vs-button>
                                </span>
                            </h3>
                        </template>
                        <template #thead>
                            <vs-tr style="display: none">
                                <vs-th></vs-th>
                                <vs-th></vs-th>
                            </vs-tr>
                        </template>
                        <template #tbody>
                            <vs-tr
                                class="vs-table__tr expand"
                                style="border-top: solid 5px white;"
                                v-for="(tr, index) in selectedItem.children"
                                @click="selectItem(tr, false)"
                                :key="index"
                                >
                                <vs-td>
                                    <i class="far fa-folder" v-if="tr.data.isFolder"></i>
                                    <i class="far fa-list-alt" v-else></i>
                                    {{ tr.data.text }}
                                </vs-td>
                                <vs-td style="width: 40px">
                                    <vs-button
                                        icon
                                        danger
                                        animation-type="scale"
                                        @click="deleteFolder(tr)"
                                        >
                                        <i class="far fa-trash-alt" style="font-size: 14px"></i>
                                        <template #animate>削</template>
                                    </vs-button>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </vs-col>
            <vs-col w="4" v-if="selectedItem && !selectedItem.data.isFolder" style="height: 100%">
                <div class="content-card">
                    <div class="cc-card-header">
                        <h3>行為一覧</h3>
                    </div>
                    <kouiList 
                        @addKoui="addKoui"
                        noSets
                        style="margin-top: -10px; height: calc(100% - 80px)"
                    />
                </div>
            </vs-col>
        </vs-row>
        <vs-dialog width="550px" not-center v-model="folderDeleteOpen">
            <template #header>
                <h4 class="not-margin" v-if="folderDeleteOpen">
                    {{ selectedItem.text }}のフォルダー削除確認
                </h4>
            </template>
            <div v-if="folderDeleteOpen">
                <p>フォルダー「{{ selectedItem.text }}」を削除しますか？</p>
                <p>サブフォルダ又は内セットを全て削除します！</p>
            </div>
            <template #footer>
                <div style="display: flex; justify-content: flex-end">
                    <vs-button @click="folderDeleteOpen = false" dark transparent>キャンセル</vs-button>
                    <vs-button @click="deleteFolder(selectedItem)" danger>削除</vs-button>
                </div>
            </template>
        </vs-dialog>
    </div>
</template>

<script>

import kouiItem from "../shared/shinsatu_koui_item"
import kouiList from "../shared/koui_list"

export default {
    components: {
        kouiItem: kouiItem,
        kouiList: kouiList
    },
    data() {
        return {
            folders: [],
            selectedItem: null,
            loading: false,
            loadingCont: null,
            sets: [],
            folderAddPop: false,
            editingFolder: false,
            folderDeleteOpen: false
        }
    },
    created() {
        this.updateData()
    },
    methods: {
        updateData() {
            this.$get('sets')
            .then(result => {
                this.sets = result.data
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })
        },
        addKoui(koui) {

        },
        deleteFolder(node) {
            this.folderDeleteOpen = false
            this.loading = true
            this.$delete('setfolders/' + node.id)
            .then(() => {
                if (node.parent) {
                    node.parent.select()
                    this.selectedItem = node.parent                    
                }
                node.remove()
                this.updateData()
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })

        },
        newFolder(node) {
            this.selectedItem = node
            let t = node.append({
                text: 'new',
                data: {isFolder: true}
            })
            if (!node.states.expanded) {
                node.expand()
            }
            t.startEditing()
        },
        saveNewFolder(node, orig) {
            if (this.editingFolder) {
                if(node.data.text === orig) {
                    return
                }
                this.loading = true
                this.$put('setfolders/' + node.id, node)
                .then((result) => {
                    node.id = result.data
                    this.updateData()
                    this.loading = false
                })
                .catch(result => {
                    this.$apiError(result)
                    this.loading = false
                })


            } else {
                if(node.data.text === orig) {
                    node.remove()
                    return
                }
                this.loading = true
                const loading = this.$vs.loading({
                    target: this.$refs.tree,
                    color: 'dark'
                })
                let patient =  null
                if(node.parent && node.parent.data.patient) {
                    patient = node.parent.data.patient
                }
                let data = {
                    text: node.data.text,
                    patient: patient,
                    parent: node.parent ? node.parent.id : 'noParent'
                } 
                this.$post('setfolders', data)
                .then((result) => {
                    node.id = result.data
                    this.updateData()
                    loading.close()
                    this.loading = false
                })
                .catch(result => {
                    this.$apiError(result)
                    loading.close()
                    this.loading = false
                })
            }

        },
        editFolder(folder) {
            this.editingFolder = true
            folder.startEditing()
        },
        selectItem(folder, isTree = true) {
            this.folderAddPop = false
            this.selectedItem = folder
            if (!isTree) {
                let node = this.$refs.tree.find({
                    id: String(folder.id)
                })
                if (node.length > 0) {
                    node = node[0]
                    if(!node.parent.expanded()) node.parent.expand()
                    node.expand()
                    node.select()  
                }
            }
        },
        folderUp() {
            let node = this.$refs.tree.find({id: String(this.selectedItem.id)})
            console.log(node);
            if (node.length > 0) {
                node = node[0]
                node.collapse()
                if(node.parent && node.parent.expanded()) {
                    node.parent.collapse()
                    node.parent.select()
                    this.selectedItem = node.parent
                }
            }
        }

    },
    computed: {
        setFolders() {
            let sets = JSON.parse(JSON.stringify(this.sets))
            return sets.filter(function f(i) {           
                if(i.children) {
                    i.children = i.children.filter(f)
                }
                if(i.data.isFolder) return true
            })
        },
    },
    watch: {
        loading() {
            if (this.loading) {
                this.loadingCont= this.$vs.loading({
                    target: this.$refs.loadElm,
                    color: 'dark'
                })
            } else {
                this.loadingCont.close()
                this.loadingCont = null
            }
        }
    },


}
</script>