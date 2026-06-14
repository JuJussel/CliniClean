<script setup>
import { ref, computed, onMounted } from "vue";

const systemStore = useSystemStore();
const toast = useToast();
const emit = defineEmits(["close"]);

const props = defineProps({
  encounter: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);
const paymentMethod = ref("cash");
const receivedAmount = ref(0);
const billing = ref([]);

const columns = [
  {
    accessorKey: "className",
    header: $t("procedureName"),
  },
  {
    accessorKey: "cost",
    header: $t("points"),
    meta: {
      class: {
        th: "text-right",
        td: "text-right",
      },
    },
  },
];

const filteredProcedures = computed(() => {
  return billing.value.procedures?.filter((p) => p.classCode !== "212");
});

const fetchPaymentStatus = async () => {
  loading.value = true;
  try {
    const res = await $fetch(
      `/api/encounter/${props.encounter._id}/payment-status`,
    );
    billing.value = res;
  } catch (err) {
    console.error("Error fetching ORCA payment status in modal:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchPaymentStatus();
});

const changeDue = computed(() => {
  if (paymentMethod.value !== "cash") return 0;
  const change = receivedAmount.value - billing.value.amount;
  return change > 0 ? change : 0;
});

const isReceivedAmountValid = computed(() => {
  if (paymentMethod.value !== "cash") return true;
  return receivedAmount.value >= billing.value.amount;
});

// Quick cash helpers
function selectExactAmount() {
  receivedAmount.value = billing.value.amount;
}

function addCash(amount) {
  if (receivedAmount.value === 0) {
    receivedAmount.value = amount;
  } else {
    receivedAmount.value += amount;
  }
}

function clearCash() {
  receivedAmount.value = 0;
}

async function onCompletePayment() {
  loading.value = true;
  try {
    // Update the encounter status to 5 (completed)
    const response = await $fetch(`/api/encounter/${props.encounter._id}`, {
      method: "POST",
      body: {
        status: 5,
        payment: {
          method: paymentMethod.value,
          receivedAmount:
            paymentMethod.value === "cash"
              ? receivedAmount.value
              : billing.value.amount,
          receivedAmount: receivedAmount.value,
          points: billing.points,
          amount: billing.amount,
          paidAt: new Date().toISOString(),
        },
      },
    });

    toast.add({ title: $t("saved") });
    emit("close", { success: true });
  } catch (e) {
    console.error("Error completing payment:", e);
    toast.add({
      title: e.data?.message || e.message || "Error completing payment",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal v-if="systemStore.system" :ui="{ content: 'max-w-2xl!' }">
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon
          name="material-symbols:payments-outline-rounded"
          class="size-5 text-primary"
        />
        <span
          >{{ $t("payment") }} - {{ encounter.patient?.name?.family }}
          {{ encounter.patient?.name?.given }}</span
        >
      </div>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Patient info & Summary -->
        <div
          class="bg-neutral-50 dark:bg-slate-900 p-4 rounded-lg flex flex-wrap justify-between gap-4 text-sm border border-neutral-200 dark:border-slate-800"
        >
          <div>
            <span class="text-neutral-500 dark:text-neutral-400 mr-2"
              >{{ $t("id") }}:</span
            >
            <span class="font-semibold">{{ encounter.patient?.id }}</span>
          </div>
          <div>
            <span class="text-neutral-500 dark:text-neutral-400 mr-2"
              >{{ $t("name") }}:</span
            >
            <span class="font-semibold"
              >{{ encounter.patient?.name?.family }}
              {{ encounter.patient?.name?.given }}</span
            >
          </div>
          <div>
            <span class="text-neutral-500 dark:text-neutral-400 mr-2"
              >{{ $t("date") }}:</span
            >
            <span>{{ useDayjs()(encounter.date).format("LLL") }}</span>
          </div>
        </div>

        <!-- Skeletons while loading -->
        <div v-if="loading" class="space-y-6">
          <!-- Procedures list skeleton -->
          <div class="space-y-2">
            <USkeleton class="h-5 w-24" />
            <div
              class="border border-neutral-200 dark:border-slate-800 rounded-lg p-4 space-y-3"
            >
              <USkeleton class="h-4 w-full" />
              <USkeleton class="h-4 w-5/6" />
              <USkeleton class="h-4 w-4/5" />
            </div>
          </div>

          <!-- Calculations grid skeleton -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <USkeleton class="h-4 w-20" />
                <USkeleton class="h-10 w-full" />
              </div>
            </div>
            <div
              class="border border-neutral-200 dark:border-slate-800 p-4 rounded-lg space-y-3"
            >
              <div class="flex justify-between">
                <USkeleton class="h-4 w-1/3" /><USkeleton class="h-4 w-12" />
              </div>
              <div class="flex justify-between">
                <USkeleton class="h-4 w-1/4" /><USkeleton class="h-4 w-16" />
              </div>
              <div class="flex justify-between">
                <USkeleton class="h-4 w-1/3" /><USkeleton class="h-4 w-8" />
              </div>
              <div
                class="border-t border-neutral-200 dark:border-slate-800 pt-3 mt-3 flex justify-between"
              >
                <USkeleton class="h-5 w-20" />
                <USkeleton class="h-7 w-24" />
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <!-- Procedures / Billing List -->
          <div class="space-y-2">
            <h4
              class="text-sm font-semibold text-neutral-700 dark:text-neutral-300"
            >
              {{ $t("procedures") }}
            </h4>
            <div
              class="border border-neutral-200 dark:border-slate-800 rounded-lg overflow-hidden"
            >
              <UTable
                :data="filteredProcedures"
                :columns="columns"
                class="w-full"
              >
                <template #cost-cell="{ row }">
                  <span class="text-neutral-500 dark:text-neutral-400">
                    {{ row.original.cost }} {{ $t("point") }}
                  </span>
                </template>
              </UTable>
            </div>
          </div>

          <!-- Calculations -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <!-- Payment Method -->
              <UFormField :label="$t('paymentMethod')">
                <USelectMenu
                  v-model="paymentMethod"
                  :items="systemStore.system.settings.paymentMethods"
                  value-key="code"
                  class="w-full"
                >
                  <!-- selected value shown in trigger -->
                  <template #default="{ modelValue }">
                    <template v-if="modelValue">
                      <UIcon
                        :name="systemStore.icons[modelValue]"
                        class="size-4 shrink-0"
                      />
                      <span>{{ $t(modelValue) }}</span>
                    </template>
                    <span v-else class="text-muted">Select status...</span>
                  </template>

                  <!-- each item in the dropdown -->
                  <template #item-label="{ item }">
                    <UIcon
                      :name="systemStore.icons[item.code]"
                      class="size-4 shrink-0 mr-2"
                    />
                    <span>{{ $t(item.code) }}</span>
                  </template>
                </USelectMenu>
              </UFormField>
            </div>

            <!-- Total box -->
            <div
              class="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 p-4 rounded-lg flex flex-col justify-between"
            >
              <div
                class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <div class="flex justify-between">
                  <span>{{ $t("points") }}:</span>
                  <span
                    class="font-semibold text-neutral-800 dark:text-neutral-200"
                    >{{ billing.points }} {{ $t("point") }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span>{{ $t("paymentSum") }}:</span>
                  <span
                    class="font-semibold text-neutral-800 dark:text-neutral-200"
                    >{{ billing.points * 10 }} {{ $t("currencySymbol") }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span>{{ $t("copayRate") }}:</span>
                  <span
                    class="font-semibold text-neutral-800 dark:text-neutral-200"
                    >{{ billing.rate }}%</span
                  >
                </div>
              </div>
              <div
                class="border-t border-primary-200 dark:border-primary-950 pt-3 mt-3 flex justify-between items-baseline"
              >
                <span
                  class="text-sm font-semibold text-primary-700 dark:text-primary-400"
                  >{{ $t("amountDue") }}:</span
                >
                <span
                  class="text-2xl font-bold text-primary-600 dark:text-primary-300"
                >
                  {{ billing.amount }} {{ $t("currencySymbol") }}
                </span>
              </div>
            </div>
          </div>

          <!-- Cash Calculator (if cash is selected) -->
          <div
            v-if="paymentMethod === 'cash'"
            class="bg-neutral-50 dark:bg-slate-900 p-4 rounded-lg border border-neutral-200 dark:border-slate-800 space-y-4"
          >
            <div class="grid grid-cols-2 gap-4">
              <UFormField :label="$t('paymentMoneyReceived')">
                <div class="flex gap-2">
                  <UInput
                    v-model.number="receivedAmount"
                    type="number"
                    class="w-full text-lg font-semibold"
                    icon="material-symbols:currency-yen"
                  />
                  <UButton
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    @click="selectExactAmount"
                  >
                    {{ $t("exactAmount") }}
                  </UButton>
                </div>
              </UFormField>

              <div class="flex flex-col justify-end">
                <div class="text-sm text-neutral-500 dark:text-neutral-400">
                  {{ $t("paymentChange") }}
                </div>
                <div
                  class="text-2xl font-bold"
                  :class="
                    isReceivedAmountValid
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-500'
                  "
                >
                  <template v-if="isReceivedAmountValid">
                    {{ changeDue }} {{ $t("currencySymbol") }}
                  </template>
                  <template v-else>
                    {{ $t("insufficient") }}:
                    {{ billing.amount - receivedAmount }}
                    {{ $t("currencySymbol") }}
                  </template>
                </div>
              </div>
            </div>

            <!-- Quick cash buttons -->
            <div class="flex flex-wrap gap-2">
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                @click="addCash(1000)"
                >+1,000 {{ $t("currencySymbol") }}</UButton
              >
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                @click="addCash(5000)"
                >+5,000 {{ $t("currencySymbol") }}</UButton
              >
              <UButton
                size="xs"
                color="neutral"
                variant="outline"
                @click="addCash(10000)"
                >+10,000 {{ $t("currencySymbol") }}</UButton
              >
              <UButton
                size="xs"
                color="neutral"
                variant="subtle"
                @click="clearCash"
                >{{ $t("clear") }}</UButton
              >
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton
          color="neutral"
          variant="outline"
          :disabled="loading"
          @click="emit('close')"
        >
          {{ $t("cancel") }}
        </UButton>
        <UButton
          color="primary"
          :loading="loading"
          :disabled="!isReceivedAmountValid || loading"
          icon="material-symbols:check-circle-outline-rounded"
          @click="onCompletePayment"
        >
          {{ $t("paymentDone") }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
