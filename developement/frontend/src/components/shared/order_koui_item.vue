<template>
    <div style="height: 100%" ref="loadElm">
        <div class="cc-card-header">
            <h2 style="margin-right: 10px"> {{ koui.koui.name }} </h2>
            <vs-button @click="save">保存</vs-button>
        </div>
        <!-- Kensa -->
        <div v-if="koui.type === '60'">
            <vs-row style="padding: 20px">
                <vs-switch label="院外内" style="width: 80px" v-model="koui.koui.isExternal">
                    <template #off>
                        院内
                    </template>
                    <template #on>
                        院外
                    </template>
                </vs-switch>
                <div style="display: flex" v-if="koui.koui.isExternal">
                    <span style="width: 200p; padding-top: 10px">
                        <vs-select label="依頼先" placeholder="選択" v-model="koui.koui.var.supplier.supplier" :key="suppliers.length">
                            <vs-option v-for="(item, i) in suppliers" :key="i" :label="item" :value="item">
                                {{item}}
                            </vs-option>
                        </vs-select>
                    </span>
                    <vs-input v-model="koui.koui.var.supplier.number" label="依頼番号"></vs-input>
                </div>
            </vs-row>
            <kensaInput :meta=koui noDelete style="padding: 20px"></kensaInput>
        </div>
        <!-- Shot / Prev -->
        <div v-else-if="koui.type === '30' || koui.type === '31'" style="margin-top: 40px">
            <vs-row>
                <vs-col w="3">
                    <vs-select
                    placeholder="位置選択"
                    @input="shotTypeChange"
                    v-model="koui.koui.var.location"
                    label="位置選択"
                    :key="shotLocations.length"
                    >
                        <vs-option
                            v-for="item in shotLocations"
                            :key="item"
                            :label="item"
                            :value="item"
                        >
                            {{ item }}
                        </vs-option>
                    </vs-select>
                </vs-col>
                <vs-col w="3">
                    <vs-input v-model="koui.koui.var.amount" icon-after label="接種量" type="number">
                        <template #icon>ml</template>
                    </vs-input>
                </vs-col>
                <vs-col w="3">
                    <vs-input v-model="koui.koui.var.lotNo" label="LotNo"/>
                </vs-col>

            </vs-row>
        </div>
        <vs-row style="margin-top: 20px">
            <vs-col w="6" v-if="koui.koui.comment.content !== ''">
                <vs-textarea v-model="koui.koui.comment.content" label="コメント" readonly></vs-textarea>
            </vs-col>
            <vs-col w="6">
                <vs-textarea v-model="newComment" label="コメント追加"></vs-textarea>
            </vs-col>
        </vs-row>
    </div>
</template>

<script>

    import kensaInput from './kensaInputItem'

    export default {
        components: {
            'kensaInput': kensaInput
        },
        props: [
            'kouiOrig'
        ],
        created() {
            this.koui = JSON.parse(JSON.stringify(this.kouiOrig))
            if (this.koui.type === '60' ) {

                if(!this.$store.getters.suppliers) {

                    this.$get('suppliers')
                    .then(result => {
                        this.suppliers = result.data
                        this.$store.commit('SET_SUPPLIERS', result.data)
                        if (!this.koui.koui.var.supplier) {
                            this.koui.koui.var.supplier = {
                                supplier: this.suppliers[0],
                                number: ''
                            }
                        }
                    })
                    .catch(result => {
                        this.$apiError(result)
                    })
                } else {
                    this.suppliers = this.$store.getters.suppliers
                    if (!this.koui.koui.var.supplier) {
                        this.koui.koui.var.supplier = {
                            supplier: this.suppliers[0],
                            number: ''
                        }
                    }
                }
            }
        },
        data() {
            return {
                suppliers: [],
                kensa: {
                    supplier: "",
                    number: ""
                },
                resultsFilter: "",
                shotLocations: [
                    '右上腕',
                    '左上腕',
                    '右大腿',
                    '左大腿',
                    '右臀部',
                    '左臀部',
                    '静脈'
                ],
                medTimings: [],
                timingOpen: false,
                newComment: "",
                koui: {}
            }
        },
        methods: {
            addResult(result) {
                this.koui.koui.var.results.push(result)
            },
            removeResult (result) {
                this.koui.koui.var.results = this.koui.koui.var.results.filter(r => r.result_code !== result.result_code)
            },
            shotTypeChange(sel) {
                if(sel === "静脈") {
                    this.koui.koui.kouiCode = "130003510"
                } else {
                    this.koui.koui.kouiCode = "130000510"
                }
            },
            save() {/*
                const loading = this.$vs.loading({
                    target: this.$refs.loadElm,
                    color: 'dark'
                })
                */
                let order = {
                    koui: this.koui,
                    newComment: this.newComment,
                    userFullName: this.$store.getters.userFullName
                }

                this.$put('orders/' + order.koui.encounterID, order)
                .then(result => {
                    this.$vs.notification({
                        duration: 1000,
                        color: "primary",
                        position: "top-center",
                        title: "保存しました！",
                        text: "カルテのデータを通常に保存しました",
                        icon: '<i class="fas fa-info"></i>',
                    })
                    this.$emit('saved')
                })
                .catch(result => {
                    this.$apiError(result)
                })
            }
        }
    }
</script>