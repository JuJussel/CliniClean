<template>
  <div class="cc-patient-list-main-cont">
    <cui-card>
      <patientList @selected="showPatientQuick">
        <template #buttons>
          <cui-button :label="$lang.createNew" @click="newPatient" />
        </template>
      </patientList>
    </cui-card>
    <cui-card noPadding>
      <patientInfo>
      </patientInfo>
    </cui-card>
  </div>
</template>

<script>
import patientList from "../shared/cc_shared_patient_list.vue";
import patientInfo from "../shared/cc_shared_patient_info.vue"

export default {
  emits: ['newPatient'],
  components: {
    patientList,
    patientInfo
  },
  data() {
    return {
      loading: {},
      patienrData: null
    };
  },
  methods: {
    async showPatientQuick(id) {
      this.patientData = await this.$dataService().get.patient.details(id)
    },
    newPatient() {
      this.$emit('newPatient')
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