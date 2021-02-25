<template>
    <div style="height: 100%">
        <vs-row ref="loadElm" style="height: 100%">
            <vs-col w="4" style="height: 100%">
                <div class="content-card">
                    <div class="cc-card-header">
                        <h3>フォルダー一覧</h3>
                        <vs-tooltip bottom shadow not-hover v-model="folderAddPop">
                            <vs-button dark @click="folderAddPop=!folderAddPop">新規</vs-button>
                            <template #tooltip>
                                <div>
                                    <vs-button @click="newFolder(selectedItem)" dark block>
                                        <i class="far fa-folder" style="margin-right: 10px"></i>
                                        フォルダ
                                    </vs-button>
                                    <vs-button @click="newSet()" dark block v-if="selectedItem">
                                        <i class="far fa-list-alt" style="margin-right: 10px"></i>
                                        セット
                                    </vs-button>
                                </div>
                            </template>
                        </vs-tooltip>
                    </div>
                    <tree
                        v-if="setFolders.length > 0"
                        ref="tree"
                        :data="sets"
                        @node:clicked="selectItem"
                        @node:editing:stop="saveNewFolder"
                        @click.native="treeClick($event)"
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
                                            @click.stop="showFolderDelete(node)"
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
                                            @click.stop="
                                                node.id === 'noParent' ? patientSelectOpen=true : newFolder(node)
                                            "
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
                        v-if="selectedItem && selectedItemCopy && !selectedItem.data.isFolder"
                        style="height: calc(100% - 80px)"
                    >
                        <template #header>
                            <h3 style="display: flex; justify-content: space-between; align-items: center">
                                <span>
                                    <vs-input v-model="selectedItemCopy.text" state="dark">
                                        <template #icon>
                                            <i class="far fa-edit"></i>
                                        </template>
                                    </vs-input>
                                </span>
                                <span style="display: flex">
                                    <vs-button @click="setDeleteOpen = true" danger>削除</vs-button>
                                    <vs-button @click="cancelSetEdit" transparent dark>キャンセル</vs-button>
                                    <vs-button @click="saveSet">保存</vs-button>
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
                                v-for="(tr, index) in selectedItemCopy.data.content.items"
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
                                    <i class="far fa-folder" style="font-size: 30px; margin: 0 10px"></i>
                                    {{ selectedItem.data.text }}
                                </span>
                                <vs-button danger @click="folderDeleteOpen = true">削除</vs-button>
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
        <vs-dialog width="550px" not-center v-model="setDeleteOpen">
            <template #header>
                <h4 class="not-margin">セット削除確認</h4>
            </template>
            <div v-if="setDeleteOpen">
                <p>セット「{{ selectedItem.text }}」を削除しますか？</p>
            </div>
            <template #footer>
                <div style="display: flex; justify-content: flex-end">
                    <vs-button @click="setDeleteOpen = false" dark transparent>キャンセル</vs-button>
                    <vs-button @click="deleteSet(selectedItem)" danger>削除</vs-button>
                </div>
            </template>
        </vs-dialog>
        <vs-dialog width="550px" not-center v-model="patientSelectOpen">
            <template #header>
                <h4 class="not-margin">患者選択</h4>
            </template>
            <selectInput 
                table
                dark
                :icon="'fas fa-search'"
                @change="patientSearch" 
                :results="patient.results"
                placeholder="氏名又はIDで検索"
                @select="selectPatient"
                style="width: 300px; margin-left: 20px">
                <span slot-scope="scope" >番号: {{ scope.item.id}} {{ scope.item.name }}</span>
            </selectInput>

            <template #footer>
                <div style="display: flex; justify-content: flex-end">
                    <vs-button @click="patientSelectOpen = false" dark transparent>キャンセル</vs-button>
                    <vs-button @click="newFolder(selectedItem, patient.selected)">作成</vs-button>
                </div>
            </template>
        </vs-dialog>

    </div>
</template>

<script>

import kouiItem from "../shared/CC_comp_procedure_item"
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
            selectedItemCopy: null,
            loading: false,
            loadingCont: null,
            sets: [],
            folderAddPop: false,
            editingFolder: false,
            folderDeleteOpen: false,
            patientSelectOpen: false,
            setDeleteOpen: false,
            kouiCats: this.$store.getters.kouiCats,
            patient: {
                results: [],
                selected: null
            }
        }
    },
    created() {
        this.updateData()
    },
    methods: {
        treeClick(event) {
            this.selectedItem.unselect()
            this.selectedItem = null
        },
        showFolderDelete(node) {
            this.selectedItem = node
            this.folderDeleteOpen = true
        },
        patientSearch(query) {
            if (query !== '') {

                this.$get('patients', query)
                .then(result => {
                    let results = result

                    this.patient.results = result.data
                })
                .catch(result => {
                    this.$apiError(result)
                })
            } else {
                this.patient.results = []
            }
        },
        selectPatient(pat) {
            this.patient.selected = pat
        },
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
        addKoui(data) {
            let koui = {
                kouiCode: data.koui.kouiid,
                type: data.type,
                name: data.koui.name,
                var: {},
                comment: {
                    present: false,
                    content: "",
                }
            }
            if (data.type === "60") {
                koui.var.results = [];
            }
            if (data.type === "30" || data.type === "31") {
                koui.var.location = "";
                koui.var.amount = "";
                koui.var.lotNo = "";
                koui.var.medID = koui.kouiCode;
                koui.kouiCode = "130000510";
            }
            if (data.type === "25") {
                koui.var.type = "1"
                koui.var.amount = ""
                koui.var.timing = { name: "指定なし" }
                koui.var.times = ""
                koui.var.unit = data.koui.taniname
            }
            this.selectedItemCopy.data.content.items.push(koui)
        },
        deleteFolder(node) {
            this.folderDeleteOpen = false
            this.loading = true
            this.$delete('setfolders', {id: node.id, pat: node.data.patient})
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
        newFolder(node, pat = null) {
            console.log(node);
            this.folderAddPop = false
            this.patientSelectOpen = false

            if (pat) {
                let newParentNode = {
                    data: {
                        isFolder: true,
                        patient: pat.id
                    },
                    id: 'p_' + pat.id,
                    text: pat.name,
                    children: []
                }

                let n = this.selectedItem.append(newParentNode)
                node = n

            } else {
                if (node.parent && node.parent.id === 'noParent') {
                    pat = node.data.patient
                }
            }

            let t = node.append({
                text: 'new',
                data: {
                    isFolder: true,
                    patient: pat
                }
            })
            if (!node.states.expanded) {
                node.expand()
            }
            t.startEditing()
            setTimeout(function() {
                this.selectedItem = node
            }.bind(this), 100)
        },
        newSet() {

            this.folderAddPop = false
            let node = this.selectedItem.append({
                text: 'new',
                data: {
                    isFolder: false,
                    parent: this.selectedItem.data.id,
                    patient: this.selectedItem.data.patient,
                    content: {
                        items: []
                    }
                }
            })
            this.selectedItem.expand()
            node.select()
            
            this.selectedItemCopy = node
            setTimeout(function() {
                this.selectedItem = node
            }.bind(this), 100)
        },
        cancelSetEdit() {

            let item = this.selectedItem
            this.selectedItem = this.selectedItem.parent
            this.selectedItem.select()
            if (!item.data.id) {
                item.remove()
            }

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
                } else {
                    if(node.data.patient) {
                        patient = node.data.patient
                    }
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
            this.selectedItemCopy = folder.data.isFolder ? null : JSON.parse(JSON.stringify(folder))
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
        },
        deleteSet() {

            this.loading = true
            this.setDeleteOpen = false
            let item = this.selectedItem
            let id = item.data.id

            this.$delete('sets/' + id)
            .then(() => {
                if (item.parent) {
                    item.parent.select()
                    this.selectedItem = item.parent                    
                }
                item.remove()
                this.updateData()
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })
        },
        saveSet() {
            
            let copy = this.selectedItemCopy
            let id = copy.data.id ? copy.data.id : null
            
            this.loading = true

            let call = null
            if (this.selectedItem.data.id) {
                call = this.$put('sets/' + id, copy)                
            } else {
                call = this.$post('sets', copy.data)
            }
            call.then(() => {
                this.creatingNewSet = false
                this.updateData()
                this.selectedItem.data = this.selectedItemCopy.data
                this.selectedItem.text = this.selectedItemCopy.text
                this.loading = false
                this.$vs.notification({
                    duration: 2000,
                    color: "primary",
                    position: "top-center",
                    title: "保存しました！",
                    text: "セットを通常に保存しました",
                    icon: '<i class="fas fa-info"></i>',
                })

            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })

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