<template>
  <div class="cc-patient-list-main-cont">
    <cui-card>
      <patientList @selected="showPatientQuick">
        <template #buttons>
          <cui-button icon="fas fa-user-plus" :label="$lang.createNew" @click="newPatient" />
        </template>
      </patientList>
    </cui-card>
    <cui-card noPadding>
      <patientInfo v-if="selectedPatientId" :patientId="selectedPatientId">
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
  created() {
    if (this.$store.getters.transferData.patientList) {
      this.selectedPatientId = parseInt(this.$store.getters.transferData.patientList);
    }
  },
  data() {
    return {
      loading: {},
      patientData: null,
      selectedPatientId: null
    };
  },
  methods: {
    showPatientQuick(id) {
      this.selectedPatientId = parseInt(id);
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