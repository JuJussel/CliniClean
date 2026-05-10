<template>
    <div class="p-4">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8">
                <UCard>
                    <template #header>
                        <h3 class="text-base font-semibold">Clinical Notes</h3>
                    </template>

                    <UTextarea
                        color="white"
                        variant="outline"
                        placeholder="Type your notes here..."
                        :rows="20"
                        autoresize
                    />
                </UCard>
            </div>

            <div class="col-span-4 space-y-4">
                <UCard>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <UButton
                            icon="i-heroicons-plus"
                            size="sm"
                            color="primary"
                            >Add Entry</UButton
                        >
                        <UButton
                            icon="i-heroicons-printer"
                            size="sm"
                            color="gray"
                            >Print</UButton
                        >
                        <UButton
                            icon="i-heroicons-archive-box"
                            size="sm"
                            color="gray"
                            >Archive</UButton
                        >
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h3 class="text-base font-semibold">Past Encounters</h3>
                    </template>

                    <UAccordion :items="dummyEncounters">
                        <template #item="{ item }">
                            <div
                                class="p-4 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-b-lg"
                            >
                                {{ item.content }}
                                <div class="mt-2">
                                    <UButton
                                        size="2xs"
                                        variant="ghost"
                                        color="primary"
                                        >View Details</UButton
                                    >
                                </div>
                            </div>
                        </template>
                    </UAccordion>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup>
// Dummy data for the collapsible items
const dummyEncounters = [
    {
        label: "May 11, 2026 - Routine Checkup",
        icon: "i-heroicons-calendar",
        content:
            "Patient reported slight dizziness. BP: 120/80. Prescribed hydration and rest.",
    },
    {
        label: "April 20, 2026 - Vaccination",
        icon: "i-heroicons-beaker",
        content:
            "Administered seasonal influenza vaccine. No immediate adverse reactions.",
    },
    {
        label: "March 05, 2026 - Lab Results",
        icon: "i-heroicons-document-text",
        content:
            "Blood work indicates normal levels across all primary markers.",
    },
];
</script>
