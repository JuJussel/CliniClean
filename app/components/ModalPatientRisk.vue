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
  { value: null, label: t("riskTab.yesNo.unregistered") },
  { value: "present", label: t("riskTab.yesNo.present") },
  { value: "absent", label: t("riskTab.yesNo.absent") },
];

const state = reactive({
  codes: props.editCode ? [props.editCode] : [],
  values: {},
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

// If editing, initialize the target value
if (
  props.editCode &&
  !["Group_Tobacco", "Group_Alcohol"].includes(props.editCode)
) {
  state.values[props.editCode] = props.currentValues[props.editCode] || "";
}

// Watch state.codes to pre-populate values with fallback when selected
watch(
  () => state.codes,
  (newCodes) => {
    if (!newCodes) return;
    newCodes.forEach((code) => {
      if (!["Group_Tobacco", "Group_Alcohol"].includes(code)) {
        if (state.values[code] === undefined) {
          state.values[code] = props.currentValues[code] || "";
        }
      }
    });
  },
  { immediate: true, deep: true },
);

function getDefinitionForCode(code) {
  if (code === "Group_Tobacco") return t("riskTab.sections.smoking");
  if (code === "Group_Alcohol") return t("riskTab.sections.drinking");
  const risk = socialRisks.value.find((r) => r.Code === code);
  return risk ? risk.Definition : "";
}

// Helper to determine if a code is a tags-input field
function isTagsField(code) {
  if (!code) return false;
  if (code === "MD0012770") return false; // Birthplace
  if (tobaccoCodes.includes(code) || alcoholCodes.includes(code)) return false;
  if (code === "Group_Tobacco" || code === "Group_Alcohol") return false;
  return true;
}

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

const tagsModel = (code) => {
  return computed({
    get() {
      const rawVal = state.values[code] || "";
      return rawVal.split(/\s*,\s*|\s*、\s*/).filter(Boolean);
    },
    set(val) {
      state.values[code] = val.join(", ");
    },
  });
};

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
  if (code === "Group_Tobacco") return t("riskTab.sections.smoking");
  if (code === "Group_Alcohol") return t("riskTab.sections.drinking");
  const risk = socialRisks.value.find((r) => r.Code === code);
  return risk ? risk.Display.replace(".有無", "") : code;
}


async function handleRiskSubmit(event) {
  isSubmitting.value = true;
  try {
    const updatedValues = {};

    const activeCodes = props.editCode ? [props.editCode] : state.codes;

    activeCodes.forEach((code) => {
      if (code === "Group_Tobacco") {
        tobaccoCodes.forEach((c) => {
          updatedValues[c] = state.groupValues[c];
        });
      } else if (code === "Group_Alcohol") {
        alcoholCodes.forEach((c) => {
          updatedValues[c] = state.groupValues[c];
        });
      } else {
        updatedValues[code] = state.values[code];
      }
    });

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
        title: t("saved"),
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
  codes: z.array(z.string()).min(1, t("riskTab.selectRiskFactor")),
});
</script>

<template>
  <UModal :ui="{ content: props.editCode ? 'max-w-xl!' : 'max-w-4xl!' }">
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
        class="pr-1"
        @submit="handleRiskSubmit"
      >
        <div
          :class="
            props.editCode
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-12 gap-6 items-start'
          "
        >
          <!-- Left Column (Selector) -->
          <div :class="props.editCode ? '' : 'md:col-span-5'">
            <UFormField
              :label="t('riskTab.tableHeaderTitle')"
              name="codes"
              class="w-full"
            >
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
              <UListbox
                v-else
                v-model="state.codes"
                multiple
                :items="availableSocialRisks"
                value-key="Code"
                label-key="Display"
                description-key="Definition"
                filter
                class="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg max-h-[400px]"
              />
            </UFormField>
          </div>

          <!-- Right Column (Value Entry) -->
          <div
            :class="
              props.editCode
                ? ''
                : 'md:col-span-7 max-h-[420px] overflow-y-auto pr-1 space-y-6'
            "
          >
            <!-- Friendly empty state for register mode -->
            <div
              v-if="!props.editCode && state.codes.length === 0"
              class="flex flex-col items-center justify-center p-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-400 dark:text-neutral-500 bg-neutral-50/50 dark:bg-neutral-900/10 min-h-[300px]"
            >
              <UIcon
                name="material-symbols:health-and-safety-outline"
                class="size-8 mb-2 opacity-60 text-primary"
              />
              <span class="text-sm font-medium">{{
                t("riskTab.selectFactorToVisualize") || "項目を選択してください"
              }}</span>
            </div>

            <!-- Dynamic Inputs Section -->
            <div v-else class="space-y-6">
              <div
                v-for="code in props.editCode ? [props.editCode] : state.codes"
                :key="code"
                class="space-y-4 border-t border-neutral-100 dark:border-neutral-800/60 first:border-t-0 pt-4 first:pt-0 mt-4 first:mt-0"
              >
                <!-- Label/Title for each selected factor -->
                <div
                  class="flex items-center gap-2 font-medium text-sm text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-800/20 p-2 rounded border border-neutral-100 dark:border-neutral-800/30"
                >
                  <UIcon
                    name="material-symbols:label-outline-rounded"
                    class="size-4 text-primary"
                  />
                  <span>{{ getLabelForCode(code) }}</span>
                </div>

                <!-- Tobacco Group Fields -->
                <div
                  v-if="code === 'Group_Tobacco'"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <UFormField :label="getLabelForCode('MD0012870')">
                    <USelect
                      v-model="state.groupValues.MD0012870"
                      :items="presenceOptions"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField :label="getLabelForCode('MD0012880')">
                    <USelect
                      v-model="state.groupValues.MD0012880"
                      :items="presenceOptions"
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
                  v-else-if="code === 'Group_Alcohol'"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <UFormField :label="getLabelForCode('MD0012930')">
                    <USelect
                      v-model="state.groupValues.MD0012930"
                      :items="presenceOptions"
                      size="sm"
                      class="w-full"
                    />
                  </UFormField>

                  <UFormField :label="getLabelForCode('MD0012940')">
                    <USelect
                      v-model="state.groupValues.MD0012940"
                      :items="presenceOptions"
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
                  <UFormField
                    :label="t('riskTab.tableHeaderValue')"
                    name="value"
                  >
                    <UInputTags
                      v-if="isTagsField(code)"
                      :model-value="tagsModel(code).value"
                      @update:model-value="
                        (val) => (tagsModel(code).value = val)
                      "
                      add-on-blur
                      size="sm"
                      class="w-full"
                      :placeholder="getDefinitionForCode(code)"
                    />

                    <USelect
                      v-else-if="getFieldType(code) === 'select'"
                      v-model="state.values[code]"
                      :items="presenceOptions"
                      size="sm"
                      class="w-full"
                    />

                    <UTextarea
                      v-else-if="getFieldType(code) === 'textarea'"
                      v-model="state.values[code]"
                      rows="3"
                      size="sm"
                      class="w-full"
                      :placeholder="getDefinitionForCode(code)"
                    />

                    <UInput
                      v-else-if="getFieldType(code) === 'number'"
                      v-model="state.values[code]"
                      type="number"
                      size="sm"
                      class="w-full"
                      :placeholder="getDefinitionForCode(code)"
                    />

                    <UInput
                      v-else
                      v-model="state.values[code]"
                      size="sm"
                      class="w-full"
                      :placeholder="getDefinitionForCode(code)"
                    />
                  </UFormField>
                </div>
              </div>
            </div>
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
          :disabled="
            isSubmitting || (!props.editCode && state.codes.length === 0)
          "
        >
          {{ t("save") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
