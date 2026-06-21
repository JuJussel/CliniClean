<script setup>
import { ref, computed, reactive, watch } from "vue";
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
  currentValues: {
    type: Object,
    required: true,
  },
  editCode: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["close", "saved"]);

const toast = useToast();
const { t } = useI18n();
const systemStore = useSystemStore();
const userStore = useUserStore();

const isSubmitting = ref(false);

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

// Fetch risk factors metadata from store or fallback
const socialRisks = computed(() => {
  return systemStore.system?.ui?.socialRisks || [];
});

// If editing, find the selected factor metadata
const editingRiskFactor = computed(() => {
  if (props.editCode === "Group_Tobacco") {
    return {
      Code: "Group_Tobacco",
      Display: t("riskTab.sections.smoking"),
      Definition: t("riskTab.sections.smoking"),
    };
  }
  if (props.editCode === "Group_Alcohol") {
    return {
      Code: "Group_Alcohol",
      Display: t("riskTab.sections.drinking"),
      Definition: t("riskTab.sections.drinking"),
    };
  }
  return socialRisks.value.find((r) => r.Code === props.editCode) || null;
});

// Dropdown items for register mode
const availableSocialRisks = computed(() => {
  const list = [];

  // Check if Tobacco group is already registered
  const hasTobacco = tobaccoCodes.some(
    (code) =>
      props.currentValues[code] !== undefined &&
      props.currentValues[code] !== null &&
      props.currentValues[code] !== "",
  );
  if (!hasTobacco) {
    list.push({
      Code: "Group_Tobacco",
      Display: t("riskTab.sections.smoking"),
      Definition: t("riskTab.sections.smoking"),
    });
  }

  // Check if Alcohol group is already registered
  const hasAlcohol = alcoholCodes.some(
    (code) =>
      props.currentValues[code] !== undefined &&
      props.currentValues[code] !== null &&
      props.currentValues[code] !== "",
  );
  if (!hasAlcohol) {
    list.push({
      Code: "Group_Alcohol",
      Display: t("riskTab.sections.drinking"),
      Definition: t("riskTab.sections.drinking"),
    });
  }

  // Add other normal items
  socialRisks.value.forEach((r) => {
    if (!tobaccoCodes.includes(r.Code) && !alcoholCodes.includes(r.Code)) {
      if (!props.currentValues[r.Code] || props.currentValues[r.Code] === "") {
        list.push(r);
      }
    }
  });

  return list;
});

// Presence options for 有無 fields
const presenceOptions = [
  { value: "", label: t("riskTab.yesNo.unregistered") },
  { value: "有", label: t("riskTab.yesNo.present") },
  { value: "無", label: t("riskTab.yesNo.absent") },
];

const state = reactive({
  code: props.editCode || "",
  value:
    props.editCode &&
    !["Group_Tobacco", "Group_Alcohol"].includes(props.editCode)
      ? props.currentValues[props.editCode] || ""
      : "",
  groupValues: {
    // Smoking fields
    MD0012870: props.currentValues["MD0012870"] || "",
    MD0012880: props.currentValues["MD0012880"] || "",
    MD0012890: props.currentValues["MD0012890"] || "",
    MD0012900: props.currentValues["MD0012900"] || "",
    MD0012910: props.currentValues["MD0012910"] || "",
    MD0012920: props.currentValues["MD0012920"] || "",
    // Drinking fields
    MD0012930: props.currentValues["MD0012930"] || "",
    MD0012940: props.currentValues["MD0012940"] || "",
    MD0012950: props.currentValues["MD0012950"] || "",
    MD0012960: props.currentValues["MD0012960"] || "",
    MD0012970: props.currentValues["MD0012970"] || "",
  },
});

// Selected risk factor metadata
const selectedRiskFactor = computed(() => {
  if (props.editCode) return editingRiskFactor.value;
  if (state.code === "Group_Tobacco") {
    return {
      Code: "Group_Tobacco",
      Display: t("riskTab.sections.smoking"),
      Definition: t("riskTab.sections.smoking"),
    };
  }
  if (state.code === "Group_Alcohol") {
    return {
      Code: "Group_Alcohol",
      Display: t("riskTab.sections.drinking"),
      Definition: t("riskTab.sections.drinking"),
    };
  }
  return socialRisks.value.find((r) => r.Code === state.code) || null;
});

// Helper to determine if a code is a tags-input field
function isTagsField(code) {
  if (!code) return false;
  if (code === "MD0012770") return false; // Birthplace
  if (tobaccoCodes.includes(code) || alcoholCodes.includes(code)) return false;
  if (code === "Group_Tobacco" || code === "Group_Alcohol") return false;
  return true;
}

// Watch code change to clear or adjust default value
watch(
  () => state.code,
  (newCode) => {
    if (newCode && !props.editCode) {
      if (!["Group_Tobacco", "Group_Alcohol"].includes(newCode)) {
        state.value = "";
      }
    }
  },
);

// Watch daily smoking count and smoking years to compute Brickman index in real-time
watch(
  [() => state.groupValues["MD0012900"], () => state.groupValues["MD0012910"]],
  ([count, years]) => {
    const smokingCount = parseFloat(count);
    const smokingYears = parseFloat(years);
    if (!isNaN(smokingCount) && !isNaN(smokingYears)) {
      state.groupValues["MD0012920"] = (smokingCount * smokingYears).toString();
    } else {
      state.groupValues["MD0012920"] = "";
    }
  },
);

// Tags array local state
const tagsValue = ref([]);

// Watch state.code and state.value to populate tags array
watch(
  () => [state.code, state.value],
  () => {
    if (isTagsField(state.code)) {
      const rawVal = state.value || "";
      const parsedTags = rawVal.split(/\s*,\s*|\s*、\s*/).filter(Boolean);
      if (JSON.stringify(parsedTags) !== JSON.stringify(tagsValue.value)) {
        tagsValue.value = parsedTags;
      }
    }
  },
  { immediate: true },
);

// Watch tagsValue to join back into state.value string
watch(
  tagsValue,
  (newTags) => {
    if (isTagsField(state.code)) {
      const joined = newTags.join(", ");
      if (joined !== state.value) {
        state.value = joined;
      }
    }
  },
  { deep: true },
);

// Helper to determine field input types
function getFieldType(code) {
  if (!code) return "text";
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
  if (["MD0012900", "MD0012910", "MD0012970"].includes(code)) {
    return "number";
  }
  return "text";
}

// Helper to get labels dynamically
function getLabelForCode(code) {
  const risk = socialRisks.value.find((r) => r.Code === code);
  return risk ? risk.Display.replace(".有無", "") : code;
}

async function handleRiskSubmit(event) {
  isSubmitting.value = true;
  try {
    const updatedValues = { ...props.currentValues };

    // Ensure all 25 default codes are present in values payload (to preserve record structure)
    socialRisks.value.forEach((risk) => {
      if (updatedValues[risk.Code] === undefined) {
        updatedValues[risk.Code] = "";
      }
    });

    if (state.code === "Group_Tobacco") {
      tobaccoCodes.forEach((code) => {
        updatedValues[code] = state.groupValues[code];
      });
    } else if (state.code === "Group_Alcohol") {
      alcoholCodes.forEach((code) => {
        updatedValues[code] = state.groupValues[code];
      });
    } else {
      updatedValues[state.code] = state.value;
    }

    const response = await $fetch(`/api/patient/${props.patientId}/risk`, {
      method: "POST",
      body: {
        encounterId: props.encounterId,
        values: updatedValues,
        recordedBy: userStore.userData?._id || null,
      },
    });

    if (response && response.success) {
      toast.add({
        title: t("saved") || "保存しました",
        description: t("riskTab.saveSuccess"),
        color: "success",
      });
      emit("saved");
      emit("close");
    } else {
      throw new Error("Failed to save risk factor");
    }
  } catch (error) {
    console.error("Error saving risk factor:", error);
    toast.add({
      title: t("error") || "Error",
      description: error.message || t("riskTab.saveError"),
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
}

// Zod schema validation
const schema = z.object({
  code: z.string().min(1, t("riskTab.selectRiskFactor")),
  value: z.string().nullable().optional(),
});
</script>

<template>
  <UModal>
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols:health-and-safety-outline"
          class="size-5 text-primary"
        />
        {{
          props.editCode
            ? t("riskTab.modalTitle")
            : t("riskTab.registerNewItem")
        }}
      </div>
    </template>

    <template #body>
      <UForm
        id="risk-record-form"
        :schema="schema"
        :state="state"
        class="space-y-4 max-h-[500px] overflow-y-auto pr-1"
        @submit="handleRiskSubmit"
      >
        <!-- Risk Factor Selector -->
        <UFormField :label="t('riskTab.tableHeaderTitle')" name="code">
          <div
            v-if="props.editCode"
            class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div>{{ editingRiskFactor?.Display }}</div>
            <div
              class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-normal"
            >
              {{ editingRiskFactor?.Definition }}
            </div>
          </div>
          <USelectMenu
            v-else
            v-model="state.code"
            :items="availableSocialRisks"
            value-key="Code"
            label-key="Display"
            :placeholder="t('riskTab.selectRiskFactor')"
            class="w-full"
          >
            <template #item-label="{ item }">
              <div class="flex flex-col py-0.5">
                <span class="font-medium text-sm">{{ item.Display }}</span>
                <span class="text-xs text-neutral-400 mt-0.5">{{
                  item.Definition
                }}</span>
              </div>
            </template>
          </USelectMenu>
        </UFormField>

        <!-- Dynamic Inputs Section -->
        <div
          v-if="state.code"
          class="mt-4 border-t border-neutral-100 dark:border-neutral-800/60 pt-4"
        >
          <!-- Tobacco Group Fields -->
          <div
            v-if="state.code === 'Group_Tobacco'"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <UFormField :label="getLabelForCode('MD0012870')">
              <USelect
                v-model="state.groupValues.MD0012870"
                :options="presenceOptions"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012880')">
              <USelect
                v-model="state.groupValues.MD0012880"
                :options="presenceOptions"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012890')">
              <UInput
                v-model="state.groupValues.MD0012890"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012900')">
              <UInput
                v-model="state.groupValues.MD0012900"
                type="number"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012910')">
              <UInput
                v-model="state.groupValues.MD0012910"
                type="number"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012920')">
              <UInput
                v-model="state.groupValues.MD0012920"
                disabled
                size="sm"
                class="bg-neutral-50 dark:bg-neutral-950/20 font-medium text-neutral-600 dark:text-neutral-400 w-full"
                placeholder="Auto-calculated"
              />
            </UFormField>
          </div>

          <!-- Alcohol Group Fields -->
          <div
            v-else-if="state.code === 'Group_Alcohol'"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <UFormField :label="getLabelForCode('MD0012930')">
              <USelect
                v-model="state.groupValues.MD0012930"
                :options="presenceOptions"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012940')">
              <USelect
                v-model="state.groupValues.MD0012940"
                :options="presenceOptions"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012950')">
              <UInput
                v-model="state.groupValues.MD0012950"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012960')">
              <UInput
                v-model="state.groupValues.MD0012960"
                type="number"
                size="sm"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="getLabelForCode('MD0012970')">
              <UInput
                v-model="state.groupValues.MD0012970"
                type="number"
                size="sm"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Normal Field Input -->
          <div v-else>
            <UFormField :label="t('riskTab.tableHeaderValue')" name="value">
              <UInputTags
                v-if="isTagsField(state.code)"
                v-model="tagsValue"
                size="sm"
                class="w-full"
                :placeholder="selectedRiskFactor?.Definition"
              />

              <USelect
                v-else-if="getFieldType(state.code) === 'select'"
                v-model="state.value"
                :options="presenceOptions"
                size="sm"
                class="w-full"
              />

              <UTextarea
                v-else-if="getFieldType(state.code) === 'textarea'"
                v-model="state.value"
                rows="3"
                size="sm"
                class="w-full"
                :placeholder="selectedRiskFactor?.Definition"
              />

              <UInput
                v-else-if="getFieldType(state.code) === 'number'"
                v-model="state.value"
                type="number"
                size="sm"
                class="w-full"
                :placeholder="selectedRiskFactor?.Definition"
              />

              <UInput
                v-else
                v-model="state.value"
                size="sm"
                class="w-full"
                :placeholder="selectedRiskFactor?.Definition"
              />
            </UFormField>
          </div>
        </div>
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
          {{ t("cancel") }}
        </UButton>
        <UButton
          type="submit"
          form="risk-record-form"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting || !state.code"
        >
          {{ t("save") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
