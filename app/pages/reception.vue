<script setup>
definePageMeta({
    middleware: ["authenticated"],
});

const items = ref([
    {
        label: $t("register"),
        icon: "i-material-symbols-person-add-rounded",
        slot: "newWalkin",
    },
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
            <template #header> </template>
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
                <template #newWalkin>
                    <div class="h-full">New Walkin</div>
                </template>
                <template #search>
                    <ReceptionPatientSearch class="h-full" />
                </template>
                <template #calendar>
                    <div class="h-full">Calendar</div>
                </template>
            </UTabs>
        </UCard>
    </div>
</template>
