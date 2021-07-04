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
      <patientInfo v-if="selectedPatientId" :patientId="selectedPatientId" ref="patientInfo">
        <template v-slot:buttons="{ patient }">
          <cui-button icon="fas fa-calendar-plus" :label="$lang.reservation" @click="walkinPatient(patient)"></cui-button>
          <cui-button icon="fas fa-walking" :label="$lang.reception" @click="walkinPatient(patient)"></cui-button>
          <cui-button icon="fas fa-info-circle" :label="$lang.details" @click="walkinPatient(patient)"></cui-button>
          <cui-button icon="fas fa-edit" :label="$lang.edit" @click="editPatient"></cui-button>
        </template>
      </patientInfo>
    </cui-card>
  </div>
</template>

<script>
import patientList from "../shared/cc_shared_patient_list.vue";
import patientInfo from "../shared/cc_shared_patient_info.vue"

export default {
  emits: ['newPatient', 'editPatient'],
    components: {
    patientList,
    patientInfo
    
  },
  created() {
    if (this.$store.getters.transferData.patientList) {
      this.selectedPatientId = parseInt(this.$store.getters.transferData.patientList);
    }
  },
  unmounted() {
      let transferData = {
          target: 'patientList',
          data: null
      };
      this.$store.commit('SET_TRANSFER_DATA', transferData);
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
    },
    walkinPatient(id) {
      console.log(id);
    },
    editPatient() {
      this.$emit('editPatient', this.$refs.patientInfo.patientData);
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