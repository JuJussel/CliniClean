<template>
  <cui-table
    :data="patientList"
    style="margin: -10px"
    @select="selectPatient"
    singleSelect
  >
    <template #header>
      <div style="display: flex; align-items: center">
        <h2 style="margin-right: 20px">{{ $lang.patientList }}</h2>
        <cui-input
          noNote
          darker
          @input="searchPatient"
          v-model="patientSearchInput"
          :placeholder="$lang.searchByNameodID"
          :loading="loading.patientSearch"
        ></cui-input>
        <slot name="buttons"></slot>
      </div>
    </template>
    <template #thead>
      <cui-th> {{ $lang.patientId }} </cui-th>
      <cui-th> {{ $lang.name }} </cui-th>
      <cui-th> {{ $lang.birthdate }} </cui-th>
      <cui-th></cui-th>
    </template>
    <template v-slot:row="{ row }">
      <td>{{ row.id }}</td>
      <td>{{ row.name }}</td>
      <td>{{ $moment(row.birthdate).format("YYYY年MM月DD日") }}</td>
      <td></td>
    </template>
  </cui-table>
</template>

<script>
export default {
  emits: ['selected'],
  data() {
    return {
      patientList: [],
      patientSearchInput: "",
      loading: {
        patientList: false,
      },
    };
  },
  methods: {
    async searchPatient() {
      let input = this.patientSearchInput;
      if (input === "") {
        this.patientList = [];
        return;
      }
      this.patientList = await this.$dataService().get.patient.search({ name: input, id: input })
    },
    selectPatient(pat) {
      this.$emit('selected', pat.row.id)
    },
  },
};
</script>

<style scoped>
.cc-patient-list-main-cont {
  height: 100%;
  display: flex;
}
</style>