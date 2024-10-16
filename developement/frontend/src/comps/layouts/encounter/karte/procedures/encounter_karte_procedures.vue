<template>
    <div class="border rounded-md h-full">
        <Accordion
            :value="[]"
            multiple
            expandIcon="pi pi-angle-down"
            collapseIcon="pi pi-angle-left"
            lazy
            >
            <AccordionPanel
                v-for="(item, index) in encounterStore.encounterData.karte
                    .procedures"
                :value="index"
            >
                <AccordionHeader>
                    <div class="flex justify-between items-center w-full mr-2">
                        <div>
                            <i v-if="item.varData?.length > 0" :class="item.cat.icon" class="text-[var(--p-primary-color)]"  v-tooltip.left="$t('hasData')"/>
                            <i v-else :class="item.cat.icon"/>
                            <span class="ml-4">{{ item.name }}</span>
                        </div>
                        <div>
                            <Button @click="openOrder($event, index)" icon="pi pi-shopping-cart" severity="secondary" text size="small" class="!p-1"/>
                            <Button @click="openBilling($event, index)" icon="fas fa-yen-sign" severity="secondary" text size="small" class="!p-1"/>
                            <Button @click="deleteProcedure($event, index)" icon="pi pi-trash" severity="secondary" text size="small" class="!p-1"/>
                        </div>
                    </div>
                </AccordionHeader>
                <AccordionContent>
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

const openOrder = (event, index) => {
    console.log(index);
    console.log(event);
    event.stopPropagation();
    
}
const openBilling = (event, index) => {

}
const deleteProcedure = (event, index) => {

}
</script>
