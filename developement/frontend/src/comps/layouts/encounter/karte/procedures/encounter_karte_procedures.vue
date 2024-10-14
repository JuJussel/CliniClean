<template>
    <div class="border rounded-md h-full">
        <Accordion
            :value="[]"
            multiple
            expandIcon="pi pi-angle-down"
            collapseIcon="pi pi-angle-left"
        >
            <AccordionPanel
                v-for="(item, index) in encounterStore.encounterData.karte
                    .procedures"
                :value="index"
            >
                <AccordionHeader>
                    <div>
                        <i :class="item.cat.icon" />
                        <span class="ml-4">{{ item.name }}</span>
                    </div>
                </AccordionHeader>
                <AccordionContent>
                    {{ item.cat?.label }}
                    <component :is="parts[item.cat?.label]" :item />
                    <!-- <exam v-if="item.cat?.label === 'exam'" item></exam> -->
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup>
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
//Parts
import Exam from "./parts/procedure_exam.vue";

const encounterStore = useEncounterStore();

const parts = {
    exam: Exam,
};
</script>
