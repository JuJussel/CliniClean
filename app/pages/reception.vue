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


// Connect to SSE stream
const eventSource = ref(null)
onMounted(() => {
    eventSource.value = new EventSource('/api/sse')
    eventSource.value.onmessage = (event) => {
        console.log(event);
        
    }
})

// Cleanup on component unmount
onUnmounted(() => {
    if (eventSource.value) {
        eventSource.value.close()
    }
})
</script>

<template>
    <div class="grid grid-cols-2 gap-4 h-full">

        <UCard>
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
                    <div class="h-full">Calendar</div>
                </template>
            </UTabs>
        </UCard>
    </div>
</template>
