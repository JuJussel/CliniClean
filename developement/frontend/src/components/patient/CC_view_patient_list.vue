<template>
  <div style="height: 100%">
    <vs-row style="height: 100%">
      <vs-col w="6" style="height: 100%">
        <div class="content-card" style="height: calc(100% - 50px)">
          <vs-table striped v-model="selected">
            <template #notFound>
              <img style="width: 200px" src="../../assets/img/empty2.jpg"/>
              <div>
                <b style="color: gray">検索結果なし</b>
              </div>
            </template>
            <template #header>
              <div class="cc-table-header-content">
                <h2>患者一覧</h2>
                <vs-button
                  @click="$emit('newPatient')"
                  dark
                  v-if="$acl('patient', 2)"
                  icon
                  animation-type="scale"
                  style="min-width: 50px"
                  >
                  <i class="fas fa-plus"></i>
                  <template #animate>新規</template>
                </vs-button>
                <vs-input state="dark" placeholder="氏名又はIDで検索" :loading="loading" style="margin-left: 20px" v-model="search">
                  <template #icon>
                    <i class="fas fa-search"></i>
                  </template>
                </vs-input>
              </div>
            </template>
            <template #thead>
              <vs-tr>
                <vs-th>患者番号</vs-th>
                <vs-th>名前</vs-th>
                <vs-th>生年月日</vs-th>
                <vs-th></vs-th>
              </vs-tr>
            </template>
            <template #tbody>
                <vs-tr v-for="(tr, i) in searchResults" :key="i" :data="tr" :is-selected="selected == tr">
                  <vs-td> {{ tr.id }} </vs-td>
                  <vs-td> {{ tr.name }} </vs-td>
                  <vs-td><date-display :date="tr.birthdate"></date-display></vs-td>
                  <vs-td>
                    <span style="display: flex">
                      <vs-button v-if="$acl('reception', 2)" shadow style="width: 60px" @click="reception(tr)">受付</vs-button>
                      <vs-button v-if="$acl('reception', 2)" shadow style="width: 60px" @click="reservation(tr)">予約</vs-button>
                      <vs-button shadow style="width: 60px" @click="showDetails(tr)">詳細</vs-button>
                    </span>
                  </vs-td>
                </vs-tr>
            </template>
          </vs-table>
    
        </div>
      </vs-col>
      <vs-col w="6" style="height: 100%">
        <div style="height: calc(100% - 50px)">
          <patientView preview v-if="selected" :data="selected" :key="selected.id"></patientView>
        </div>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>

import patientView from './CC_view_patient_view'

export default {

  components: {
    patientView: patientView
  },
  data() {
    return {
      search: '',
      searchResults: [],
      selected: null,
      loading: false
    }
  },
  watch: {
    search() {
      this.doSearch()
    }
  },
  methods: {
    doSearch() {
      if (this.search === '') {
        this.searchResults =[]
        return
      }
      this.loading = true
      let search = this.search
      this.$get('patients', search)
      .then(result => {
        this.searchResults = result.data
        this.loading = false
      })
      .catch(result => {
        this.$apiError(result)
        this.loading = false
      })
    },
    reception() {

    },
    reservation() {

    },
    showDetails(pat) {
      this.$emit('showDetails', pat)
    }
  }
}
</script>

<style>

</style>