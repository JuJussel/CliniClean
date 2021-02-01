<template>
    <div>
        <div>
            <vs-table v-model="selectedItem" :adaptive="list">
                <template #header>
                    <div class="cc-table-header-content" style="margin-bottom: 0px">
                        <div>
                            <span><b>オルカID: {{ item.patientID }}</b></span>
                        </div>
                        <vs-button dark :loading="refreshingBill" @click="refreshBill" style="margin-left: 10px">再チェック</vs-button>
                    </div>
                </template>
                <template #notFound>
                    <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
                    <div>
                    <b style="color: gray">データなし</b>
                    </div>
                </template>
                <template #thead>
                    <vs-tr>
                        <vs-th style="width: 60px">伝票番号</vs-th>
                        <vs-th  style="width: 80px">保険組合せ番号</vs-th>
                        <vs-th style="width: 50px">金額（円）</vs-th>
                    </vs-tr>
                </template>
                <template #tbody>
                    <vs-tr v-for="tr in list" :key="tr.Invoice_Number" :data="tr" :is-selected="selectedItem == tr">
                        <vs-td> {{ tr.Invoice_Number }} </vs-td>
                        <vs-td> {{ tr.Insurance_Combination_Number }} </vs-td>
                        <vs-td> {{ tr.Cd_Information.Ac_Money }} </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-if="selectedItem" style="margin-top: 40px">
            <vs-input icon-after readonly label="今回の患者負担額" v-model="amount">
                <template #icon>
                    <i class="fas fa-yen-sign"></i>
                </template>
            </vs-input>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-right: 15px">
                <vs-input icon-after type="number" label="入金額" v-model="form.received" style="width: 170px">
                    <template #icon>
                        <i class="fas fa-yen-sign"></i>
                    </template>
                </vs-input>
                <vs-button shadow @click="form.received=1000" style="height: 35px">１千</vs-button>
                <vs-button shadow @click="form.received=5000" style="height: 35px">５千</vs-button>
                <vs-button shadow @click="form.received=10000" style="height: 35px">１万</vs-button>
            </div>
            <vs-input icon-after readonly label="おつり" v-model="paymentChange">
                <template #icon>
                    <i class="fas fa-yen-sign"></i>
                </template>
            </vs-input>
        </div>
        <div class="cc-dialog-footer">
            <vs-button transparent dark @click="cancel">キャンセル</vs-button>
            <vs-button  :loading="insertingPayment" :disabled="!paymentChange || paymentChange === ''" @click="confirmPayment">保存</vs-button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'item'
    ],
    data() {
        return {
            readyForBill: false,
            form: {
                amount: null,
                received: ''
            },
            refreshingBill: false,
            insertingPayment: false,
            selectedItem: null,
            list: []
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        confirmPayment() {

            this.insertingPayment = true
            let sendData = {
                bill: this.selectedItem,
                encounter: this.item,
                amount: this.amount,
                received: this.form.received
            }

            this.$post('payments', sendData)
            .then(result => {
                this.insertingPayment = false
                this.$vs.notification({
                    duration: 2000,
                    color: "primary",
                    position: "top-center",
                    title: "保存しました！",
                    text: "通常に保存しました",
                    icon: '<i class="fas fa-info"></i>',
                })
                this.$emit('done')
            })

        },
        blank () {
            return
        },
        refreshBill() {
            this.readyForBill = false;
            this.refreshingBill = true;

            this.$get('payments/' + this.item.patientID)
            .then(result => {
                console.log(result);
                if (result.data.done) {
                    this.readyForBill = true
                    this.list = result.data.items
                }
                this.refreshingBill = false
            })
            .catch(result => {
                this.$apiError(result)
            })

        }
    },
    created() {
        this.refreshBill()
    },
    computed: {
        paymentChange () {
            if (this.selectedItem) {
                let change = this.form.received - this.selectedItem.Cd_Information.Ac_Money
                if (change < 0) {
                    change = 0
                }
                return change                
            } else {
                return 0
            }
        },
        amount () {
            return Number(this.selectedItem.Cd_Information.Ac_Money)
        }
    }
}
</script>

<style>
    .check {
        display: flex;
        margin-bottom: 10px;
        justify-content: space-between;
        align-items: center;
    }
</style>
