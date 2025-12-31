<template>
    <!-- Pass an explicit height so child components using flex-based scroll (scrollHeight="flex") can compute correctly.
         Adjust the 96px to match your header/footer height. -->
    <LayoutColumns :columns="2" :height="'calc(100vh - 196px)'" no-padding>
        <template #column-1-content>
            <LayoutColumnsCard :columns="1">
                <template #column-1-content>
                    <ReceptionSchedule />
                </template>
            </LayoutColumnsCard>
        </template>
        <template #column-2-content>
            <ReceptionEditor />
        </template>
    </LayoutColumns>
</template>

<script setup>
import LayoutColumns from "@/layouts/LayoutColumns.vue";
import LayoutColumnsCard from "@/layouts/LayoutColumnsCard.vue";
import ReceptionSchedule from "@/components/ReceptionSchedule.vue";
import ReceptionEditor from "@/components/ReceptionEditor.vue";

const receptionStore = useReceptionStore();

receptionStore.setScheduleData();
</script>
