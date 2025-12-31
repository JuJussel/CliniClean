<template>
    <LayoutColumnsCard :columns="1">
        <template #column-1-header>
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
        </template>
        <template #column-1-content>
            <div class="p-2">
                <div class="overflow-hidden">
                    <Transition :name="transitionName" mode="out-in">
                        <component
                            :is="{ ...currentComponentContent }"
                            :key="componentKey"
                        />
                    </Transition>
                </div>
            </div>
        </template>
    </LayoutColumnsCard>
</template>

<script setup>
import ReceptionEditorPatientSearchControls from "./ReceptionEditorPatientSearchControls.vue";
import ReceptionEditorPatientSearchContent from "./ReceptionEditorPatientSearchContent.vue";
import LayoutColumnsCard from "../layouts/LayoutColumnsCard.vue";
import { ref, computed, watch } from "vue";
const receptionStore = useReceptionStore();
const uiStore = useUiStore();

// navigation history stack of component constructors
const history = ref([]);

// current active component (keeps the actual constructor from the store)
const currentComponentContent = computed(
    () => uiStore.tabs.reception.multiview.mode
);

// key to force transition when component changes; use the component identity
const componentKey = computed(
    () => currentComponentContent.value?.name || String(Date.now())
);

// transition name: 'slide-left' when navigating forward, 'slide-right' when going back
const transitionName = ref("slide-left");

// initial mode
uiStore.tabs.reception.multiview.mode = ReceptionEditorPatientSearchContent;

// flag to suppress history update when we programmatically change the mode (internal nav)
const suppressWatcher = ref(false);

// navigate to a new component and push previous into history
function navigateTo(component) {
    if (uiStore.tabs.reception.multiview.mode)
        history.value.push(uiStore.tabs.reception.multiview.mode);
    suppressWatcher.value = true;
    transitionName.value = "slide-left";
    uiStore.tabs.reception.multiview.mode = component;
    // release suppression on next tick (watch will check the flag)
    setTimeout(() => (suppressWatcher.value = false), 0);
}

// go back to previous component
function goBack() {
    const prev = history.value.pop();
    if (!prev) return;
    suppressWatcher.value = true;
    transitionName.value = "slide-right";
    uiStore.tabs.reception.multiview.mode = prev;
    setTimeout(() => (suppressWatcher.value = false), 0);
}

// Watch for external changes to the store's mode. If another component sets the mode
// (not via navigateTo/goBack), treat it as a forward navigation and update history.
watch(
    () => uiStore.tabs.reception.multiview.mode,
    (newVal, oldVal) => {
        if (suppressWatcher.value) return;
        if (!oldVal || newVal === oldVal) return;
        // push old into history and animate forward
        history.value.push(oldVal);
        transitionName.value = "slide-left";
    }
);
</script>

<style scoped>
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
</style>
