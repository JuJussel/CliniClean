<template>
    <div class="cc-reception-payment-cont">
        <div class="loader cc_reception_payment_loader" v-if="loading.modal"/>
        <cui-table :loading="loading.table" :data="payments" singleSelect @select="selectPayment" style="height: 250px">
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2> {{$lang.openPayments}} </h2>
                    <cui-button @click="checkStatus" :label="$lang.recheck" style="margin-left: 10px" />
                </div>
                <div> {{ $lang.patientId }}: {{ encounter.patient.id }} </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.receiptNumber }} </cui-th>
                <cui-th> {{ $lang.insuranceCombinationNumber }} </cui-th>
                <cui-th> {{ $lang.costInCurrency }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.Invoice_Number }} </td>
                <td> {{ row.Insurance_Combination_Number }} </td>
                <td> {{ row.Cd_Information.Ac_Money }} </td>
            </template>
        </cui-table>
        <div class="cc_reception_payment_calc" v-if="selectedPayment">
            <div class="cc_reception_payment_calc_left">
                <cui-select
                    :label="$lang.paymentMethod"
                    style="width: 200px"
                    :data="paymentMethods"
                    displayValueProp="label"
                    returnValueProp="code"
                    v-model="selectedPaymentMethod"
                />
                <div v-if="selectedPaymentMethod === 'cash'" style="display: flex">
                    <cui-button label="1000円" @click="addMoneyIn(1000)" />
                    <cui-button label="5000円" @click="addMoneyIn(5000)" />
                    <cui-button label="1万円" @click="addMoneyIn(10000)" />
                </div>
            </div>
            <div class="cc_reception_payment_calc_right">
                <div>
                    <h2> {{ $lang.paymentSum }} </h2>
                    <h2> {{ selectedPayment.Cd_Information.Ac_Money }} </h2>
                </div>
                <div>
                    <div> {{ $lang.paymentMoneyReceived }} </div>
                    <cui-input 
                        noNote 
                        :append="$lang.currencySymbol"
                        :disabled="selectedPaymentMethod !== 'cash'"
                        v-model="moneyIn"
                        type="number"
                    />
                </div>
                <div style="border-top: solid 1px var(--cui-gray-2)">
                    <div> {{ $lang.paymentChange }} </div>
                    <div> {{ change }} </div>
                </div>
            </div>
        </div>
        <div class="cc_reception_payment_calc_footer">
            <cui-button @click="$emit('close')" plain :label="$lang.cancel" />
            <cui-button 
                @click="savePayment" 
                primary 
                :label="$lang.confirm"
                :disabled="paymentDisabled" />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        encounter: {
            default: null
        }
    },
    emits: ['close', 'submitted'],
    mounted() {
        this.checkStatus();
    },
    data() {
        return {
            loading: {
                table: false,
                modal: false
            },
            paymentMethods: this.$store.getters.settings.paymentMethods.public,
            selectedPaymentMethod: 'cash',
            moneyIn: null,
            payments: [],
            selectedPayment: null
        }
    },
    computed: {
        change() {
            if (!this.moneyIn) return null
            return this.moneyIn - this.selectedPayment.Cd_Information.Ac_Money;
        },
        paymentDisabled() {
            return !this.moneyIn || this.change < 0
        }
    },
    methods: {
        async checkStatus() {
            this.loading.table = true;
            let date = this.$dayjs().format('YYYY-MM-DD');
            let patient = this.encounter.patient.id;
            this.payments = await this.$dataService().get.patient.payments(patient, date);
            this.loading.table = false;
        },
        selectPayment(row) {
            this.selectedPayment = row.row;
        },
        addMoneyIn(amount) {
            if (!this.moneyIn) {
                this.moneyIn = amount;
            } else {
                this.moneyIn = this.moneyIn + amount;
            }
        },
        async savePayment() {
            this.loading.modal = true;
            let encounter = JSON.parse(JSON.stringify(this.encounter));
            encounter.status = 0;
            encounter.payment = {
                amountDue: parseInt(this.selectedPayment.Cd_Information.Ac_Money),
                moneyIn: this.moneyIn,
                change: this.change,
                method: this.selectedPaymentMethod
            }
            await this.$dataService().put.encounters(encounter);
            this.$emit('submitted');
            this.$emit('close');

        }
    }
    
}
</script>

<style scoped>
    .cc_reception_payment_calc {
        display: grid;
        grid-template-columns: 50% 50%;
        margin-top: 20px
    }
    .cc_reception_payment_calc > div {
        padding: 10px;
    }
    .cc_reception_payment_calc_right {
        margin-top: 27px;
    }
    .cc_reception_payment_calc_right > div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
    }
    .cc_reception_payment_calc_footer {
        display: flex;
        justify-content: flex-end;
    }
    .cc_reception_payment_loader {
        margin: 10px;
        border-radius: 20px;
        width: calc(100% - 20px);
        height: calc(100% - 20px)
    }
    .cc-reception-payment-cont {
        height: 100%; 
        display: flex; 
        flex-direction: column;
        justify-content: space-between;
    }
</style>