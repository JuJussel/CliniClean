<template>
  <div>
        <vs-table v-model="insSelected" style="height: 150px" ref="insTable2" :adaptive="patientData.sets">
            <template #notFound>
                <div>
                    <b style="color: gray">患者を選択して下さし。</b>
                </div>
            </template>
            <template #thead>
            <vs-tr>
                <vs-th>セット番号</vs-th>
                <vs-th>保険</vs-th>
                <vs-th>公費１</vs-th>
                <vs-th>公費２</vs-th>
                <vs-th>公費３</vs-th>
                <vs-th>公費４</vs-th>
            </vs-tr>
            </template>
            <template #tbody>
            <vs-tr v-for="(tr, i) in patientData.sets" :key="i" :data="tr" :is-selected="insSelected == tr">
                <vs-td>{{ tr.ID }}</vs-td>
                <vs-td>{{ tr.wholeName }}</vs-td>
                <vs-td>{{ tr.pub1 }}</vs-td>
                <vs-td>{{ tr.pub2 }}</vs-td>
                <vs-td>{{ tr.pub3 }}</vs-td>
                <vs-td>{{ tr.pub4 }}</vs-td>
            </vs-tr>
            </template>
        </vs-table>
        <div class="cc-dialog-footer">
            <vs-button @click="$emit('cancel')" transparent dark>キャンセル</vs-button>
            <vs-button @click="submit()" :disabled="!inputOK">登録</vs-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        pat: {
            default () {
                return { 
                    id: '',
                    patientID: '',
                    memo: '',
                    type: ''
                }
            }
        }
    },
    mounted() {
        this.getInsurance(this.pat)
    },
    data() {
        return {
            insLoading: true,
            insSelected: false,
            patientData: {}
        }
    },
    computed: {
        inputOK() {
            if (this.insSelected) {
                return true
            }
            return false
        }
    },
    methods: {
        getInsurance(data) {
            const loading = this.$vs.loading({
                target: this.$refs.insTable2,
                color: 'dark'
            })
            this.insLoading = true
            this.patientData = {}

            this.$get('patients/' + data.patientID)
            .then(result => {
                this.patientData = result.data
                loading.close()
            })
            .catch(result => {
                this.$apiError(result)
            })
        },
        submit() {
            let data = {
                patient: {id: this.pat.patientID},
                insurance: this.insSelected,
                type: {id: this.pat.type},
                memo: this.pat.memo,
                recID: this.pat.id
            }
            this.$emit('submit', data)
            this.$emit('cancel')
        }
    }
}
</script>

<style>

</style>