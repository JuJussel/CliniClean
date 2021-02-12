<template>
    <div ref="loadCont">
        <vs-row>
            <vs-col w="5">
                <vs-input
                    v-model="title"
                    label="タイトル"
                    style="margin: 10px -10px 20px -10px"
                />
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col w="5">
                <div 
                    class="cc-card-header"
                    style="display: flex; justify-content: space-between; margin-bottom: -10px">
                    <span>フォルダー選択</span>
                    <vs-button
                        @click.stop="newRootFolder(node)"
                        icon
                        dark
                        border
                        size="small"
                        animation-type="scale"
                    >
                        <i class="fas fa-plus" style="font-size: 14px"></i>
                        <template #animate>新規</template>
                    </vs-button>
                </div>
                <tree
                    ref="tree"
                    :data="setFolders"
                    @node:clicked="selectFolder"
                    @node:editing:stop="saveNewFolder"
                    style="height: 400px">
                    <div slot-scope="{ node }" style="width: 100%">
                        <template>
                            <span style="display: flex; justify-content: space-between">
                                <span>
                                    <i class="far fa-folder" v-if="!node.expanded()"></i>
                                    <i class="far fa-folder-open" v-else></i>
                                    {{ node.text }}
                                </span>
                                <vs-button
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
                        </template>
                    </div>
                </tree>
            </vs-col>
            <vs-col w="7" style="padding-left: 20px">
                <vs-table style="height: 400px">
                    <template #header>
                        登録の行為
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
                            v-for="(tr, index) in itemsCopy"
                            :key="index"
                            >
                            <vs-td>
                                <div>
                                    <i :class="kouiCats[tr.type].icon" style="margin-right: 10px"></i>
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
            </vs-col>
        </vs-row>
        <vs-row justify="flex-end">
            <vs-button transparent dark @click="$emit('close')" :loading="folderCreating">キャンセル</vs-button>
            <vs-button primary :loading="folderCreating" @click="save" :disabled="title === '' || !selectedFolder ">登録</vs-button>
        </vs-row>

    </div>
</template>

<script>

import kouiItem from "../shared/shinsatu_koui_item"

export default {
    components: {
        kouiItem: kouiItem
    },
    props: {
        items: {default: null},
        sets: {default: []}
    },
    data () {
        return {
            kouiCats: this.$store.getters.kouiCats,
            itemsCopy: JSON.parse(JSON.stringify(this.items)),
            folders: JSON.parse(JSON.stringify(this.sets)),
            selectedFolder: null,
            folderCreating: false,
            title: ''
        }
    },
    computed: {
        setFolders() {
            return this.folders.filter(function f(i) {           
                if(i.children) {
                    i.children = i.children.filter(f)
                }
                if(i.data.isFolder) return true
            })
        },
    },
    methods: {
        updateKoui(content, index) {
            this.itemsCopy[index] = content
        },
        removeKoui(index) {
            this.itemsCopy.splice(index, 1)
        },
        submit() {
            this.$emit('close')
        },
        selectFolder(folder) {
            this.selectedFolder = folder
        },
        newFolder(node) {
            let t = node.append('new')
            if (!node.states.expanded) {
                node.expand()
            }
            t.startEditing()
        },
        newRootFolder() {
            let t = this.$refs.tree.append('new')
            t.startEditing()
        },
        saveNewFolder(node, orig) {

            if(node.data.text === orig) {
                node.remove()
                return
            }
            this.folderCreating = true
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
            .then(() => {
                this.$emit('newFolder')
                loading.close()
                this.folderCreating = false
            })
            .catch(result => {
                this.$apiError(result)
                loading.close()
                this.folderCreating = false
            })
        },
        save() {

            const loading = this.$vs.loading({
                target: this.$refs.loadCont,
                color: 'dark'
            })

            let patient = this.selectedFolder.data.patient ? this.selectedFolder.data.patient : null
            let data = {
                text: this.title,
                patient: patient,
                parent: this.selectedFolder.id,
                content: this.itemsCopy
            }

            this.$post('sets', data)
            .then(() => {
                this.$emit('save')
                this.$emit('close')
            })
            .catch(result => {
                this.$apiError(result)
                loading.close()
            })

        }
    }
}
</script>