<template>
    <DataTable
        :value="receptionStore.scheduleData"
        :loading="receptionStore.loading.schedule"
        v-model:selection="receptionStore.selectedEncounter"
        dataKey="_id"
        scrollable
        selectionMode="single"
        scrollHeight="flex"
    >
        <template #empty>
            <div class="flex justify-center">
                <img
                    src="@/assets/img/empty2.jpg"
                    alt="Nothing here"
                    class="w-2/5"
                />
            </div>
        </template>
        <Column field="patient.name" :header="$t('name')"></Column>
        <Column field="type" :header="$t('encounterType')">
            <template #body="slotProps">
                <span> {{ parseExamType(slotProps.data.type) }} </span>
            </template>
        </Column>
        <Column field="status" :header="$t('status')">
            <template #body="slotProps">
                <Tag
                    :value="
                        $t(
                            listStore.listData.encounterStatuses[
                                slotProps.data.status
                            ].name
                        )
                    "
                    class="text-white"
                    :severity="
                        listStore.listData.encounterStatuses[
                            slotProps.data.status
                        ].color
                    "
                />
            </template>
        </Column>
        <Column field="lastChange" :header="$t('waitTime')">
            <template #body="slotProps">
                <span>
                    {{ parseWaitTime(slotProps.data.lastChange).time }}
                </span>
            </template>
        </Column>
        <Column field="date" :header="$t('receptionTime')">
            <template #body="slotProps">
                <span>
                    {{ dayjs(slotProps.data.date).format("HH時mm分") }}
                </span>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
import useAcl from "@/composables/aclComposable.js";
import dayjs from "dayjs";

const listStore = useListStore();
const receptionStore = useReceptionStore();

// proxy.$socket.onmessage = (res) => {
//     if (JSON.parse(res.data).event === "updateEncounter") getSchedule();
// };

function parseExamType(type) {
    const types = listStore.listData.encounterTypes;
    let string = "";
    string = types?.find((item) => item.id == type).name;
    return string;
}

function parseWaitTime(change) {
    let time = dayjs(change).fromNow(true);
    let diff = dayjs().diff(dayjs(change), "minutes");
    return {
        time: time,
        diff: diff,
    };
}
</script>
