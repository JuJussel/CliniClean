<template>
    <div>
        <cui-table>
            <template #header>
                <div style="display: flex; align-items: center">
                    <h2> {{$lang.openPayments}} </h2>
                    <cui-button :label="$lang.recheck" style="margin-left: 10px" />
                </div>
                <div> {{ $lang.patientId }}: {{ encounter.patient.id }} </div>
            </template>
            <template #thead>
                <cui-th> {{ $lang.receiptNumber }} </cui-th>
                <cui-th> {{ $lang.insuranceCombinationNumber }} </cui-th>
                <cui-th> {{ $lang.costInCurrency }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.receiptNumber }} </td>
                <td> {{ row.isnureanceCombNumber }} </td>
                <td> {{ row.cost }} </td>
        </template>
        </cui-table>
        <div class="cc_reception_payment_calc">
            <div class="cc_reception_payment_calc_left">
                <cui-select
                    :label="$lang.paymentMethod"
                    style="width: 200px"
                />
            </div>
            <div class="cc_reception_payment_calc_right">
                <div>
                    <div>Cost</div>
                    <div>2000</div>
                </div>
                <div>
                    <div>Cost</div>
                    <cui-input noNote />
                </div>
                <div style="border-top: solid 1px var(--cui-gray-2)">
                    <div>Cost</div>
                    <div>2000</div>
                </div>
            </div>
        </div>
        <div class="cc_reception_payment_calc_footer">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        encounter: {
            default: null
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
    }
    .cc_reception_payment_calc_footer {
        display: flex;
        justify-content: flex-end;
    }
</style>