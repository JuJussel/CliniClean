<template>
    <div style="height: 100%">
        <vs-row>
            <vs-button>新規セット</vs-button>
        </vs-row>
        <vs-row ref="loadElm" style="height: calc(100% - 50px)">
            <vs-col w="4" style="height: 100%; padding: 10px">
                <div 
                    class="cc-card-header"
                    style="display: flex; justify-content: space-between; margin-bottom: -10px">
                    <span>フォルダー一覧</span>
                </div>
                <tree
                    v-if="setFolders.length > 0"
                    ref="tree"
                    :data="sets"
                    @node:clicked="selectItem"
                    @node:editing:stop="saveNewFolder"
                    style="height: calc(100% - 40px)">
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
                                        @click.stop="newFolder(node)"
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
                                        @click.stop="newFolder(node)"
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
            </vs-col>
            <vs-col w="4" style="padding: 10px">
                <vs-table
                    v-if="selectedItem && !selectedItem.data.isFolder" 
                    style="height: 400px">
                    <template #header>
                        {{ selectedItem.data.text }}
                        行為一覧
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

            </vs-col>
            <vs-col w="4">
                
            </vs-col>

        </vs-row>
    </div>
</template>

<script>


export default {
    components: {
    },
    data() {
        return {
            folders: [],
            selectedItem: null,
            loading: false,
            loadingCont: null,
            sets: []
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
                console.log(this.sets);
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })
        },
        saveNewFolder() {

        },
        selectItem(folder) {
            this.selectedItem = folder
        },

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