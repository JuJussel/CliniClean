<template>
    <div class="border rounded-md h-full">
        <Accordion
            :value="[]"
            multiple
            expandIcon="pi pi-plus"
            collapseIcon="pi pi-minus"
        >
            <AccordionPanel
                v-for="(item, index) in encounterStore.encounterData.karte
                    .procedures"
                :value="index"
            >
                <AccordionHeader>{{ item.name }}</AccordionHeader>
                <AccordionContent> Expand </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup>
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

const encounterStore = useEncounterStore();
</script>
