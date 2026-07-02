<script setup>
import { ref, computed, onMounted, watch, inject } from "vue";
import { useI18n } from "vue-i18n";

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
const refreshEncounter = inject("refreshEncounter", null);
const openEncounterInTabs = inject("openEncounterInTabs", null);

const isLoading = ref(true);
const patient = ref(null);
const isActiveEncounter = ref(false);
const isCopying = ref(false);

// Filter States (null to match UCalendar empty state)
const searchQuery = ref("");
const filterStartDate = ref(null);
const filterEndDate = ref(null);
const selectedCategories = ref([]); // Category codes

const encounterId = computed(() => route.query.encounterId);

// Fetch patient data which includes historical encounters
async function fetchPatientData() {
  isLoading.value = true;
  try {
    const response = await $fetch(`/api/patient/${props.patientId}`);
    if (response && response.success) {
      patient.value = response.data;
    } else {
      throw new Error("Failed to fetch patient data");
    }
  } catch (error) {
    console.error("Error fetching patient procedures:", error);
    toast.add({
      title: t("error"),
      description: error.message || "Failed to load patient procedures history",
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

// Available categories for multiselect
const procedureCategories = computed(() => {
  return (systemStore.system?.ui?.procedureCategories || []).filter(
    (item) => item.code !== "90"
  );
});

// Helper to convert calendar date objects or standard dates/strings to YYYY-MM-DD
const formatDateValue = (val) => {
  if (!val) return "";
  if (typeof val === "object" && "toDate" in val) {
    try {
      return dayjs(val.toDate("UTC")).format("YYYY-MM-DD");
    } catch (e) {
      console.error("Error parsing CalendarDate object:", e);
    }
  }
  return dayjs(val).format("YYYY-MM-DD");
};

// Flat list of procedures with encounter date and doctor context
const allProceduresWithContext = computed(() => {
  if (!patient.value?.encounters) return [];

  const list = [];
  patient.value.encounters.forEach((encounter) => {
    const procedures = encounter.karte?.procedures || [];
    const dateStr = dayjs(encounter.date).format("YYYY-MM-DD");
    const doctorName = encounter.doctor
      ? `${encounter.doctor.nameLast || ""} ${encounter.doctor.nameFirst || ""}`.trim()
      : "";

    procedures.forEach((proc) => {
      list.push({
        encounterId: encounter._id,
        encounterDate: dateStr,
        encounterRawDate: encounter.date,
        doctorName: doctorName,
        procedure: proc,
      });
    });
  });
  return list;
});

// Filtered procedures list
const filteredProceduresWithContext = computed(() => {
  let list = allProceduresWithContext.value;

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((item) =>
      item.procedure.name?.toLowerCase().includes(q)
    );
  }

  if (filterStartDate.value) {
    const startStr = formatDateValue(filterStartDate.value);
    if (startStr) {
      list = list.filter((item) => item.encounterDate >= startStr);
    }
  }

  if (filterEndDate.value) {
    const endStr = formatDateValue(filterEndDate.value);
    if (endStr) {
      list = list.filter((item) => item.encounterDate <= endStr);
    }
  }

  if (selectedCategories.value && selectedCategories.value.length > 0) {
    list = list.filter((item) =>
      selectedCategories.value.includes(item.procedure.cat?.code)
    );
  }

  return list;
});

// Group filtered procedures by date and category
const groupedProcedures = computed(() => {
  const groups = {};

  filteredProceduresWithContext.value.forEach((item) => {
    const dateStr = item.encounterDate;
    const rawDate = item.encounterRawDate;
    const doctorName = item.doctorName;
    const proc = item.procedure;
    const encId = item.encounterId;

    if (!groups[dateStr]) {
      groups[dateStr] = {
        encounterId: encId,
        date: dateStr,
        rawDate: rawDate,
        doctorName: doctorName,
        categories: {},
      };
    }

    const catKey = proc.cat?.label || proc.cat?.code || "other";
    const catLabel = proc.cat?.label || "other";
    const catCode = proc.cat?.code || "99";

    if (!groups[dateStr].categories[catKey]) {
      groups[dateStr].categories[catKey] = {
        key: catKey,
        label: catLabel,
        code: catCode,
        procedures: [],
      };
    }

    groups[dateStr].categories[catKey].procedures.push(proc);
  });

  // Sort groups chronologically descending
  return Object.values(groups)
    .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
    .map((g) => {
      g.categories = Object.values(g.categories);
      return g;
    });
});

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== "" ||
    filterStartDate.value !== null ||
    filterEndDate.value !== null ||
    (selectedCategories.value && selectedCategories.value.length > 0)
  );
});

const router = useRouter();

function resetFilters() {
  searchQuery.value = "";
  filterStartDate.value = null;
  filterEndDate.value = null;
  selectedCategories.value = [];
}

function openEncounterInPlane(encId) {
  if (!encId) return;
  if (openEncounterInTabs) {
    openEncounterInTabs(encId);
  } else {
    router.push({ query: { ...route.query, encounterId: encId } });
  }
}

// Clone and add a procedure to the active encounter
async function addProcedureToCurrent(procedure) {
  if (!encounterId.value) return;
  isCopying.value = true;
  try {
    const activeEncounter = await $fetch(`/api/encounter/${encounterId.value}`);
    if (!activeEncounter) throw new Error("Active encounter not found");
    
    if (activeEncounter.status !== 3) {
      toast.add({
        title: t("error"),
        description: t("riskTab.activeEncounterRequired"),
        color: "error",
      });
      return;
    }

    const procedureCopy = JSON.parse(JSON.stringify(procedure));

    if (!activeEncounter.karte) activeEncounter.karte = {};
    if (!activeEncounter.karte.procedures) activeEncounter.karte.procedures = [];
    activeEncounter.karte.procedures.push(procedureCopy);

    await $fetch(`/api/encounter/${encounterId.value}`, {
      method: "POST",
      body: activeEncounter,
    });

    toast.add({
      title: t("saved"),
      description: t("procedureAddedSuccess"),
      color: "success",
    });

    if (refreshEncounter) {
      await refreshEncounter();
    }
  } catch (error) {
    console.error("Error copying procedure:", error);
    toast.add({
      title: t("error"),
      description: error.message || "Failed to copy procedure to encounter",
      color: "error",
    });
  } finally {
    isCopying.value = false;
  }
}

// Watch active encounter ID changes
watch(encounterId, checkEncounterStatus, { immediate: true });

onMounted(() => {
  fetchPatientData();
});
</script>

<template>
  <div class="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols-light:list-alt-outline"
          class="text-2xl text-primary-500"
        />
        <h2 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">
          {{ $t("procedureHistory") }}
        </h2>
      </div>
    </div>

    <!-- Filters Panel -->
    <UCard :ui="{ body: 'p-4' }" class="shrink-0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <!-- Text Search -->
        <UFormField :label="$t('procedureSearch')">
          <UInput
            v-model="searchQuery"
            icon="material-symbols:search"
            :placeholder="$t('searchByNameodID') || 'Search...'"
            class="w-full"
            clearable
          />
        </UFormField>

        <!-- Category Multiselect -->
        <UFormField :label="$t('procedureType')">
          <USelectMenu
            v-model="selectedCategories"
            :items="procedureCategories"
            multiple
            :placeholder="$t('procedureType')"
            value-key="code"
            label-key="label"
            class="w-full"
          >
            <template #default="{ modelValue }">
              <span v-if="modelValue && modelValue.length > 0" class="truncate block">
                {{ modelValue.map(val => $t(procedureCategories.find(c => c.code === val)?.label || '')).join(', ') }}
              </span>
              <span v-else class="text-neutral-400">
                {{ $t('procedureType') }}
              </span>
            </template>
            <template #item-label="{ item }">
              {{ $t(item.label) }}
            </template>
          </USelectMenu>
        </UFormField>

        <!-- Start Date -->
        <UFormField :label="$t('startDate')">
          <UInputDate
            v-model="filterStartDate"
            :label="$t('startDate')"
            class="flex w-full"
          >
            <template #trailing>
              <UPopover>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-calendar"
                  aria-label="Select a date"
                  class="px-0"
                />

                <template #content>
                  <UCalendar v-model="filterStartDate" class="p-2" />
                </template>
              </UPopover>
            </template>
          </UInputDate>
        </UFormField>

        <!-- End Date -->
        <UFormField :label="$t('endDate')">
          <UInputDate
            v-model="filterEndDate"
            :label="$t('endDate')"
            class="flex w-full"
          >
            <template #trailing>
              <UPopover>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-calendar"
                  aria-label="Select a date"
                  class="px-0"
                />

                <template #content>
                  <UCalendar v-model="filterEndDate" class="p-2" />
                </template>
              </UPopover>
            </template>
          </UInputDate>
        </UFormField>
      </div>

      <!-- Clear Button if any filter is active -->
      <div v-if="hasActiveFilters" class="flex justify-end mt-3 border-t border-neutral-100 dark:border-neutral-800 pt-3">
        <UButton
          color="neutral"
          variant="subtle"
          size="xs"
          icon="material-symbols:clear-all"
          @click="resetFilters"
        >
          {{ $t('clearFilters') }}
        </UButton>
      </div>
    </UCard>

    <!-- Loading Skeleton State -->
    <div v-if="isLoading" class="space-y-4">
      <UCard v-for="i in 2" :key="i">
        <template #header>
          <div class="flex justify-between items-center">
            <USkeleton class="h-4 w-1/3" />
            <USkeleton class="h-4 w-1/4" />
          </div>
        </template>
        <div class="space-y-3">
          <USkeleton class="h-3 w-1/4" />
          <USkeleton class="h-10 w-full rounded-lg" />
        </div>
      </UCard>
    </div>

    <!-- Loaded Content View -->
    <div v-else-if="groupedProcedures.length > 0" class="space-y-6">
      <div v-for="group in groupedProcedures" :key="group.date" class="space-y-3">
        <UCard :ui="{ body: 'p-4' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div
                class="flex items-center gap-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 font-bold cursor-pointer group/date"
                @click="openEncounterInPlane(group.encounterId)"
              >
                <UIcon name="material-symbols:calendar-today-outline-rounded" />
                <span class="group-hover/date:underline">
                  {{ dayjs(group.rawDate).format("YYYY年MM月DD日 (dd) HH:mm") }}
                </span>
                <UIcon name="material-symbols:open-in-new-rounded" class="size-4 opacity-0 group-hover/date:opacity-100 transition-opacity" />
              </div>
              <span class="text-xs text-neutral-400 dark:text-neutral-500">
                {{ group.doctorName ? group.doctorName + " 医師" : "" }}
              </span>
            </div>
          </template>

          <div class="divide-y divide-neutral-100 dark:divide-neutral-800 space-y-4">
            <div v-for="category in group.categories" :key="category.key" class="pt-3 first:pt-0">
              <div class="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300 font-semibold mb-2">
                <UIcon :name="systemStore?.icons?.[category.label] || 'material-symbols:description'" class="size-4 text-primary" />
                <span class="text-xs uppercase tracking-wider">{{ $t(category.label) }}</span>
              </div>

              <ul class="space-y-2">
                <li
                  v-for="proc in category.procedures"
                  :key="proc.srycd || proc.name"
                  class="flex items-center justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 rounded-lg transition-colors border border-neutral-100/50 dark:border-neutral-800/50"
                >
                  <div class="space-y-1 flex-1 min-w-0 pr-4">
                    <div class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {{ proc.name }}
                    </div>

                    <!-- Dynamic Details -->
                    <!-- Shot Details -->
                    <div v-if="(proc.cat?.label === 'shot' || proc.cat?.label === 'prevVac') && proc.varData" class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                      <span v-if="proc.varData.location">{{ $t('shotLocation') }}: {{ proc.varData.location }}</span>
                      <span v-if="proc.varData.amount">{{ $t('shotAmount') }}: {{ proc.varData.amount }}{{ proc.taniname ? $t('vial') : '' }}</span>
                      <span v-if="proc.varData.lot">{{ $t('shotLot') }}: {{ proc.varData.lot }}</span>
                    </div>

                    <!-- Prescription Details -->
                    <div v-else-if="proc.cat?.label === 'perscription' && proc.varData" class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                      <span v-if="proc.varData.type?.name">{{ $t('perscriptionType') }}: {{ proc.varData.type.name }}</span>
                      <span v-if="proc.varData.timing?.name">{{ $t('perscriptionTiming') }}: {{ proc.varData.timing.name }}</span>
                      <span v-if="proc.varData.amount">{{ $t('perscriptionAmount') }}: {{ proc.varData.amount }}{{ proc.taniname || '' }}</span>
                      <span v-if="proc.varData.duration">{{ $t('perscriptionDuration') }}: {{ proc.varData.duration }}{{ proc.varData.timing?.unit || '' }}</span>
                    </div>

                    <!-- Exam Details -->
                    <div v-else-if="proc.cat?.label === 'exam' && proc.varData && proc.varData.length > 0" class="space-y-1">
                      <div class="text-xs text-neutral-400 font-semibold">{{ $t('examResults') }}:</div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="resVal in proc.varData" :key="resVal.resultName" class="text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-400">
                          {{ resVal.resultName }}: {{ resVal.value || '-' }}{{ resVal.unit?.name && resVal.unit?.name !== '＊未設定' ? resVal.unit.name : '' }}
                        </span>
                      </div>
                    </div>

                    <!-- Note -->
                    <div v-if="proc.note" class="text-xs text-neutral-400 dark:text-neutral-500 italic truncate">
                      {{ $t('note') }}: {{ proc.note }}
                    </div>
                  </div>

                  <!-- Action Button: Copy to Active Encounter -->
                  <UButton
                    v-if="isActiveEncounter"
                    icon="material-symbols:add"
                    color="primary"
                    variant="subtle"
                    size="xs"
                    :loading="isCopying"
                    @click="addProcedureToCurrent(proc)"
                  >
                    {{ $t('procedureAddButton') }}
                  </UButton>
                </li>
              </ul>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-500 space-y-2"
    >
      <UIcon
        name="material-symbols-light:list-alt-outline"
        class="text-3xl text-neutral-300 dark:text-neutral-700"
      />
      <span>{{ $t("procedureNoHistory") }}</span>
    </div>
  </div>
</template>
