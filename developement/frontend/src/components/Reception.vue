<template>
    <!-- Pass an explicit height so child components using flex-based scroll (scrollHeight="flex") can compute correctly.
         Adjust the 96px to match your header/footer height. -->
    <LayoutColumnsCard :columns="2" :height="'calc(100vh - 96px)'" no-padding>
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
