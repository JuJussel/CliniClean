<template>
    <div style="height: 100%">
        <vs-row>
            <vs-button>新規セット</vs-button>
        </vs-row>
        <vs-row ref="loadElm">
            <vs-col w="4">
                <div 
                    class="cc-card-header"
                    style="display: flex; justify-content: space-between; margin-bottom: -10px">
                    <span>フォルダー一覧</span>
                </div>
                <tree
                    v-if="setFolders.length > 0"
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
            <vs-col w="4">
                
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
            selectedFolder: null,
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
                this.loading = false
            })
            .catch(result => {
                this.$apiError(result)
                this.loading = false
            })
        },
        saveNewFolder() {

        },
        selectFolder(folder) {
            this.selectedFolder = folder
        },

    },
    computed: {
        setFolders() {
            return this.sets.filter(function f(i) {           
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