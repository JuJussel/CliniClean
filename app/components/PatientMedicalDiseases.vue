<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ModalPatientDiseases } from "#components";

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
const diseases = ref([]);
const isActiveEncounter = ref(false);

const encounterId = computed(() => route.query.encounterId);

// Fetch patient diseases from API
async function fetchDiseases() {
  isLoading.value = true;
  try {
    const response = await $fetch(`/api/patient/${props.patientId}/disease`);
    if (response && response.success) {
      diseases.value = response.data || [];
    } else {
      throw new Error("Failed to fetch diseases");
    }
  } catch (error) {
    console.error("Error fetching diseases:", error);
    toast.add({
      title: t("error"),
      description: t("diseaseFetchError"),
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

// Watch encounterId change to check if registration button should be enabled
watch(encounterId, checkEncounterStatus, { immediate: true });

onMounted(() => {
  fetchDiseases();
});

// Open Add Disease modal overlay
async function openAddDiseaseModal() {
  if (!encounterId.value) return;
  const diseaseModal = overlay.create(ModalPatientDiseases, {
    destroyOnClose: true,
  });
  await diseaseModal.open({
    patientId: props.patientId,
    encounterId: encounterId.value,
  });
  await fetchDiseases();
}

// Table columns
const columns = computed(() => [
  { accessorKey: "Disease_Name", header: t("diseaseName") },
  { accessorKey: "Disease_StartDate", header: t("diseaseStartDate") },
  { accessorKey: "Disease_EndDate", header: t("diseaseEndDate") },
  { accessorKey: "Disease_OutCome", header: t("diseaseOutcome") },
  { accessorKey: "Disease_SuspectedFlag", header: t("diseaseSuspectOrAcute") },
  { accessorKey: "Disease_Supplement_Name", header: t("diseaseDescription") },
]);

// ECharts timeline option
const chartOption = computed(() => {
  if (diseases.value.length === 0) return {};

  // Extract unique disease names for Y-axis categories
  const uniqueNames = [
    ...new Set(diseases.value.map((d) => d.Disease_Name)),
  ].reverse();

  // Calculate dynamic axis bounds to prevent scaling issues in custom charts
  const startTimes = diseases.value.map((d) => dayjs(d.Disease_StartDate).valueOf());
  const endTimes = diseases.value.map((d) => d.Disease_EndDate ? dayjs(d.Disease_EndDate).valueOf() : dayjs().valueOf());
  
  const minTime = Math.min(...startTimes);
  const maxTime = Math.max(...endTimes);
  
  const range = maxTime - minTime;
  const padding = range > 0 ? range * 0.05 : 24 * 60 * 60 * 1000; // default 1 day padding
  
  const xAxisMin = minTime - padding;
  const xAxisMax = maxTime + padding;

  const chartData = diseases.value.map((d) => {
    const catIdx = uniqueNames.indexOf(d.Disease_Name);
    const start = dayjs(d.Disease_StartDate).valueOf();
    const end = d.Disease_EndDate
      ? dayjs(d.Disease_EndDate).valueOf()
      : dayjs().valueOf();

    // Color coding depending on outcome flag
    let color = "#3b82f6"; // Blue (Active)
    if (d.Disease_OutCome === "F") {
      color = "#10b981"; // Green (Healed)
    } else if (d.Disease_OutCome === "D") {
      color = "#ef4444"; // Red (Death)
    } else if (d.Disease_OutCome === "C") {
      color = "#f59e0b"; // Orange (Discontinued)
    } else if (d.Disease_OutCome === "S") {
      color = "#8b5cf6"; // Purple (Transitioned)
    }

    return {
      name: d.Disease_Name,
      value: [
        catIdx,
        start,
        end,
        d.Disease_StartDate,
        d.Disease_EndDate || t("diseaseStatusActive"),
        d.Disease_OutCome,
      ],
      itemStyle: {
        color,
      },
    };
  });

  return {
    tooltip: {
      trigger: "item",
      backgroundColor: "var(--ui-bg-elevated, rgba(255, 255, 255, 0.95))",
      borderColor: "var(--ui-border, #e2e8f0)",
      borderWidth: 1,
      textStyle: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
      extraCssText:
        "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 8px; padding: 10px;",
      formatter: (params) => {
        const [_, startVal, endVal, startStr, endStr, outcome] = params.value;
        const outcomeText = outcome
          ? t(`diseaseOutcomeFlags.${outcome}`)
          : t("diseaseStatusActive");
        return `
                    <div class="p-1">
                        <div class="font-bold text-neutral-800 dark:text-neutral-200 mb-1">${params.name}</div>
                        <div class="text-xs text-neutral-500 dark:text-neutral-400">${t("diseaseStartDate")}: ${startStr}</div>
                        <div class="text-xs text-neutral-500 dark:text-neutral-400">${t("diseaseEndDate")}: ${endStr}</div>
                        <div class="text-xs text-neutral-500 dark:text-neutral-400">${t("diseaseOutcome")}: ${outcomeText}</div>
                    </div>
                `;
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      top: "5%",
      bottom: "15%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      min: xAxisMin,
      max: xAxisMax,
      boundaryGap: false,
      axisLabel: {
        color: "#64748b",
        fontSize: 10,
        fontFamily: "Inter, sans-serif",
      },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
        },
      },
    },
    yAxis: {
      type: "category",
      data: uniqueNames,
      axisLabel: {
        color: "#64748b",
        fontSize: 11,
        fontFamily: "Inter, sans-serif",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
        },
      },
    },
    series: [
      {
        type: "custom",
        coordinateSystem: "cartesian2d",
        renderItem: (params, api) => {
          const categoryIndex = api.value(0);
          const start = api.coord([api.value(1), categoryIndex]);
          const end = api.coord([api.value(2), categoryIndex]);
          const height = 24;

          const barWidth = Math.max(end[0] - start[0], 6);

          console.log("[ECharts renderItem Debug]", {
            categoryIndex,
            val1: api.value(1),
            val2: api.value(2),
            start,
            end,
            barWidth,
          });

          return {
            type: "rect",
            shape: {
              x: start[0],
              y: start[1] - height / 2,
              width: barWidth,
              height: height,
              r: 4,
            },
            style: api.style(),
          };
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: chartData,
      },
    ],
  };
});
</script>

<template>
  <div class="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
    <!-- Diseases Header and Add Disease button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols:sick-outline"
          class="text-2xl text-primary-500"
        />
        <h2 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">
          {{ $t("diseases") }}
        </h2>
      </div>
      <!-- Visible/Enabled only when active encounter (status 3) is selected -->
      <UButton
        v-if="isActiveEncounter"
        color="primary"
        icon="material-symbols:add"
        @click="openAddDiseaseModal"
      >
        {{ $t("diseaseAddButton") }}
      </UButton>
    </div>

    <!-- Diseases List Table -->
    <UCard>
      <UTable
        :loading="isLoading"
        :data="diseases"
        :columns="columns"
        class="flex-1"
      >
        <!-- Start date formatting -->
        <template #Disease_StartDate-cell="{ row }">
          <span
            class="text-xs font-medium text-neutral-600 dark:text-neutral-400"
          >
            {{ dayjs(row.original.Disease_StartDate).format("LL") }}
          </span>
        </template>

        <!-- End date formatting -->
        <template #Disease_EndDate-cell="{ row }">
          <span
            v-if="row.original.Disease_EndDate"
            class="text-xs font-medium text-neutral-600 dark:text-neutral-400"
          >
            {{ dayjs(row.original.Disease_EndDate).format("LL") }}
          </span>
          <span
            v-else
            class="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 rounded-full"
          >
            {{ $t("diseaseStatusActive") }}
          </span>
        </template>

        <!-- Outcome formatting -->
        <template #Disease_OutCome-cell="{ row }">
          <UBadge
            v-if="row.original.Disease_OutCome"
            variant="subtle"
            :color="
              row.original.Disease_OutCome === 'F'
                ? 'success'
                : row.original.Disease_OutCome === 'D'
                  ? 'error'
                  : 'warning'
            "
          >
            {{ $t(`diseaseOutcomeFlags.${row.original.Disease_OutCome}`) }}
          </UBadge>
          <span v-else class="text-neutral-400">-</span>
        </template>

        <!-- Suspect flag formatting -->
        <template #Disease_SuspectedFlag-cell="{ row }">
          <UBadge
            v-if="row.original.Disease_SuspectedFlag"
            variant="outline"
            color="neutral"
          >
            {{
              $t(`diseaseSuspectFlags.${row.original.Disease_SuspectedFlag}`)
            }}
          </UBadge>
          <span v-else class="text-neutral-400">-</span>
        </template>

        <!-- Description fallback -->
        <template #Disease_Supplement_Name-cell="{ row }">
          <span
            class="text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate max-w-xs block"
          >
            {{ row.original.Disease_Supplement_Name || "-" }}
          </span>
        </template>

        <!-- Empty State -->
        <template #empty>
          <div
            class="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-500 space-y-2"
          >
            <UIcon
              name="material-symbols:sick-outline"
              class="text-3xl text-neutral-300 dark:text-neutral-700"
            />
            <span>{{ $t("diseaseNoHistory") }}</span>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Gantt Timeline of Diseases -->
    <UCard v-if="diseases.length > 0">
      <template #header>
        <div class="flex items-center gap-1.5 text-primary-500">
          <UIcon name="material-symbols:query-stats-rounded" />
          <h3 class="text-sm font-bold tracking-wider uppercase">
            {{ $t("diseaseTimelineTitle") }}
          </h3>
        </div>
      </template>

      <div class="relative w-full h-80 overflow-hidden p-2">
        <VChart :option="chartOption" autoresize class="w-full h-full" />
      </div>
    </UCard>
  </div>
</template>
