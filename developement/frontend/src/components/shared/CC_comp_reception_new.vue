<template>
  <div>
        <selectInput 
            @change="doSearch"
            :disabled="!$acl('reception', 2)"
            :results="searchResults"
            label="患者選択"
            placeholder="氏名又はIDで検索"
            @select="getInsurance">
            <span slot-scope="scope" >番号: {{ scope.item.id}} {{ scope.item.name }}</span>
        </selectInput>
        <vs-select
            label="診察内容"
            :disabled="!$acl('reception', 2)"
            placeholder="Select"
            v-model="shinsatuTypeSelected"
            :key="shinsatuTypes.length"
            >
            <vs-option v-for="(item, i) in shinsatuTypes" :key="i" :label="item.name" :value="i + 1">
                {{item.name}}
            </vs-option>
        </vs-select>
        <vs-input :disabled="!$acl('reception', 2)" label="メモ" v-model="memo"/>
        <vs-table v-model="insSelected" :adaptive="patientData.sets" ref="insTable" style="min-height: 151px">
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
            <vs-button @click="submit()" :disabled="!inputOK" v-if="$acl('reception', 2)">登録</vs-button>
        </div>
    </div>
</template>

<script>
export default {
    created() {

        this.$get('shinsatutypes')
        .then(result =>{
            this.shinsatuTypes = result.data
            this.shinsatuTypeSelected = result.data[0].id
        })
        .catch(result => {
            this.$apiError(result)
        })

    },
    data() {
        return {
            searchResults: [],
            selectedPatient: null,
            searchLoading: false,
            patientData: {},
            insSelected: null,
            shinsatuTypes: [],
            shinsatuTypeSelected: '',
            memo: ''
        }
    },
    computed: {
        inputOK() {
            if (this.selectedPatient && this.insSelected) {
                return true
            }
            return false
        }
    },
    methods: {
        doSearch(query) {
            if (query !== '') {
                this.searchLoading = true

                this.$get('patients', query) 
                .then(result => {
                    this.searchResults = result.data
                    this.searchLoading = false
                })
                .catch(result => {
                    this.$apiError(result)
                })

            } else {
                this.searchResults = []
            }
        },
        getInsurance(data) {
            const loading = this.$vs.loading({
                target: this.$refs.insTable,
                color: 'dark'
            })
            this.selectedPatient = data         
            this.insLoading = true
            this.patientData = {}

            this.$get('patients/' + data.id)
            .then(result => {
                this.patientData = result.data
                loading.close()
            })
            .catch(result => [
                this.$apiError(result)
            ])

        },
        submit() {
            let data = {
                patient: this.selectedPatient,
                insurance: this.insSelected,
                type: this.shinsatuTypeSelected,
                memo: this.memo
            }
            this.$emit('submit', data)
            this.$emit('cancel')
        }
    }
}
</script>

<style>

</style>