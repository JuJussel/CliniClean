<template>
    <LayoutColumnsCard :columns="1">
        <!-- <template #column-1-header>
            <div class="flex items-center mt-1">
                <div v-if="history.length > 0">
                    <Button
                        icon="pi pi-arrow-left"
                        :label="$t('back')"
                        class="p-button-text mr-2"
                        @click="goBack"
                        raised
                        variant="outlined"
                    />
                </div>
                <ReceptionEditorPatientSearchControls />
            </div>
        </template> -->
        <template #column-1-content>
            <div class="p-2">
                <div class="overflow-hidden">
                    <component
                        :is="{ ...uiStore.tabs.reception.multiview.mode }"
                    />
                </div>
            </div>
        </template>
    </LayoutColumnsCard>
</template>

<script setup>
import ReceptionEditorPatientSearch from "./ReceptionEditorPatientSearch.vue";
import LayoutColumnsCard from "../layouts/LayoutColumnsCard.vue";

const uiStore = useUiStore();

uiStore.tabs.reception.multiview.mode = ReceptionEditorPatientSearch;
</script>

<!-- <style scoped>
/* Slide-left: new component slides in from the right while old slides out to the left */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 200ms ease;
}
.slide-left-enter-from {
    transform: translateX(20%);
    opacity: 0;
}
.slide-left-enter-to {
    transform: translateX(0%);
    opacity: 1;
}
.slide-left-leave-from {
    transform: translateX(0%);
    opacity: 1;
}
.slide-left-leave-to {
    transform: translateX(-20%);
    opacity: 0;
}

/* Slide-right: when navigating back, new component enters from left while old exits to right */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
        opacity 200ms ease;
}
.slide-right-enter-from {
    transform: translateX(-20%);
    opacity: 0;
}
.slide-right-enter-to {
    transform: translateX(0%);
    opacity: 1;
}
.slide-right-leave-from {
    transform: translateX(0%);
    opacity: 1;
}
.slide-right-leave-to {
    transform: translateX(20%);
    opacity: 0;
}
</style> -->
