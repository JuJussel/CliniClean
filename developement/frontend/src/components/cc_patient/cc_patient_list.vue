<template>
  <div class="cc-patient-list-main-cont">
    <cui-card>
      <patientList @selected="showPatientQuick"></patientList>
    </cui-card>
    <cui-card></cui-card>
  </div>
</template>

<script>
import patientList from "../shared/cc_shared_patient_list.vue";

export default {
  components: {
    patientList,
  },
  data() {
    return {
      loading: {},
      patienrData: null
    };
  },
  methods: {
    async showPatientQuick(id) {
      this.patientData = await this.dataService().get.patient.details(id)
    }
  }
};
</script>

<style scoped>
.cc-patient-list-main-cont {
  height: 100%;
  display: flex;
}
</style>