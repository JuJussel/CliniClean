<template>
    <div class="grid gap-2 grid-cols-9">
        <Card
            :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }"
            class="col-span-3"
        >
            <template #content> </template>
        </Card>
        <Card
            :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }"
            class="col-span-4"
        >
            <template #content>
                <Karte v-if="ready" />
            </template>
        </Card>
        <Card 
        :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }"
        class="col-span-2">
            <template #content>
                <Browser />
            </template>
        </Card>
    </div>
</template>

<script setup>
import Karte from "./karte";
import Browser from "./browser";

const encounterStore = useEncounterStore();
const ready = ref(false);

// Initialize Encounter Store Karte Data
if (!encounterStore.encounterData.karte) {
    encounterStore.encounterData.karte = {
        soap: "",
        procedures: [],
        images: [],
    };
}
ready.value = true;
</script>
