<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ModalPatientIssues } from "#components";

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
});

const toast = useToast();
const dayjs = useDayjs();
const { t } = useI18n();
const overlay = useOverlay();
const route = useRoute();

const isLoading = ref(true);
const allergiesList = ref([]);
const isActiveEncounter = ref(false);

const encounterId = computed(() => route.query.encounterId);

// Fetch patient allergies from MongoDB
async function fetchAllergies() {
  isLoading.value = true;
  try {
    const response = await $fetch(`/api/patient/${props.patientId}/allergy`);
    if (response && response.success) {
      allergiesList.value = response.data || [];
    } else {
      throw new Error("Failed to fetch allergies");
    }
  } catch (error) {
    console.error("Error fetching allergies:", error);
    toast.add({
      title: t("error"),
      description: t("issuesTab.fetchError"),
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

// Check if currently selected encounter is active (status 3)
async function checkEncounterStatus() {
  if (!encounterId.value) {
    isActiveEncounter.value = false;
    return;
  }
  try {
    const encounter = await $fetch(`/api/encounter/${encounterId.value}`);
    if (encounter && encounter.status === 3) {
      isActiveEncounter.value = true;
    } else {
      isActiveEncounter.value = false;
    }
  } catch (err) {
    console.error("Failed to check encounter status:", err);
    isActiveEncounter.value = false;
  }
}

// Watch encounterId change to check if registration buttons should be enabled
watch(encounterId, checkEncounterStatus, { immediate: true });

onMounted(() => {
  fetchAllergies();
});

// Open Add Allergy modal
async function openAddAllergyModal(category) {
  if (!encounterId.value) return;
  const allergyModal = overlay.create(ModalPatientIssues, {
    destroyOnClose: true,
  });
  await allergyModal.open({
    patientId: props.patientId,
    encounterId: encounterId.value,
    category: category,
  });
  await fetchAllergies();
}

// Separate lists for non-medicine and medicine allergies
const nonMedicineAllergies = computed(() =>
  allergiesList.value.filter((item) => item.category === "allergies"),
);

const medicineAllergies = computed(() =>
  allergiesList.value.filter((item) => item.category === "medicationAllergies"),
);

// Table columns setup
const columns = computed(() => [
  { accessorKey: "name", header: t("issuesTab.name") },
  { accessorKey: "startDate", header: t("issuesTab.startDate") },
  { accessorKey: "endDate", header: t("issuesTab.endDate") },
  { accessorKey: "severity", header: t("issuesTab.severity") },
  { accessorKey: "comment", header: t("issuesTab.comment") },
  { accessorKey: "recordedBy", header: t("issuesTab.tableRecordedBy") },
]);
</script>

<template>
  <div class="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
    <!-- Non-Medicine Allergies section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon
            name="material-symbols:warning-outline-rounded"
            class="text-2xl text-primary-500"
          />
          <h2 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            {{ $t("issuesTab.nonMedicineAllergies") }}
          </h2>
        </div>
        <UButton
          v-if="isActiveEncounter"
          icon="material-symbols:add"
          @click="openAddAllergyModal('allergies')"
        >
          {{ $t("add") }}
        </UButton>
      </div>

      <UCard>
        <UTable
          :loading="isLoading"
          :data="nonMedicineAllergies"
          :columns="columns"
          class="flex-1"
        >
          <!-- Start Date -->
          <template #startDate-cell="{ row }">
            <span
              class="text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              {{ dayjs(row.original.startDate).format("LL") }}
            </span>
          </template>

          <!-- End Date -->
          <template #endDate-cell="{ row }">
            <span
              v-if="row.original.endDate"
              class="text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              {{ dayjs(row.original.endDate).format("LL") }}
            </span>
            <span
              v-else
              class="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-full"
            >
              {{ $t("active") }}
            </span>
          </template>

          <!-- Severity Badge -->
          <template #severity-cell="{ row }">
            <UBadge
              v-if="row.original.severity"
              variant="subtle"
              :color="
                row.original.severity === 'light'
                  ? 'success'
                  : row.original.severity === 'medium'
                    ? 'warning'
                    : 'error'
              "
            >
              {{ $t(`allergySevrenity.${row.original.severity}`) }}
            </UBadge>
            <span v-else class="text-neutral-400">-</span>
          </template>

          <!-- Comment -->
          <template #comment-cell="{ row }">
            <span
              class="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-xs block"
            >
              {{ row.original.comment || "-" }}
            </span>
          </template>

          <!-- Recorded By -->
          <template #recordedBy-cell="{ row }">
            <span class="text-xs text-neutral-500">
              {{
                row.original.recordedBy
                  ? `${row.original.recordedBy.nameLast} ${row.original.recordedBy.nameFirst}`
                  : $t("vitalsTab.unknownDoctor")
              }}
            </span>
          </template>

          <!-- Empty State -->
          <template #empty>
            <div
              class="flex flex-col items-center justify-center py-8 text-neutral-400 dark:text-neutral-500 space-y-2"
            >
              <UIcon
                name="material-symbols:warning-outline-rounded"
                class="text-3xl text-neutral-300 dark:text-neutral-700"
              />
              <span>{{ $t("issuesTab.noHistory") }}</span>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>

    <!-- Medicine Allergies section -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon
            name="material-symbols:pill-outline"
            class="text-2xl text-primary-500"
          />
          <h2 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            {{ $t("issuesTab.medicineAllergies") }}
          </h2>
        </div>
        <UButton
          v-if="isActiveEncounter"
          icon="material-symbols:add"
          @click="openAddAllergyModal('medicationAllergies')"
        >
          {{ $t("add") }}
        </UButton>
      </div>

      <UCard>
        <UTable
          :loading="isLoading"
          :data="medicineAllergies"
          :columns="columns"
          class="flex-1"
        >
          <!-- Start Date -->
          <template #startDate-cell="{ row }">
            <span
              class="text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              {{ dayjs(row.original.startDate).format("LL") }}
            </span>
          </template>

          <!-- End Date -->
          <template #endDate-cell="{ row }">
            <span
              v-if="row.original.endDate"
              class="text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              {{ dayjs(row.original.endDate).format("LL") }}
            </span>
            <span
              v-else
              class="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-full"
            >
              {{ $t("active") }}
            </span>
          </template>

          <!-- Severity Badge -->
          <template #severity-cell="{ row }">
            <UBadge
              v-if="row.original.severity"
              variant="subtle"
              :color="
                row.original.severity === 'light'
                  ? 'success'
                  : row.original.severity === 'medium'
                    ? 'warning'
                    : 'error'
              "
            >
              {{ $t(`allergySevrenity.${row.original.severity}`) }}
            </UBadge>
            <span v-else class="text-neutral-400">-</span>
          </template>

          <!-- Comment -->
          <template #comment-cell="{ row }">
            <span
              class="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-xs block"
            >
              {{ row.original.comment || "-" }}
            </span>
          </template>

          <!-- Recorded By -->
          <template #recordedBy-cell="{ row }">
            <span class="text-xs text-neutral-500">
              {{
                row.original.recordedBy
                  ? `${row.original.recordedBy.nameLast} ${row.original.recordedBy.nameFirst}`
                  : $t("vitalsTab.unknownDoctor")
              }}
            </span>
          </template>

          <!-- Empty State -->
          <template #empty>
            <div
              class="flex flex-col items-center justify-center py-8 text-neutral-400 dark:text-neutral-500 space-y-2"
            >
              <UIcon
                name="material-symbols:pill-outline"
                class="text-3xl text-neutral-300 dark:text-neutral-700"
              />
              <span>{{ $t("issuesTab.noHistory") }}</span>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>
