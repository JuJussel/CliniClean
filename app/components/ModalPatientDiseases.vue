<script setup>
import { ref, watch, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import * as z from "zod";

const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  encounterId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "saved"]);

const toast = useToast();
const dayjs = useDayjs();
const { t } = useI18n();
const systemStore = useSystemStore();

const isSubmitting = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);
const isSearchLoading = ref(false);
const selectedDisease = ref(null);

const state = reactive({
  code: "",
  name: "",
  startDate: null,
  endDate: null,
  outcome: "",
  suspectFlag: "",
  description: "",
});

// Search diseases as user types
watch(searchQuery, async (newVal) => {
  if (!newVal || newVal.trim().length < 1) {
    searchResults.value = [];
    return;
  }
  isSearchLoading.value = true;
  try {
    const res = await $fetch(
      `/api/disease/search?search=${encodeURIComponent(newVal)}`,
    );
    if (res && res.success) {
      searchResults.value = res.data.map((d) => ({
        label: `${d.code} - ${d.name}`,
        value: d.code,
        name: d.name,
        code: d.code,
      }));
    }
  } catch (err) {
    console.error("Failed to search disease:", err);
  } finally {
    isSearchLoading.value = false;
  }
});

// Sync selected autocomplete item with form fields
watch(selectedDisease, (newVal) => {
  if (newVal) {
    state.code = newVal.code;
    state.name = newVal.name;
  } else {
    state.code = "";
    state.name = "";
  }
});

async function handleDiseaseSubmit(event) {
  isSubmitting.value = true;
  try {
    const response = await $fetch(`/api/patient/${props.patientId}/disease`, {
      method: "POST",
      body: {
        encounterId: props.encounterId,
        diseases: [
          {
            code: event.data.code,
            name: event.data.name,
            startDate: event.data.startDate,
            endDate: event.data.endDate || undefined,
            outcome: event.data.outcome || undefined,
            suspectFlag: event.data.suspectFlag || undefined,
            description: event.data.description || undefined,
          },
        ],
      },
    });

    if (response && response.success) {
      toast.add({
        title: t("saved"),
        description: t("diseaseSaveSuccess"),
        color: "success",
      });
      emit("saved");
      emit("close");
    } else {
      throw new Error("Failed to save disease");
    }
  } catch (error) {
    console.error("Error saving disease:", error);
    toast.add({
      title: t("error"),
      description: error.message || t("diseaseSaveError"),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

const schema = z.object({
  code: z.string().min(1, t("validationMessages.selectDisease")),
  name: z.string().min(1, t("validationMessages.selectDisease")),
  startDate: z
    .custom((val) => val && typeof val === "object" && "toDate" in val, {
      message: t("validationMessages.dateBase"),
    })
    .transform((calendarDate) => calendarDate.toDate("UTC"))
    .pipe(z.date()),
  endDate: z
    .custom((val) => !val || (typeof val === "object" && "toDate" in val), {
      message: t("validationMessages.dateBase"),
    })
    .transform((val) => {
      if (!val) return undefined;
      return val.toDate("UTC");
    })
    .pipe(z.date().optional())
    .optional(),
  outcome: z.string().optional(),
  suspectFlag: z.string().optional(),
  description: z.string().optional(),
}).refine((data) => {
  if (data.outcome && !data.endDate) {
    return false;
  }
  return true;
}, {
  message: t("validationMessages.dateBase"),
  path: ["endDate"],
});
</script>

<template>
  <UModal>
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols:sick-outline"
          class="size-5 text-primary"
        />
        {{ $t("diseaseAddModalTitle") }}
      </div>
    </template>

    <template #body>
      <UForm
        id="disease-record-form"
        :schema="schema"
        :state="state"
        class="space-y-4 max-h-[500px] overflow-y-auto pr-1"
        @submit="handleDiseaseSubmit"
      >
        <!-- Autocomplete Search -->
        <UFormField :label="$t('diseaseSearch')" name="code">
          <UInputMenu
            v-model="selectedDisease"
            v-model:search-term="searchQuery"
            :items="searchResults"
            :loading="isSearchLoading"
            :placeholder="$t('diseaseSearch')"
            class="w-full"
            ignore-filter
          />
        </UFormField>

        <!-- Dates Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Start Date (Diagnose date) -->
          <UFormField :label="$t('diseaseStartDate')" name="startDate">
            <UInputDate
              v-model="state.startDate"
              :label="$t('diseaseStartDate')"
              class="flex"
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
                    <UCalendar v-model="state.startDate" class="p-2" />
                  </template>
                </UPopover>
              </template>
            </UInputDate>
          </UFormField>

          <!-- End Date -->
          <UFormField :label="$t('diseaseEndDate')" name="endDate">
            <UInputDate
              v-model="state.endDate"
              :label="$t('diseaseEndDate')"
              class="flex"
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
                    <UCalendar v-model="state.endDate" class="p-2" />
                  </template>
                </UPopover>
              </template>
            </UInputDate>
          </UFormField>
        </div>

        <!-- Flags Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Outcome -->
          <UFormField :label="$t('diseaseOutcome')" name="outcome">
            <USelectMenu
              v-model="state.outcome"
              clear
              :items="systemStore.system?.ui?.disease?.outcomeFlags"
              class="w-full"
              value-key="value"
              label-key="label"
            >
              <!-- selected value shown in trigger -->
              <template #default="{ modelValue }">
                <template v-if="modelValue">
                  <span>{{ $t("diseaseOutcomeFlags." + modelValue) }}</span>
                </template>
                <span v-else class="text-muted">{{ $t("select") }}</span>
              </template>

              <!-- each item in the dropdown -->
              <template #item-label="{ item }">
                <span>{{ $t("diseaseOutcomeFlags." + item) }}</span>
              </template>
            </USelectMenu>
          </UFormField>
          <!-- Suspect / Acute -->
          <UFormField :label="$t('diseaseSuspectOrAcute')" name="suspectFlag">
            <USelectMenu
              v-model="state.suspectFlag"
              clear
              :items="systemStore.system?.ui?.disease?.suspectFlags"
              class="w-full"
              value-key="value"
              label-key="label"
            >
              <!-- selected value shown in trigger -->
              <template #default="{ modelValue }">
                <template v-if="modelValue">
                  <span>{{ $t("diseaseSuspectFlags." + modelValue) }}</span>
                </template>
                <span v-else class="text-muted">{{ $t("select") }}</span>
              </template>

              <!-- each item in the dropdown -->
              <template #item-label="{ item }">
                <span>{{ $t("diseaseSuspectFlags." + item) }}</span>
              </template>
            </USelectMenu>
          </UFormField>
        </div>

        <!-- Description / Comments -->
        <UFormField :label="$t('diseaseDescription')" name="description">
          <UTextarea
            v-model="state.description"
            class="w-full"
            :placeholder="$t('supplementalComment')"
          />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          @click="emit('close')"
          :disabled="isSubmitting"
        >
          {{ $t("cancel") }}
        </UButton>
        <UButton
          type="submit"
          form="disease-record-form"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ $t("save") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
