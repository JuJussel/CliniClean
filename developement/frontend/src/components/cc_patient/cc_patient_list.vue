<template>
  <div class="cc-patient-list-main-cont">
    <cui-card>
      <patientList @selected="showPatientQuick"></patientList>
    </cui-card>
    <cui-card noPadding>
      <patientInfo></patientInfo>
    </cui-card>
  </div>
</template>

<script>
import patientList from "../shared/cc_shared_patient_list.vue";
import patientInfo from "../shared/cc_shared_patient_info.vue"

export default {
  components: {
    patientList,
    patientInfo
  },
  data() {
    return {
      loading: {},
    };
  },
  methods: {
    async showPatientQuick(id) {
      const patientInfo = await this.getPatientInfo(id);
      console.log(patientInfo);
    },
  },
  getPatientInfo(id) {
    this.$api.get.patient.details(id)
      .then((res) => {
        this.loading.patientDetails = false;
        this.patientDetails = res;
      })
      .catch((res) => {
        this.loading.patientDetails = false;
        this.$apiError(res.statusText);
      });
  },
};
</script>

<style scoped>
.cc-patient-list-main-cont {
  height: 100%;
  display: flex;
}
</style>