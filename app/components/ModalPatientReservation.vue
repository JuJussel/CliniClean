<script setup>
import { ref, computed } from "vue";
const toast = useToast();

defineProps(["patient"]);

const emit = defineEmits(["close"]);
const reservationForm = ref("reservationForm");
const submitting = ref(false);

const isLoading = computed(() => {
    return reservationForm.value.isLoading || submitting.value;
});

async function onReservationSubmitted(reservationData) {
    submitting.value = true;
    try {
        await $fetch("/api/encounter/create", {
            method: "POST",
            body: reservationData,
        });
        toast.add({ title: $t("walkinRegistered") });
        emit("close", { modal: "walkin", id: reservationForm.value.patient });
    } catch (e) {
        console.error("Error creating encounter:", e);
        toast.add({ title: e.message, color: "error" });
    } finally {
        submitting.value = false;
    }
}

const setDate = (date) => {
    reservationForm.value.setDate(date);
};
</script>

<template>
    <UModal :ui="{ content: 'max-w-4xl!' }">
        <template #title>
            <div class="flex items-center gap-2">
                <UIcon
                    name="material-symbols:playlist-add-rounded"
                    class="size-5"
                />
                {{ $t("newReservation") }}
            </div>
        </template>
        <template #body>
            <div class="grid grid-cols-4 gap-4">
                <FormPatientReservation
                    v-on:submitted="onReservationSubmitted"
                    :disabled="submitting"
                    :patient-id="patient.id"
                    :patient-ref="patient._id"
                    ref="reservationForm"
                />
                <div class="h-[550px] col-span-3">
                    <CompCalendar @select-date="setDate" />
                </div>
            </div>
        </template>
        <template #footer>
            <div>
                <UButton
                    icon="material-symbols:playlist-add-rounded"
                    @click="reservationForm.$refs.form.submit()"
                    :loading="isLoading"
                    :disabled="submitting"
                >
                    {{ $t("newReservation") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
