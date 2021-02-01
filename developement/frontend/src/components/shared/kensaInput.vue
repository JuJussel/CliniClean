<template>
    <div style="height: 100%" ref="loadElm">
        <div class="cc-card-header">
            <h2 style="margin-right: 10px">検査結果入力</h2>
            <vs-button dark @click="kensaAddOpen = true">検査追加</vs-button>
            <vs-button @click="save">保存</vs-button>
        </div>
        <div style="overflow: auto; height: calc(100% - 110px); padding: 20px">
            <kensaItem v-for="item in meta.kouis" :key="item.koui.kouiCode" :meta="item" noDelete></kensaItem>
            <kensaItem v-for="(item, index) in newKensa" :key="item.koui.kouiCode" :meta="item" @removeKensa="removeKensa(index)"></kensaItem>
        </div>
        <vs-dialog blur v-model="kensaAddOpen" width="1000px">
            <template #header>
                <h4 class="not-margin">検査追加</h4>
            </template>
            <newKensa ref="newKensaElm"></newKensa>
            <template #footer>
                <div style="display: flex; justify: flex-end">
                    <vs-button @click="kensaAddOpen = false" transparent dark>キャンセル</vs-button>
                    <vs-button @click="addKensa" dark>追加</vs-button>
                </div>
            </template>
        </vs-dialog>
        <vs-dialog width="550px" not-center v-model="inputConfirmOpen">
            <template #header>
                <h4 class="not-margin">入力確認</h4>
            </template>
                <div class="con-content">
                    <p>入力のない項目があります。保存しますか？</p>
                </div>
            <template #footer>
                <div style="display: flex; justify: flex-end">
                    <vs-button @click="inputConfirmOpen=false" dark >キャンセル</vs-button>
                    <vs-button @click="commitSave" transparent>確認</vs-button>
                </div>
            </template>
        </vs-dialog>
    </div>
</template>

<script>
    import newKensa from './newKensa'
    import kensaItem from './kensaInputItem'
    export default {
        props: {
            meta: {
                default: []
            }
        },
        components: {
            kensaItem,
            newKensa
        },
        computed: {
            height() {
                let wh = window.innerHeight
                return wh - 260
            }
        },
        data() {
            return {
                inputConfirmOpen: false,
                kensaAddOpen: false,
                newKensa: [],
                loading: false,
                loadingElm: null
            }
        },
        methods: {
            addKensa() {
                let newResults = JSON.parse(JSON.stringify(this.$refs.newKensaElm.selectedKensa))
                newResults.forEach(item => {
                    item.koui = {
                        kouiCode: item.kouiid,
                        name: item.name,
                        var: {
                            results: []
                        }
                    }
                })
                this.kensaAddOpen = false
                this.newKensa.push(...newResults)
            },
            removeKensa(key) {
                this.newKensa.splice(key, 1)
            },
            save() {
                let empty = false
                this.meta.kouis.forEach(item => {
                    item.koui.var.results.forEach(element => {
                        if (element.value === '') {
                            empty = true
                        }
                    })
                })
                if (empty) {
                    this.inputConfirmOpen = true
                } else {
                    this.commitSave()
                }
            },
            commitSave() {
                this.loading = true

                let encounterID = this.meta.kouis[0].encounterID
                let sendData = {
                    existing: this.meta,
                    new: this.newKensa
                }

                this.$put('examinations/' + encounterID, sendData)
                .then(result => {
                    this.loading = false
                    this.loadingElm = null
                    this.$vs.notification({
                        duration: 2000,
                        color: "primary",
                        position: "top-center",
                        title: "保存しました！",
                        text: "データを通常に保存しました",
                        icon: '<i class="fas fa-info"></i>',
                    })
                    this.$emit('saved')
                })
                .catch(result => {
                    this.$apiError(result)
                })

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
                    this.loadingElm = null
                }
            }
        }

    }
</script>