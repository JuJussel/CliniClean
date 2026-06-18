<script setup>
const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
});

const items = ref([
  {
    label: $t("dashboard"),
    icon: "material-symbols:space-dashboard",
    slot: "dashboard",
  },
  {
    label: $t("basic"),
    icon: "material-symbols:medical-information-outline-rounded",
    slot: "basic",
  },
  { label: $t("risk"), icon: "material-symbols:warning", slot: "risk" },
  {
    label: $t("issues"),
    icon: "material-symbols:asterisk-rounded",
    slot: "issues",
  },
  {
    label: $t("prevVac"),
    icon: "material-symbols:syringe-outline",
    slot: "prevVac",
  },
  {
    label: $t("vitals"),
    icon: "material-symbols:vital-signs-rounded",
    slot: "vitals",
  },
  {
    label: $t("exam"),
    icon: "material-symbols:lab-research-outline-rounded",
    slot: "exam",
  },
  {
    label: $t("perscription"),
    icon: "material-symbols:pill-outline",
    slot: "perscription",
  },
  {
    label: $t("procedures"),
    icon: "material-symbols:list-alt-add-outline-rounded",
    slot: "procedures",
  },
  {
    label: $t("diseases"),
    icon: "material-symbols:sick-outline-rounded",
    slot: "diseases",
  },
  {
    label: $t("encounter"),
    icon: "material-symbols:outpatient-med-outline",
    slot: "encounter",
  },
  { label: $t("files"), icon: "material-symbols:attach-file", slot: "files" },
]);
</script>

<template>
  <UTabs
    :items="items"
    color="neutral"
    class="h-full flex flex-col min-h-0"
    :unmount-on-hide="false"
    :ui="{
      root: 'flex flex-col h-full min-h-0',
      content: 'flex-1 overflow-y-auto min-h-0',
      list: 'flex-wrap',
      indicator: 'hidden',
      trigger:
        'data-[state=active]:bg-inverted data-[state=active]:text-inverted rounded-md',
    }"
  >
    <template #basic>
      <PatientMedicalBasic :patientId="props.patientId" />
    </template>
    <template #vitals>
      <PatientMedicalVitals :patientId="props.patientId" />
    </template>
    <template #diseases>
      <PatientMedicalDiseases :patientId="props.patientId" />
    </template>
  </UTabs>
</template>
