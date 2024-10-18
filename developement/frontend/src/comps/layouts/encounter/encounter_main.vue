<template>
    <div class="grid gap-2 grid-cols-9">
        <splitter class="col-span-7" style="background: none; border: none">
            <splitterPanel class="grid w-full mr-[0.25rem]">
                <Card
                    :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }"
                >
                    <template #content> </template>
                </Card>
            </splitterPanel>
            <splitterPanel class="grid w-full ml-[0.25rem]">
                <Card
                    :pt="{ body: { class: 'h-full' }, content: { class: 'h-full' } }"
                >
                    <template #content>
                        <Karte v-if="ready" />
                    </template>
                </Card>
            </splitterPanel>
        </splitter>
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
