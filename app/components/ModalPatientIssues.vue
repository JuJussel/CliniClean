<script setup>
import { ref, watch, reactive } from "vue";
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
  category: {
    type: String, // "allergies" or "medicationAllergies"
    required: true,
  },
});

const emit = defineEmits(["close", "saved"]);

const toast = useToast();
const { t } = useI18n();
const userStore = useUserStore();

const isSubmitting = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);
const isSearchLoading = ref(false);
const selectedAllergy = ref(null);

const state = reactive({
  category: props.category,
  code: "",
  name: "",
  startDate: null,
  endDate: null,
  severity: "light",
  comment: "",
});

// Search allergies in MongoDB as user types
watch(searchQuery, async (newVal) => {
  if (!newVal || newVal.trim().length < 1) {
    searchResults.value = [];
    return;
  }
  isSearchLoading.value = true;
  try {
    const res = await $fetch(
      `/api/allergy/search?category=${props.category}&search=${encodeURIComponent(newVal)}`,
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
    console.error("Failed to search allergy:", err);
  } finally {
    isSearchLoading.value = false;
  }
});

// Sync selected autocomplete item with form fields
watch(selectedAllergy, (newVal) => {
  if (newVal) {
    state.code = newVal.code;
    state.name = newVal.name;
  } else {
    state.code = "";
    state.name = "";
  }
});

async function handleAllergySubmit(event) {
  isSubmitting.value = true;
  try {
    const response = await $fetch(`/api/patient/${props.patientId}/allergy`, {
      method: "POST",
      body: {
        encounterId: props.encounterId,
        category: state.category,
        code: event.data.code,
        name: event.data.name,
        startDate: event.data.startDate,
        endDate: event.data.endDate || undefined,
        severity: event.data.severity,
        comment: event.data.comment || undefined,
        recordedBy: userStore.userData?._id || null,
      },
    });

    if (response && response.success) {
      toast.add({
        title: t("saved"),
        description: t("issuesTab.saveSuccess"),
        color: "success",
      });
      emit("saved");
      emit("close");
    } else {
      throw new Error("Failed to save allergy");
    }
  } catch (error) {
    console.error("Error saving allergy:", error);
    toast.add({
      title: t("error"),
      description: error.message || t("issuesTab.saveError"),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

const severityOptions = ["light", "medium", "high"];

const schema = z.object({
  code: z.string().min(1, t("validationMessages.selectAllergy")),
  name: z.string().min(1, t("validationMessages.selectAllergy")),
  category: z.string().min(1, t("validationMessages.selectRequired")),
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
  severity: z.string().min(1, t("validationMessages.selectSeverity")),
  comment: z.string().optional(),
});
</script>

<template>
  <UModal>
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols:warning-outline-rounded"
          class="size-5 text-primary"
        />
        {{ $t("issuesTab.allergyAddModalTitle") }} ({{
          props.category === "medicationAllergies"
            ? $t("issuesTab.medicineAllergies")
            : $t("issuesTab.nonMedicineAllergies")
        }})
      </div>
    </template>

    <template #body>
      <UForm
        id="allergy-record-form"
        :schema="schema"
        :state="state"
        class="space-y-4 max-h-[500px] overflow-y-auto pr-1"
        @submit="handleAllergySubmit"
      >
        <!-- Autocomplete Search -->
        <UFormField :label="$t('issuesTab.allergySearch')" name="code">
          <UInputMenu
            v-model="selectedAllergy"
            v-model:search-term="searchQuery"
            :items="searchResults"
            :loading="isSearchLoading"
            :placeholder="$t('issuesTab.allergySearch')"
            class="w-full"
            ignore-filter
          />
        </UFormField>

        <!-- Dates Grid -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Start Date -->
          <UFormField :label="$t('issuesTab.startDate')" name="startDate">
            <UInputDate
              v-model="state.startDate"
              :label="$t('issuesTab.startDate')"
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
          <UFormField :label="$t('issuesTab.endDate')" name="endDate">
            <UInputDate
              v-model="state.endDate"
              :label="$t('issuesTab.endDate')"
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

        <!-- Severity -->
        <UFormField :label="$t('issuesTab.severity')" name="severity">
          <USelectMenu
            v-model="state.severity"
            :items="severityOptions"
            class="w-full"
          >
            <!-- selected value shown in trigger -->
            <template #default="{ modelValue }">
              <template v-if="modelValue">
                <span>{{ $t("allergySevrenity." + modelValue) }}</span>
              </template>
              <span v-else class="text-muted">{{ $t("select") }}</span>
            </template>

            <!-- each item in the dropdown -->
            <template #item-label="{ item }">
              <span>{{ $t("allergySevrenity." + item) }}</span>
            </template>
          </USelectMenu>
        </UFormField>

        <!-- Comments -->
        <UFormField :label="$t('issuesTab.comment')" name="comment">
          <UTextarea
            v-model="state.comment"
            class="w-full"
            :placeholder="$t('issuesTab.comment')"
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
          form="allergy-record-form"
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
