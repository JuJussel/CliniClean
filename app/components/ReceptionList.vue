<script setup>
import dayjs from "#build/dayjs.imports.mjs";
import { ModalPatientReservation, ModalPayment } from "#components";

const systemStore = useSystemStore();
const overlay = useOverlay();
const toast = useToast();
const receptionList = ref(null);
const eventSource = ref(null);
const paymentStatuses = ref({});
let statusPollInterval = null;

const columns = [
    {
        accessorKey: "patient.id",
        header: $t("id"),
    },
    {
        accessorKey: "name",
        header: $t("name"),
        cell: (row) => {
            const patient = row.row.original.patient;
            return `${patient.name?.family} ${patient.name?.given}`;
        },
    },
    {
        accessorKey: "date",
        header: $t("waitTime"),
        cell: (row) => {
            const encounter = row.row.original;
            return dayjs().diff(encounter.date, "minute") + " " + $t("minutes");
        },
    },
    {
        accessorKey: "status",
        header: $t("status"),
        cell: (row) => {
            const encounter = row.row.original;
            const label = systemStore.system.ui.encounterStati.find(
                (status) => status.id === encounter.status,
            )?.label;
            return $t(label);
        },
    },
    {
        accessorKey: "actions",
        header: "",
    },
];

const checkPaymentStatus = async (encounterId) => {
    try {
        const res = await $fetch(`/api/encounter/${encounterId}/payment-status`);
        paymentStatuses.value[encounterId] = res;
    } catch (err) {
        console.error(`Error fetching payment status for ${encounterId}:`, err);
    }
};

const startStatusPolling = () => {
    if (statusPollInterval) clearInterval(statusPollInterval);
    statusPollInterval = setInterval(async () => {
        if (!receptionList.value) return;
        const pendingEncounters = receptionList.value.filter(
            (enc) => enc.status === 4 && (!paymentStatuses.value[enc._id] || paymentStatuses.value[enc._id].status !== "ready_to_pay")
        );
        for (const enc of pendingEncounters) {
            await checkPaymentStatus(enc._id);
        }
    }, 15000);
};

onMounted(async () => {
    // Connect to SSE stream
    eventSource.value = new EventSource("/api/sse");
    eventSource.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateReceptionList(data);
    };

    await getReceptionList();
    startStatusPolling();
});

const getReceptionList = async () => {
    const start = dayjs().startOf("day").toISOString();
    const end = dayjs().endOf("day").toISOString();
    const response = await fetch(
        `/api/encounter/range?start=${start}&end=${end}`,
    );
    receptionList.value = await response.json();

    // Fetch initial status for any payment stage encounters
    if (receptionList.value) {
        const pendingEncounters = receptionList.value.filter(enc => enc.status === 4);
        for (const enc of pendingEncounters) {
            checkPaymentStatus(enc._id);
        }
    }
};

// Cleanup on component unmount
onUnmounted(() => {
    if (eventSource.value) {
        eventSource.value.close();
    }
    if (statusPollInterval) {
        clearInterval(statusPollInterval);
    }
});

const updateReceptionList = async (event) => {
    if (event.event === "encounterCreated") {
        await getReceptionList();
    }
};

async function openReservationModal(patient) {
    const reservationModal = overlay.create(ModalPatientReservation, {
        destroyOnClose: true,
    });
    const action = await reservationModal.open({ patient: patient });

    if (!action) return;
}

async function startPayment(encounter) {
    toast.add({
        id: "orca-loading",
        title: $t("orcaLoadingTitle"),
        description: $t("orcaLoadingDesc"),
        color: "primary",
        timeout: 0
    });

    try {
        const response = await $fetch(`/api/encounter/${encounter._id}/start-payment`, {
            method: "POST"
        });

        toast.remove("orca-loading");
        await getReceptionList();
    } catch (error) {
        toast.remove("orca-loading");
        console.error("Error starting payment:", error);
        toast.add({
            title: $t("orcaErrorTitle"),
            description: error.data?.message || error.message || $t("orcaErrorDesc"),
            color: "error"
        });
    }
}

async function openPaymentModal(encounter) {
    const paymentModal = overlay.create(ModalPayment, {
        destroyOnClose: true,
    });
    await paymentModal.open({ encounter });
    await getReceptionList();
}

async function updateEncounterStatus(encounterId, newStatus) {
    try {
        await $fetch(`/api/encounter/${encounterId}`, {
            method: "POST",
            body: {
                status: newStatus
            }
        });
        toast.add({ title: $t("saved") });
        await getReceptionList();
    } catch (error) {
        console.error("Error updating encounter status:", error);
        toast.add({
            title: $t("orcaErrorTitle"),
            description: error.data?.message || error.message || "Failed to update encounter status",
            color: "error"
        });
    }
}
</script>

<template>
    <div class="h-full">List</div>
    <UTable
        :columns="columns"
        :data="receptionList"
        :loading="!receptionList"
        row-key="id"
        v-if="systemStore.system"
    >
        <template #name-cell="{ row }">
            <div>
                <ULink
                    inactive-class="text-primary hover:text-primary/80"
                    :to="
                        '/patient/' +
                        row.original.patient.id +
                        '?encounterId=' +
                        row.original._id
                    "
                >
                    {{ row.original.patient.name?.family }}
                    {{ row.original.patient.name?.given }}
                </ULink>
            </div>
        </template>
        <template #status-cell="{ row }">
            <USelect
                :model-value="row.original.status"
                @update:model-value="(val) => updateEncounterStatus(row.original._id, val)"
                :items="systemStore.system.ui.encounterStati || []"
                valueKey="id"
                :placeholder="$t('select')"
                searchable
                class="w-32"
            >
                <template #default="{ modelValue }">
                    <div
                        :style="{
                            color:
                                'var(' +
                                systemStore.system.ui.encounterStati.find(
                                    (status) => status.id === modelValue,
                                )?.color +
                                ')',
                        }"
                    >
                        {{
                            modelValue
                                ? $t(
                                      systemStore.system.ui.encounterStati.find(
                                          (status) => status.id === modelValue,
                                      )?.label,
                                  )
                                : $t("select")
                        }}
                    </div>
                </template>
                <template #item="{ item }">
                    <div :style="{ color: 'var(' + item.color + ')' }">
                        {{ item.label }}
                    </div>
                </template>
            </USelect>
        </template>
        <template #actions-cell="{ row }">
            <div class="flex gap-2 justify-end">
                <!-- Case 1: Start Payment (Kick off Payment) -->
                <!-- Show if either status is 3, or status is 4 and ORCA says not_registered -->
                <UButton
                    v-if="(row.original.status === 4 && paymentStatuses[row.original._id]?.status === 'not_registered')"
                    size="xs"
                    variant="outline"
                    color="neutral"
                    icon="material-symbols:payments-outline-rounded"
                    @click="startPayment(row.original)"
                >
                    {{ $t("startPayment") }}
                </UButton>

                <!-- Case 2: ORCA in progress / checking status -->
                <!-- Show if status is 4 and ORCA says in_progress or loading -->
                <UButton
                    v-else-if="row.original.status === 4 && (paymentStatuses[row.original._id]?.status === 'in_progress' || paymentStatuses[row.original._id]?.status === 'loading')"
                    size="xs"
                    variant="outline"
                    color="neutral"
                    icon="material-symbols:hourglass-empty"
                    disabled
                >
                    {{ $t("processingOnOrca") }}
                </UButton>

                <!-- Case 3: Ready to Pay -->
                <!-- Show if status is 4 and ORCA says ready_to_pay -->
                <UButton
                    v-else-if="row.original.status === 4 && paymentStatuses[row.original._id]?.status === 'ready_to_pay'"
                    size="xs"
                    variant="solid"
                    icon="material-symbols:payments-outline-rounded"
                    @click="openPaymentModal(row.original)"
                >
                    {{ $t("readyToPay") }}
                </UButton>
                <UButton v-else-if="row.original.status === 4" loading variant="ghost"/>
                <UButton
                    size="xs"
                    variant="outline"
                    color="neutral"
                    icon="material-symbols:calendar-clock-rounded"
                    @click="openReservationModal(row.original.patient)"
                >
                    {{ $t("reservation") }}
                </UButton>
                <UButton
                    size="xs"
                    variant="outline"
                    color="neutral"
                    icon="material-symbols:person-edit-sharp"
                >
                    {{ $t("edit") }}
                </UButton>
            </div>
        </template>
    </UTable>
</template>
