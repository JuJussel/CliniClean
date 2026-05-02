<script setup>
import dayjs from "#build/dayjs.imports.mjs";
const systemStore = useSystemStore();

const receptionList = ref(null);
const columns = [
    {
        accessorKey: "patient.id",
        header: $t("id"),
    },
    {
        accessorKey: "patient.name.family",
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
];

onMounted(async () => {
    const start = dayjs().startOf("day").toISOString();
    const end = dayjs().endOf("day").toISOString();
    const response = await fetch(
        `/api/encounter/range?start=${start}&end=${end}`,
    );
    receptionList.value = await response.json();
});
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
    </UTable>
</template>
