<template>
    <LayoutColumnsCard :columns="2" no-padding>
        <template #column-1-content>
            <ReceptionSchedule />
        </template>
        <template #column-2-content>
            <ReceptionEditor />
        </template>
    </LayoutColumnsCard>
</template>

<script setup>
import LayoutColumnsCard from "@/layouts/LayoutColumnsCard.vue";
import ReceptionSchedule from "@/components/ReceptionSchedule.vue";
import ReceptionEditor from "@/components/ReceptionEditor.vue";

const receptionStore = useReceptionStore();

receptionStore.setScheduleData();
</script>
