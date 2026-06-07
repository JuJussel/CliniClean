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

const submitting = ref(false);
const copayRate = ref(30); // Default copayment rate 30%
const paymentMethod = ref("cash");
const receivedAmount = ref(0);

// Copayment options
const copayOptions = [
    { label: "30%", value: 30 },
    { label: "10%", value: 10 },
    { label: "100% (自費)", value: 100 },
];

// Payment methods
const paymentMethodOptions = [
    { label: "現金 (Cash)", value: "cash", icon: "material-symbols:attach-money" },
    { label: "クレジットカード (Credit Card)", value: "credit_card", icon: "material-symbols:credit-card" },
    { label: "QR決済 (QR Pay)", value: "qr_code", icon: "material-symbols:qr-code-2" },
];

// Fallback dummy procedures if none exist in the encounter
const dummyProcedures = [
    { name: "初診料 (Initial Consultation)", cost: 288 },
    { name: "処方料 (Prescription Fee)", cost: 68 },
];

const orcaStatus = ref("loading");
const orcaPoints = ref(0);
const orcaAmount = ref(0);
const fetchError = ref(null);

const baseCostCatalog = {
    '111000110': { name: '初診料 (Initial Consultation)', cost: 288 },
    '112007410': { name: '再診料 (Follow-up Consultation)', cost: 74 },
    '111000770': { name: '初診深夜加算', cost: 480 },
    '111012170': { name: '初診深夜加算(小児)', cost: 480 },
    '111000670': { name: '初診休日加算', cost: 365 },
    '111012070': { name: '初診休日加算(小児)', cost: 365 },
    '111000570': { name: '初診時間外加算', cost: 85 },
    '111011970': { name: '初診時間外加算(小児)', cost: 85 },
    '111012470': { name: '初診夜間早朝等加算', cost: 50 },
    '112001310': { name: '再診深夜加算', cost: 420 },
    '112014970': { name: '再診深夜加算(小児)', cost: 420 },
    '112001210': { name: '再診休日加算', cost: 260 },
    '112014870': { name: '再診休日加算(小児)', cost: 260 },
    '112001110': { name: '再診時間外加算', cost: 65 },
    '112014770': { name: '再診時間外加算(小児)', cost: 65 },
    '112015570': { name: '再診夜間早朝等加算', cost: 50 },
    '112000970': { name: '再診乳幼児加算', cost: 38 },
    '111000370': { name: '初診乳幼児加算', cost: 75 }
};

const fetchPaymentStatus = async () => {
    orcaStatus.value = "loading";
    try {
        const res = await $fetch(`/api/encounter/${props.encounter._id}/payment-status`);
        orcaStatus.value = res.status;
        if (res.status === "ready_to_pay") {
            orcaPoints.value = res.points || 0;
            orcaAmount.value = res.amount || 0;
        }
    } catch (err) {
        console.error("Error fetching ORCA payment status in modal:", err);
        orcaStatus.value = "error";
        fetchError.value = err.data?.message || err.message || "Failed to fetch ORCA status";
    }
};

onMounted(async () => {
    await fetchPaymentStatus();
});

const proceduresList = computed(() => {
    const list = [];
    
    // Add base cost items if present
    const baseCostItems = props.encounter?.baseCost || [];
    for (const item of baseCostItems) {
        const catalogItem = baseCostCatalog[item.code];
        if (catalogItem) {
            list.push({
                name: catalogItem.name,
                cost: catalogItem.cost
            });
        } else {
            list.push({
                name: `基本診療料 (${item.code})`,
                cost: 0
            });
        }
    }

    // Add doctor's entered procedures
    const procItems = props.encounter?.karte?.procedures || [];
    for (const item of procItems) {
        list.push({
            name: item.name,
            cost: item.cost || item.tensu || 0
        });
    }

    if (list.length > 0) {
        return list;
    }
    return dummyProcedures;
});

const totalPoints = computed(() => {
    if (orcaStatus.value === "ready_to_pay") {
        return orcaPoints.value;
    }
    return proceduresList.value.reduce((sum, item) => sum + (item.cost || 0), 0);
});

const totalPrice = computed(() => {
    return totalPoints.value * 10;
});

const amountToPay = computed(() => {
    if (orcaStatus.value === "ready_to_pay") {
        return orcaAmount.value;
    }
    return Math.round(totalPrice.value * (copayRate.value / 100));
});

const changeDue = computed(() => {
    if (paymentMethod.value !== "cash") return 0;
    const change = receivedAmount.value - amountToPay.value;
    return change > 0 ? change : 0;
});

const isReceivedAmountValid = computed(() => {
    if (paymentMethod.value !== "cash") return true;
    return receivedAmount.value >= amountToPay.value;
});

// Quick cash helpers
function selectExactAmount() {
    receivedAmount.value = amountToPay.value;
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
    submitting.value = true;
    try {
        // Update the encounter status to 5 (completed)
        const response = await $fetch(`/api/encounter/${props.encounter._id}`, {
            method: "POST",
            body: {
                status: 5,
                payment: {
                    method: paymentMethod.value,
                    copayRate: copayRate.value,
                    totalPoints: totalPoints.value,
                    amountToPay: amountToPay.value,
                    receivedAmount: paymentMethod.value === 'cash' ? receivedAmount.value : amountToPay.value,
                    changeDue: changeDue.value,
                    paidAt: new Date().toISOString()
                }
            },
        });

        toast.add({ title: $t("saved") });
        emit("close", { success: true });
    } catch (e) {
        console.error("Error completing payment:", e);
        toast.add({ title: e.data?.message || e.message || "Error completing payment", color: "error" });
    } finally {
        submitting.value = false;
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
                <span>{{ $t("payment") }} - {{ encounter.patient?.name?.family }} {{ encounter.patient?.name?.given }}</span>
            </div>
        </template>

        <template #body>
            <div class="space-y-6">
                <!-- Patient info & Summary -->
                <div class="bg-neutral-50 dark:bg-slate-900 p-4 rounded-lg flex flex-wrap justify-between gap-4 text-sm border border-neutral-200 dark:border-slate-800">
                    <div>
                        <span class="text-neutral-500 dark:text-neutral-400 mr-2">{{ $t("id") }}:</span>
                        <span class="font-semibold">{{ encounter.patient?.id }}</span>
                    </div>
                    <div>
                        <span class="text-neutral-500 dark:text-neutral-400 mr-2">{{ $t("name") }}:</span>
                        <span class="font-semibold">{{ encounter.patient?.name?.family }} {{ encounter.patient?.name?.given }}</span>
                    </div>
                    <div>
                        <span class="text-neutral-500 dark:text-neutral-400 mr-2">{{ $t("date") }}:</span>
                        <span>{{ useDayjs()(encounter.date).format("LLL") }}</span>
                    </div>
                </div>

                <!-- ORCA Status Warning / Spinner Banner -->
                <div v-if="orcaStatus === 'loading'" class="bg-neutral-50 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-4 rounded-lg flex flex-col items-center justify-center gap-2 text-sm text-neutral-500">
                    <UIcon name="svg-spinners:ring-resize" class="size-6 text-primary" />
                    <span>ORCAの精算状態を確認しています...</span>
                </div>

                <div v-else-if="orcaStatus === 'in_progress'" class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-amber-700 dark:text-amber-400">
                    <div class="flex items-center gap-2">
                        <UIcon name="material-symbols:warning-amber-rounded" class="size-5 text-amber-500 shrink-0" />
                        <span>
                            ORCA端末での会計精算が完了していません。ORCA側で「中途終了」したデータを呼び出して精算処理を完了させてください。
                        </span>
                    </div>
                    <UButton size="xs" color="amber" variant="subtle" icon="material-symbols:refresh" @click="fetchPaymentStatus">
                        状態を更新する
                    </UButton>
                </div>

                <div v-else-if="orcaStatus === 'not_registered'" class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-amber-700 dark:text-amber-400">
                    <div class="flex items-center gap-2">
                        <UIcon name="material-symbols:warning-amber-rounded" class="size-5 text-amber-500 shrink-0" />
                        <span>
                            ORCAへの受付登録・送信が行われていません。「会計開始」から送信処理を完了させてください。
                        </span>
                    </div>
                    <UButton size="xs" color="amber" variant="subtle" icon="material-symbols:refresh" @click="fetchPaymentStatus">
                        状態を更新する
                    </UButton>
                </div>

                <div v-else-if="orcaStatus === 'error'" class="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-red-700 dark:text-red-400">
                    <div class="flex items-center gap-2">
                        <UIcon name="material-symbols:error-outline-rounded" class="size-5 text-red-500 shrink-0" />
                        <span>ORCAの通信エラー: {{ fetchError || '状態を取得できませんでした。' }}</span>
                    </div>
                    <UButton size="xs" color="error" variant="subtle" icon="material-symbols:refresh" @click="fetchPaymentStatus">
                        再試行
                    </UButton>
                </div>

                <div v-else-if="orcaStatus === 'ready_to_pay'" class="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4 rounded-lg flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                    <UIcon name="material-symbols:check-circle-outline-rounded" class="size-5 text-green-500 shrink-0" />
                    <span>ORCA側での精算が確認されました。以下の金額で会計を完了してください。</span>
                </div>

                <!-- Procedures / Billing List -->
                <div class="space-y-2">
                    <h4 class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        {{ $t("procedures") }}
                    </h4>
                    <div class="border border-neutral-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <table class="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr class="bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-neutral-400">
                                    <th class="p-3 font-semibold">{{ $t("procedureName") }}</th>
                                    <th class="p-3 text-right font-semibold">{{ $t("points") }}</th>
                                    <th class="p-3 text-right font-semibold">{{ $t("costInCurrency") }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-200 dark:divide-slate-800">
                                <tr v-for="(proc, i) in proceduresList" :key="i" class="hover:bg-neutral-50 dark:hover:bg-slate-800/50">
                                    <td class="p-3">{{ proc.name }}</td>
                                    <td class="p-3 text-right text-neutral-500">{{ proc.cost }} 点</td>
                                    <td class="p-3 text-right font-medium">{{ proc.cost * 10 }} {{ $t("currencySymbol") }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Calculations -->
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <!-- Copayment rate select -->
                        <UFormField :label="$t('insurance') + $t('relation')">
                            <USelect
                                v-slot="{ label }"
                                v-model="copayRate"
                                :items="copayOptions"
                                value-key="value"
                                label-key="label"
                                class="w-full"
                            >
                                {{ label || '30%' }}
                            </USelect>
                        </UFormField>

                        <!-- Payment Method -->
                        <UFormField :label="$t('paymentMethod')">
                            <USelect
                                v-slot="{ label }"
                                v-model="paymentMethod"
                                :items="paymentMethodOptions"
                                value-key="value"
                                label-key="label"
                                class="w-full"
                            >
                                {{ label || '現金 (Cash)' }}
                            </USelect>
                        </UFormField>
                    </div>

                    <!-- Total box -->
                    <div class="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 p-4 rounded-lg flex flex-col justify-between">
                        <div class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <div class="flex justify-between">
                                <span>{{ $t("points") }}:</span>
                                <span class="font-semibold text-neutral-800 dark:text-neutral-200">{{ totalPoints }} 点</span>
                            </div>
                            <div class="flex justify-between">
                                <span>{{ $t("paymentSum") }}:</span>
                                <span class="font-semibold text-neutral-800 dark:text-neutral-200">{{ totalPrice }} {{ $t("currencySymbol") }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>負担割合:</span>
                                <span class="font-semibold text-neutral-800 dark:text-neutral-200">{{ copayRate }}%</span>
                            </div>
                        </div>
                        <div class="border-t border-primary-200 dark:border-primary-950 pt-3 mt-3 flex justify-between items-baseline">
                            <span class="text-sm font-semibold text-primary-700 dark:text-primary-400">請求額 (Due):</span>
                            <span class="text-2xl font-bold text-primary-600 dark:text-primary-300">
                                {{ amountToPay }} {{ $t("currencySymbol") }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Cash Calculator (if cash is selected) -->
                <div v-if="paymentMethod === 'cash'" class="bg-neutral-50 dark:bg-slate-900 p-4 rounded-lg border border-neutral-200 dark:border-slate-800 space-y-4">
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
                                    丁度
                                </UButton>
                            </div>
                        </UFormField>

                        <div class="flex flex-col justify-end">
                            <div class="text-sm text-neutral-500 dark:text-neutral-400">{{ $t("paymentChange") }}</div>
                            <div class="text-2xl font-bold" :class="isReceivedAmountValid ? 'text-green-600 dark:text-green-400' : 'text-red-500'">
                                <template v-if="isReceivedAmountValid">
                                    {{ changeDue }} {{ $t("currencySymbol") }}
                                </template>
                                <template v-else>
                                    不足: {{ amountToPay - receivedAmount }} {{ $t("currencySymbol") }}
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Quick cash buttons -->
                    <div class="flex flex-wrap gap-2">
                        <UButton size="xs" color="neutral" variant="outline" @click="addCash(1000)">+1,000円</UButton>
                        <UButton size="xs" color="neutral" variant="outline" @click="addCash(5000)">+5,000円</UButton>
                        <UButton size="xs" color="neutral" variant="outline" @click="addCash(10000)">+10,000円</UButton>
                        <UButton size="xs" color="neutral" variant="subtle" @click="clearCash">クリア</UButton>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <UButton
                    color="neutral"
                    variant="outline"
                    :disabled="submitting"
                    @click="emit('close')"
                >
                    {{ $t("cancel") }}
                </UButton>
                <UButton
                    color="primary"
                    :loading="submitting"
                    :disabled="!isReceivedAmountValid || submitting || orcaStatus === 'loading' || orcaStatus === 'in_progress' || orcaStatus === 'not_registered'"
                    icon="material-symbols:check-circle-outline-rounded"
                    @click="onCompletePayment"
                >
                    {{ $t("paymentDone") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
