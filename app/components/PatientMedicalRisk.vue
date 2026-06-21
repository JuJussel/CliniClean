<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ModalPatientRisk } from "#components";

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
});

const toast = useToast();
const dayjs = useDayjs();
const { t } = useI18n();
const route = useRoute();
const systemStore = useSystemStore();
const overlay = useOverlay();

const isLoading = ref(true);
const riskHistory = ref([]);
const activeRecordId = ref(null);
const isActiveEncounter = ref(false);
const isHistoryCollapsed = ref(false);
const expanded = ref({});
const chartTypes = ref({});

const encounterId = computed(() => route.query.encounterId);

// Group definitions
const tobaccoCodes = [
  "MD0012870",
  "MD0012880",
  "MD0012890",
  "MD0012900",
  "MD0012910",
  "MD0012920",
];
const alcoholCodes = [
  "MD0012930",
  "MD0012940",
  "MD0012950",
  "MD0012960",
  "MD0012970",
];

// Form data holds the active values for the 25 risk codes
const formData = ref({});

// Fetch risk factors metadata from store or fallback
const socialRisks = computed(() => {
  return systemStore.system?.ui?.socialRisks || [];
});

// Table columns setup
const columns = computed(() => {
  const cols = [
    { accessorKey: "expand", header: "" },
    { accessorKey: "title", header: t("riskTab.tableHeaderTitle") },
    { accessorKey: "value", header: t("riskTab.tableHeaderValue") },
  ];
  if (isActiveEncounter.value) {
    cols.push({ accessorKey: "actions", header: "" });
  }
  return cols;
});

// Grouped table data computed property
const tableData = computed(() => {
  const list = [];
  let addedTobacco = false;
  let addedAlcohol = false;

  socialRisks.value.forEach((risk) => {
    if (tobaccoCodes.includes(risk.Code)) {
      if (!addedTobacco) {
        // Check if any tobacco item has data
        const hasData = tobaccoCodes.some(
          (code) =>
            formData.value[code] !== undefined &&
            formData.value[code] !== null &&
            formData.value[code] !== "",
        );
        if (hasData) {
          list.push({
            Code: "Group_Tobacco",
            Display: t("riskTab.sections.smoking"),
            Definition: t("riskTab.sections.smoking"),
          });
          addedTobacco = true;
        }
      }
    } else if (alcoholCodes.includes(risk.Code)) {
      if (!addedAlcohol) {
        // Check if any alcohol item has data
        const hasData = alcoholCodes.some(
          (code) =>
            formData.value[code] !== undefined &&
            formData.value[code] !== null &&
            formData.value[code] !== "",
        );
        if (hasData) {
          list.push({
            Code: "Group_Alcohol",
            Display: t("riskTab.sections.drinking"),
            Definition: t("riskTab.sections.drinking"),
          });
          addedAlcohol = true;
        }
      }
    } else {
      // Normal items
      const val = formData.value[risk.Code];
      if (val !== undefined && val !== null && val !== "") {
        list.push(risk);
      }
    }
  });

  return list;
});

// Helper to filter history for a specific code or group
function getItemHistory(code) {
  if (!riskHistory.value) return [];
  if (code === "Group_Tobacco") {
    return getGroupHistory("tobacco");
  }
  if (code === "Group_Alcohol") {
    return getGroupHistory("alcohol");
  }
  return riskHistory.value
    .map((record) => {
      const val = record.values?.[code];
      return {
        id: record._id,
        date: record.date,
        recordedBy: record.recordedBy,
        value: val,
      };
    })
    .filter((item) => item.value !== undefined && item.value !== "");
}

// Helper to compile group history snapshots
function getGroupHistory(type) {
  const codes = type === "tobacco" ? tobaccoCodes : alcoholCodes;
  if (!riskHistory.value) return [];
  return riskHistory.value
    .map((record) => {
      const groupValues = {};
      let hasData = false;
      codes.forEach((code) => {
        const val = record.values?.[code];
        if (val !== undefined && val !== null && val !== "") {
          groupValues[code] = val;
          hasData = true;
        }
      });
      if (!hasData) return null;
      return {
        id: record._id,
        date: record.date,
        recordedBy: record.recordedBy,
        values: groupValues,
      };
    })
    .filter((item) => item !== null);
}

// Presence options for 有無 fields
const presenceOptions = [
  { value: "", label: t("riskTab.yesNo.unregistered") },
  { value: "有", label: t("riskTab.yesNo.present") },
  { value: "無", label: t("riskTab.yesNo.absent") },
];

// Helper to determine if a code is a tags-input field
function isTagsField(code) {
  if (!code) return false;
  if (code === "MD0012770") return false; // Birthplace
  if (tobaccoCodes.includes(code) || alcoholCodes.includes(code)) return false;
  if (code === "Group_Tobacco" || code === "Group_Alcohol") return false;
  return true;
}

// Helper to split tag strings into arrays
function getTags(val) {
  if (!val) return [];
  return val.split(/\s*,\s*|\s*、\s*/).filter(Boolean);
}

// Helper to get presence option label
function getPresenceLabel(val) {
  const opt = presenceOptions.find((o) => o.value === val);
  return opt ? opt.label : val;
}

// Helper to get labels dynamically
function getLabelForCode(code) {
  const risk = socialRisks.value.find((r) => r.Code === code);
  return risk ? risk.Display.replace(".有無", "") : code;
}

// Helper to format values with units
function formatValue(code, val) {
  if (["MD0012870", "MD0012880", "MD0012930", "MD0012940"].includes(code)) {
    return getPresenceLabel(val);
  }
  if (code === "MD0012900" && val) {
    return `${val} ${t("countStick")}/日`;
  }
  if (code === "MD0012960" && val) {
    return `${val} ml/日`;
  }
  if (["MD0012910", "MD0012970"].includes(code) && val) {
    return `${val}年`;
  }
  return val;
}

// Fetch patient risks history
async function fetchRiskHistory() {
  isLoading.value = true;
  try {
    const response = await $fetch(`/api/patient/${props.patientId}/risk`);
    if (response && response.success) {
      riskHistory.value = response.data || [];
      if (riskHistory.value.length > 0) {
        // Pre-fill form with the latest entry
        loadRecord(riskHistory.value[0]);
      } else {
        // Initialize empty form
        resetForm();
      }
    } else {
      throw new Error("Failed to fetch risk factors");
    }
  } catch (error) {
    console.error("Error fetching risk history:", error);
    toast.add({
      title: t("error"),
      description: t("riskTab.fetchError"),
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

// Load values from a specific record in the history
function loadRecord(record) {
  activeRecordId.value = record._id;
  formData.value = { ...record.values };
  // Pre-fill missing values as empty strings
  socialRisks.value.forEach((risk) => {
    if (formData.value[risk.Code] === undefined) {
      formData.value[risk.Code] = "";
    }
  });
}

// Reset form to blank defaults
function resetForm() {
  activeRecordId.value = null;
  const initialValues = {};
  socialRisks.value.forEach((risk) => {
    initialValues[risk.Code] = "";
  });
  formData.value = initialValues;
}

// Open modal to register a new item
async function openRegisterModal() {
  if (!isActiveEncounter.value || !encounterId.value) return;
  const riskModal = overlay.create(ModalPatientRisk, {
    destroyOnClose: true,
  });
  await riskModal.open({
    patientId: props.patientId,
    encounterId: encounterId.value,
    currentValues: formData.value,
  });
  await fetchRiskHistory();
}

// Open modal to edit an existing item
async function openEditModal(riskCode) {
  if (!isActiveEncounter.value || !encounterId.value) return;
  const riskModal = overlay.create(ModalPatientRisk, {
    destroyOnClose: true,
  });
  await riskModal.open({
    patientId: props.patientId,
    encounterId: encounterId.value,
    currentValues: formData.value,
    editCode: riskCode,
  });
  await fetchRiskHistory();
}

// Helper to determine field input types
function getFieldType(code) {
  if (
    [
      "MD0012790",
      "MD0012810",
      "MD0012820",
      "MD0012830",
      "MD0012990",
      "MD0013000",
    ].includes(code)
  ) {
    return "textarea";
  }
  if (["MD0012870", "MD0012880", "MD0012930", "MD0012940"].includes(code)) {
    return "select";
  }
  return "text";
}

// Watch encounterId change to check status
watch(encounterId, checkEncounterStatus, { immediate: true });

// Helper to determine if a code has a numerical type
function isNumerical(code) {
  if (["Group_Tobacco", "Group_Alcohol"].includes(code)) return true;
  return [
    "MD0012900",
    "MD0012910",
    "MD0012920",
    "MD0012960",
    "MD0012970",
  ].includes(code);
}

// Check if a risk factor has history data
function hasHistory(code) {
  if (code === "Group_Tobacco") {
    return getGroupHistory("tobacco").length > 0;
  }
  if (code === "Group_Alcohol") {
    return getGroupHistory("alcohol").length > 0;
  }
  return riskHistory.value.some((record) => {
    const val = record.values?.[code];
    return val !== undefined && val !== null && val !== "";
  });
}

// Get chronologically sorted history data for line chart plotting
function getChartDataForCode(code) {
  if (!code) return [];
  // Sort oldest first for ECharts line graph plotting
  return riskHistory.value
    .map((record) => {
      const rawVal = record.values?.[code];
      const parsed = parseFloat(rawVal);
      return {
        date: record.date,
        value: parsed,
        raw: rawVal,
      };
    })
    .filter((item) => !isNaN(item.value))
    .reverse();
}

// Generate ECharts option for a specific code
function getChartOptionForCode(code, chartType = "line") {
  // Determine which codes to plot
  let codes = [];
  if (code === "Group_Tobacco") {
    codes = ["MD0012900", "MD0012910", "MD0012920"];
  } else if (code === "Group_Alcohol") {
    codes = ["MD0012960", "MD0012970"];
  } else {
    codes = [code];
  }

  // Filter history to records that have at least one numerical value for the codes
  const sortedHistory = riskHistory.value
    .filter(record => {
      return codes.some(c => {
        const val = parseFloat(record.values?.[c]);
        return !isNaN(val);
      });
    })
    .slice()
    .reverse(); // oldest first

  if (sortedHistory.length === 0) return {};

  const xAxisData = sortedHistory.map(d => dayjs(d.date).format("YYYY-MM-DD HH:mm"));
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];
  const isBar = chartType === "bar";

  const series = codes.map((c, index) => {
    const label = getLabelForCode(c);
    const seriesData = sortedHistory.map(record => {
      const val = parseFloat(record.values?.[c]);
      return isNaN(val) ? null : val;
    });

    return {
      name: label,
      type: chartType,
      data: seriesData,
      connectNulls: true,
      smooth: true,
      showSymbol: true,
      symbol: "circle",
      symbolSize: 8,
      barMaxWidth: 30,
      itemStyle: {
        color: colors[index % colors.length],
        borderRadius: isBar ? [4, 4, 0, 0] : 0,
      },
      lineStyle: isBar
        ? undefined
        : {
            width: 3,
            color: colors[index % colors.length],
          },
      areaStyle: isBar || codes.length > 1
        ? undefined
        : {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[index % colors.length] + "1a" },
                { offset: 1, color: colors[index % colors.length] + "00" }
              ],
            },
          },
    };
  });

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: "var(--ui-bg-elevated, rgba(255, 255, 255, 0.95))",
      borderColor: "var(--ui-border, #e2e8f0)",
      borderWidth: 1,
      textStyle: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
      extraCssText:
        "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 8px; padding: 10px;",
      formatter: (params) => {
        let html = `<div class="font-bold text-xs mb-1 text-neutral-800 dark:text-neutral-200">${params[0].axisValue}</div>`;
        params.forEach(p => {
          const sCode = codes[p.seriesIndex];
          let unit = "";
          if (sCode === "MD0012900") unit = ` ${t("countStick")}/日`;
          else if (sCode === "MD0012960") unit = " ml/日";
          else if (["MD0012910", "MD0012970"].includes(sCode)) unit = ` ${t("year")}`;

          html += `
            <div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span class="flex items-center gap-1.5 font-medium text-neutral-500 dark:text-neutral-400">
                <span class="inline-block w-2.5 h-2.5 rounded-full" style="background-color: ${p.color}"></span>
                ${p.seriesName}
              </span>
              <span class="font-bold text-neutral-800 dark:text-neutral-100">${p.value !== null && p.value !== undefined ? p.value + unit : "-"}</span>
            </div>
          `;
        });
        return html;
      },
    },
    legend: codes.length > 1 ? {
      show: true,
      top: "0%",
      textStyle: {
        color: "#64748b",
        fontSize: 10
      }
    } : undefined,
    grid: {
      top: codes.length > 1 ? "18%" : "12%",
      left: "3%",
      right: "4%",
      bottom: "12%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: isBar,
      data: xAxisData,
      axisLabel: {
        color: "#64748b",
        fontSize: 10,
        fontFamily: "Inter, system-ui, sans-serif",
      },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
        },
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLabel: {
        color: "#64748b",
        fontSize: 10,
        fontFamily: "Inter, system-ui, sans-serif",
      },
      splitLine: {
        lineStyle: {
          color: "rgba(226, 232, 240, 0.4)",
          type: "dashed",
        },
      },
    },
    series,
  };
}

// Generate vertical timeline items for a specific code
function getTimelineItemsForCode(code) {
  if (!code) return [];

  if (code === "Group_Tobacco" || code === "Group_Alcohol") {
    const type = code === "Group_Tobacco" ? "tobacco" : "alcohol";
    const history = getGroupHistory(type);
    return history.map((h) => {
      const doctorName = h.recordedBy
        ? `${h.recordedBy.nameLast} ${h.recordedBy.nameFirst}`
        : t("unknownDoctor");

      const codes = type === "tobacco" ? tobaccoCodes : alcoholCodes;
      const valuesStr = Object.entries(h.values)
        .map(([c, v]) => `${getLabelForCode(c)}: ${formatValue(c, v)}`)
        .join(" / ");

      return {
        date: dayjs(h.date).format("YYYY-MM-DD HH:mm"),
        title: valuesStr,
        description: doctorName,
        icon: "material-symbols:edit-document-outline-rounded",
      };
    });
  }

  return riskHistory.value
    .map((record) => {
      const rawVal = record.values?.[code];
      if (rawVal === undefined || rawVal === null || rawVal === "") return null;

      const formattedVal = formatValue(code, rawVal);
      const doctorName = record.recordedBy
        ? `${record.recordedBy.nameLast} ${record.recordedBy.nameFirst}`
        : t("unknownDoctor");

      return {
        date: dayjs(record.date).format("YYYY-MM-DD HH:mm"),
        title: formattedVal,
        description: doctorName,
        icon: "material-symbols:edit-document-outline-rounded",
      };
    })
    .filter((item) => item !== null);
}

onMounted(() => {
  fetchRiskHistory();
});
</script>

<template>
  <div class="h-full flex flex-col p-4 space-y-4">
    <!-- Header status alert -->
    <div
      v-if="!isActiveEncounter"
      class="bg-warning-50 dark:bg-warning-950/20 border border-warning-200 dark:border-warning-800/40 rounded-lg p-3 text-sm text-warning-700 dark:text-warning-300 flex items-center gap-2"
    >
      <UIcon
        name="material-symbols:warning-outline"
        class="w-5 h-5 flex-shrink-0"
      />
      <span>{{ t("riskTab.activeEncounterRequired") }}</span>
    </div>

    <!-- Main Layout Grid -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
      <!-- Left side: Form Panel -->
      <div
        :class="[
          'flex flex-col min-h-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm',
          isHistoryCollapsed ? 'lg:col-span-4' : 'lg:col-span-3',
        ]"
      >
        <!-- Panel Header -->
        <div
          class="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/50 rounded-t-xl"
        >
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-neutral-800 dark:text-neutral-200">
              {{ t("riskTab.title") }}
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              v-if="isActiveEncounter"
              icon="material-symbols:add"
              size="xs"
              color="primary"
              @click="openRegisterModal"
            >
              {{ t("riskTab.registerNewItem") }}
            </UButton>
            <UButton
              icon="material-symbols:history"
              size="xs"
              color="neutral"
              variant="subtle"
              @click="isHistoryCollapsed = !isHistoryCollapsed"
            >
              {{
                isHistoryCollapsed
                  ? t("riskTab.showHistory")
                  : t("riskTab.hideHistory")
              }}
            </UButton>
          </div>
        </div>
        <!-- Scrollable Table Container -->
        <div class="flex-1 overflow-y-auto p-5">
          <div class="space-y-6">
            <UTable
              v-model:expanded="expanded"
              :data="tableData"
              :columns="columns"
              class="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
            >
              <!-- Expand cell -->
              <template #expand-cell="{ row }">
                <div class="py-1 flex justify-center">
                  <UButton
                    :icon="
                      row.getIsExpanded()
                        ? 'material-symbols:keyboard-arrow-down'
                        : 'material-symbols:keyboard-arrow-right'
                    "
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click="row.toggleExpanded()"
                  />
                </div>
              </template>

              <!-- Title cell -->
              <template #title-cell="{ row }">
                <div class="flex flex-col py-1">
                  <span
                    class="font-semibold text-neutral-800 dark:text-neutral-200 text-sm"
                  >
                    {{ row.original.Display }}
                  </span>
                  <span
                    class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 whitespace-normal"
                  >
                    {{ row.original.Definition }}
                  </span>
                </div>
              </template>

              <!-- Value cell -->
              <template #value-cell="{ row }">
                <div
                  class="py-1 text-sm font-medium text-neutral-800 dark:text-neutral-200"
                >
                  <!-- Tobacco Group values -->
                  <div
                    v-if="row.original.Code === 'Group_Tobacco'"
                    class="space-y-1"
                  >
                    <div v-for="code in tobaccoCodes" :key="code">
                      <div
                        v-if="formData[code]"
                        class="flex items-center gap-1.5"
                      >
                        <span
                          class="text-xs text-neutral-500 dark:text-neutral-400 font-normal"
                        >
                          {{ getLabelForCode(code) }}:
                        </span>
                        <span
                          class="text-xs bg-neutral-100 dark:bg-neutral-850 px-1.5 py-0.5 rounded"
                        >
                          {{ formatValue(code, formData[code]) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Alcohol Group values -->
                  <div
                    v-else-if="row.original.Code === 'Group_Alcohol'"
                    class="space-y-1"
                  >
                    <div v-for="code in alcoholCodes" :key="code">
                      <div
                        v-if="formData[code]"
                        class="flex items-center gap-1.5"
                      >
                        <span
                          class="text-xs text-neutral-500 dark:text-neutral-400 font-normal"
                        >
                          {{ getLabelForCode(code) }}:
                        </span>
                        <span
                          class="text-xs bg-neutral-100 dark:bg-neutral-850 px-1.5 py-0.5 rounded"
                        >
                          {{ formatValue(code, formData[code]) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Normal select value -->
                  <span
                    v-else-if="getFieldType(row.original.Code) === 'select'"
                  >
                    {{ getPresenceLabel(formData[row.original.Code]) }}
                  </span>
                  <!-- Tags field value -->
                  <div
                    v-else-if="isTagsField(row.original.Code)"
                    class="flex flex-wrap gap-1"
                  >
                    <template
                      v-if="getTags(formData[row.original.Code]).length > 0"
                    >
                      <UBadge
                        v-for="(tag, tagIdx) in getTags(
                          formData[row.original.Code],
                        )"
                        :key="tagIdx"
                        color="neutral"
                        variant="subtle"
                        size="sm"
                      >
                        {{ tag }}
                      </UBadge>
                    </template>
                    <span v-else>-</span>
                  </div>
                  <!-- Normal text value -->
                  <span v-else class="whitespace-pre-wrap">
                    {{ formData[row.original.Code] || "-" }}
                  </span>
                </div>
              </template>

              <!-- Actions cell -->
              <template #actions-cell="{ row }">
                <div class="py-1 flex justify-center">
                  <UButton
                    v-if="isActiveEncounter"
                    icon="material-symbols:edit-outline"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click="openEditModal(row.original.Code)"
                  />
                </div>
              </template>

              <!-- Expanded content slot -->
              <template #expanded="{ row }">
                <div
                  class="p-5 bg-neutral-50 dark:bg-neutral-950/20 border-t border-b border-neutral-150 dark:border-neutral-850 space-y-4"
                >
                  <div
                    v-if="!hasHistory(row.original.Code)"
                    class="text-xs text-neutral-400 dark:text-neutral-500 italic py-2 text-center"
                  >
                    {{ t("riskTab.noHistory") }}
                  </div>
                  <div
                    v-else-if="isNumerical(row.original.Code)"
                    class="space-y-2"
                  >
                    <div class="flex items-center justify-between gap-4 mb-2">
                      <div class="flex items-center gap-1.5 text-primary-500">
                        <UIcon
                          name="material-symbols:query-stats-rounded"
                          class="w-4 h-4"
                        />
                        <h4 class="text-xs font-bold uppercase tracking-wider">
                          {{ getLabelForCode(row.original.Code) }} -
                          {{ t("riskTab.chartTitle") }}
                        </h4>
                      </div>
                      <!-- Line / Bar Switcher Buttons -->
                      <div
                        class="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 flex-shrink-0"
                      >
                        <UButton
                          :variant="
                            chartTypes[row.original.Code] !== 'bar'
                              ? 'solid'
                              : 'ghost'
                          "
                          color="neutral"
                          icon="material-symbols:show-chart-rounded"
                          size="xs"
                          class="cursor-pointer"
                          @click="chartTypes[row.original.Code] = 'line'"
                        />
                        <UButton
                          :variant="
                            chartTypes[row.original.Code] === 'bar'
                              ? 'solid'
                              : 'ghost'
                          "
                          color="neutral"
                          icon="material-symbols:bar-chart-rounded"
                          size="xs"
                          class="cursor-pointer"
                          @click="chartTypes[row.original.Code] = 'bar'"
                        />
                      </div>
                    </div>
                    <div class="relative w-full h-64 md:h-72 p-2 min-h-[250px]">
                      <VChart
                        :option="
                          getChartOptionForCode(
                            row.original.Code,
                            chartTypes[row.original.Code] || 'line',
                          )
                        "
                        autoresize
                        class="w-full h-full"
                      />
                    </div>
                  </div>
                  <div v-else class="space-y-2 max-w-xl">
                    <div
                      class="flex items-center gap-1.5 text-primary-500 mb-2"
                    >
                      <UIcon
                        name="material-symbols:history-rounded"
                        class="w-4 h-4"
                      />
                      <h4 class="text-xs font-bold uppercase tracking-wider">
                        {{ getLabelForCode(row.original.Code) }} -
                        {{ t("riskTab.timelineTitle") }}
                      </h4>
                    </div>
                    <UTimeline
                      color="primary"
                      :items="getTimelineItemsForCode(row.original.Code)"
                      class="w-full text-xs text-neutral-700 dark:text-neutral-300"
                    />
                  </div>
                </div>
              </template>

              <!-- Empty State -->
              <template #empty>
                <div
                  class="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-500 space-y-2"
                >
                  <UIcon
                    name="material-symbols:health-and-safety-outline"
                    class="text-3xl text-neutral-300 dark:text-neutral-700"
                  />
                  <span>{{ t("riskTab.noData") }}</span>
                </div>
              </template>
            </UTable>
          </div>
        </div>
      </div>

      <!-- Right side: History Panel -->
      <div
        v-if="!isHistoryCollapsed"
        class="flex flex-col min-h-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-4"
      >
        <h3
          class="font-semibold text-neutral-800 dark:text-neutral-200 text-sm mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2"
        >
          {{ t("riskTab.historyTitle") }}
        </h3>

        <div v-if="isLoading" class="flex-1 flex items-center justify-center">
          <UIcon
            name="svg-spinners:ring-resize"
            class="w-8 h-8 text-neutral-400"
          />
        </div>

        <div
          v-else-if="riskHistory.length === 0"
          class="flex-1 flex flex-col items-center justify-center text-center p-4"
        >
          <UIcon
            name="material-symbols:history-rounded"
            class="w-10 h-10 text-neutral-300 dark:text-neutral-700 mb-2"
          />
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ t("riskTab.noHistory") }}
          </p>
        </div>

        <div v-else class="flex-1 overflow-y-auto space-y-2 pr-1">
          <button
            v-for="(record, index) in riskHistory"
            :key="record._id"
            class="w-full text-left p-3 rounded-lg border transition-all text-xs"
            :class="[
              activeRecordId === record._id
                ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-500 text-primary-950 dark:text-primary-200'
                : 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950/30 dark:hover:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300',
            ]"
            @click="loadRecord(record)"
          >
            <div class="font-semibold flex items-center justify-between mb-1">
              <span>{{ dayjs(record.date).format("YYYY-MM-DD HH:mm") }}</span>
              <span
                v-if="index === 0"
                class="text-[10px] text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950 px-1 py-0.5 rounded"
              >
                Latest
              </span>
            </div>
            <div
              class="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-1"
            >
              <UIcon
                name="material-symbols:person-outline"
                class="w-3.5 h-3.5"
              />
              <span>
                {{
                  record.recordedBy
                    ? `${record.recordedBy.nameLast} ${record.recordedBy.nameFirst}`
                    : t("unknownDoctor")
                }}
              </span>
            </div>
          </button>
        </div>

        <!-- Start new record button -->
        <div
          v-if="isActiveEncounter"
          class="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800"
        >
          <UButton
            block
            icon="material-symbols:add"
            color="neutral"
            variant="soft"
            size="sm"
            @click="resetForm"
          >
            {{ t("createNew") }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
