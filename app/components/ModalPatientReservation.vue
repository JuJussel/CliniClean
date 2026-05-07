<script setup>
import { ref, computed } from "vue";
const toast = useToast();

defineProps(["patient"]);

const emit = defineEmits(["close"]);
const walkinForm = ref("walkinForm");
const submitting = ref(false);

const isLoading = computed(() => {
    return walkinForm.value.isLoading || submitting.value;
});

const onReservationSubmitted = async () => {
    submitting.value = true;
    try {
        const walkinData = walkinForm.value.walkinData;

        await $fetch("/api/encounter/create", {
            method: "POST",
            body: walkinData,
        });
        toast.add({ title: $t("walkinRegistered") });
        emit("close", { modal: "walkin", id: walkinForm.value.patient });
    } catch (e) {
        console.error("Error creating encounter:", e);
        toast.add({ title: e.message, color: "error" });
    } finally {
        submitting.value = false;
    }
};
</script>

<template>
    <UModal  :ui="{ content: '!max-w-4xl' }">
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
            <div class="grid grid-cols-2 gap-4">
                <FormPatientWalkin
                    v-on:submitted="onReservationSubmitted"
                    :disabled="submitting"
                    :patient-id="patient.id"
                    :patient-ref="patient._id"
                    ref="walkinForm"
                />
                            <CompCalendar/>

            </div>
        </template>
        <template #footer>
            <div>
                <UButton
                    icon="material-symbols:playlist-add-rounded"
                    @click="walkinForm.$refs.form.submit()"
                    :loading="isLoading"
                    :disabled="isLoading"
                >
                    {{ $t("newReservation") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
