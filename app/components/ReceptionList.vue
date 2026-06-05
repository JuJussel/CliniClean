<script setup>
import dayjs from "#build/dayjs.imports.mjs";
const systemStore = useSystemStore();
const overlay = useOverlay();
import { ModalPatientReservation, ModalPayment } from "#components";
const receptionList = ref(null);
const eventSource = ref(null);

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

onMounted(async () => {
    // Connect to SSE stream
    eventSource.value = new EventSource("/api/sse");
    eventSource.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateReceptionList(data);
    };

    getReceptionList();
});

const getReceptionList = async () => {
    const start = dayjs().startOf("day").toISOString();
    const end = dayjs().endOf("day").toISOString();
    const response = await fetch(
        `/api/encounter/range?start=${start}&end=${end}`,
    );
    receptionList.value = await response.json();
};

// Cleanup on component unmount
onUnmounted(() => {
    if (eventSource.value) {
        eventSource.value.close();
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


    
    const paymentModal = overlay.create(ModalPayment, {
        destroyOnClose: true,
    });
    const action = await paymentModal.open({ encounter: encounter });

    if (action?.success) {
        await getReceptionList();
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
                v-model="row.original.status"
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
                <UButton
                    size="xs"
                    variant="outline"
                    color="neutral"
                    icon="material-symbols:payments-outline-rounded"
                    @click="startPayment(row.original)"
                    v-if="row.original.status === 4"
                >
                    {{ $t("startPayment") }}
                </UButton>
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
                    @click=""
                >
                    {{ $t("edit") }}
                </UButton>
            </div>
        </template>
    </UTable>
</template>
