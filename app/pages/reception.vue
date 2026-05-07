<script setup>
const items = ref([
    {
        label: $t("patientSearch"),
        icon: "i-material-symbols-search-rounded",
        slot: "search",
    },
    {
        label: $t("calendar"),
        icon: "i-material-symbols-calendar-month-rounded",
        slot: "calendar",
    },
]);

</script>

<template>
    <div class="grid grid-cols-2 gap-4 h-full">
        <UCard>
            <ReceptionList class="h-full" />
        </UCard>

        <UCard
            :ui="{
                body: 'h-full',
            }"
        >
            <UTabs
                :items="items"
                color="neutral"
                class="h-full"
                :ui="{
                    content: 'h-full',
                }"
            >
                <template #search>
                    <ReceptionPatientSearch class="h-full" />
                </template>
                <template #calendar>
                    <ReceptionCalendar class="h-full" />
                </template>
            </UTabs>
        </UCard>
    </div>
</template>
