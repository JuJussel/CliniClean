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

const onWalkinSubmitted = async () => {
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
        toast.add({ title: e.data?.message || e.message, color: "error" });
    } finally {
        submitting.value = false;
    }
};
</script>

<template>
    <UModal>
        <template #title>
            <div class="flex items-center gap-2">
                <UIcon
                    name="material-symbols:playlist-add-rounded"
                    class="size-5"
                />
                {{ $t("newReception") }}
            </div>
        </template>
        <template #body>
            <FormPatientWalkin
                v-on:submitted="onWalkinSubmitted"
                :disabled="submitting"
                :patient-id="patient.id"
                :patient-ref="patient._id"
                ref="walkinForm"
            />
        </template>
        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <UButton
                    color="neutral"
                    variant="outline"
                    @click="emit('close')"
                    :disabled="submitting"
                >
                    {{ $t("cancel") }}
                </UButton>
                <UButton
                    icon="material-symbols:playlist-add-rounded"
                    @click="walkinForm.$refs.form.submit()"
                    :loading="isLoading"
                    :disabled="isLoading"
                >
                    {{ $t("newReception") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
