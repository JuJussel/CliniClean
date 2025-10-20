<template>
    <div class="p-2">
        <div class="mb-2 h-6 flex items-center">
            <h3 v-if="history.length > 0">
                <Button
                    icon="pi pi-arrow-left"
                    :label="$t('back')"
                    class="p-button-text mr-2"
                    @click="goBack"
                    raised
                    variant="outlined"
                />
                <span class="text-lg font-bold"> {{ $t("newPatient") }}</span>
            </h3>
            <h3 v-else class="text-lg font-bold">
                {{ $t("patientSearch") }}
            </h3>
        </div>
        <div class="overflow-hidden">
            <Transition :name="transitionName" mode="out-in">
                <component :is="{ ...currentComponent }" :key="componentKey" />
            </Transition>
        </div>
    </div>
</template>

<script setup>
import PatientSearch from "./ReceptionEditorPatientSearch.vue";
import { ref, computed, watch } from "vue";
const receptionStore = useReceptionStore();

// navigation history stack of component constructors
const history = ref([]);

// current active component (keeps the actual constructor from the store)
const currentComponent = computed(() => receptionStore.multiView.mode);

// key to force transition when component changes; use the component identity
const componentKey = computed(
    () => currentComponent.value?.name || String(Date.now())
);

// transition name: 'slide-left' when navigating forward, 'slide-right' when going back
const transitionName = ref("slide-left");

// initial mode
receptionStore.multiView.mode = PatientSearch;

// flag to suppress history update when we programmatically change the mode (internal nav)
const suppressWatcher = ref(false);

// navigate to a new component and push previous into history
function navigateTo(component) {
    if (receptionStore.multiView.mode)
        history.value.push(receptionStore.multiView.mode);
    suppressWatcher.value = true;
    transitionName.value = "slide-left";
    receptionStore.multiView.mode = component;
    // release suppression on next tick (watch will check the flag)
    setTimeout(() => (suppressWatcher.value = false), 0);
}

// go back to previous component
function goBack() {
    const prev = history.value.pop();
    if (!prev) return;
    suppressWatcher.value = true;
    transitionName.value = "slide-right";
    receptionStore.multiView.mode = prev;
    setTimeout(() => (suppressWatcher.value = false), 0);
}

// Watch for external changes to the store's mode. If another component sets the mode
// (not via navigateTo/goBack), treat it as a forward navigation and update history.
watch(
    () => receptionStore.multiView.mode,
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
