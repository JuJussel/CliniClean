<script setup>

const props = defineProps(['encounter']);
const editable = ref(true);
const loading = ref(false);

const addProcedure = (procedure) => {
    props.encounter.karte.procedures.push(procedure);
};

const saveState = () => {
    loading.value = true;
    try {
        fetch('/api/encounter/' + props.encounter._id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.encounter),
        });
    } catch (error) {
        console.error('Error saving state:', error);
    } finally {
        loading.value = false;
    }
}

let saveTimeout = null;

watch(() => props.encounter.karte, () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveState();
    }, 2000);
}, { deep: true });
</script>

<template>
    <div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <UCard :ui="{ body: 'p-0 sm:p-0' }">
                    <template #header>
                        <h3 class="text-base font-semibold">
                            {{ $t("soap") }}
                        </h3>
                    </template>

                    <CompTextEditor
                        v-model="encounter.karte.soap"
                        class="h-full"
                    />
                </UCard>
            </div>

            <div class="space-y-4">
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
                            color="neutral"
                            >Print</UButton
                        >
                        <UButton
                            icon="i-heroicons-archive-box"
                            size="sm"
                            color="neutral"
                            >Archive</UButton
                        >
                        <USlideover>
                            <UButton label="Open" color="neutral" variant="subtle" />
                            <template #content>
                                <CompProcedureBrowser class="h-full m-4" @selected="addProcedure" />
                            </template>
                        </USlideover>
                    </div>
                </UCard>

                <UCard>
                    <template #header>
                        <h3 class="text-base font-semibold">Past Encounters</h3>
                    </template>

                    <CompProcedure 
                        :procedures="encounter.karte.procedures"
                    />
                </UCard>
            </div>
        </div>
    </div>
</template>
