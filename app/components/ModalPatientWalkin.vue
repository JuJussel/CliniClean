<script setup>
import { ref, computed } from "vue";

defineProps(["patientId"]);

const emit = defineEmits(["close"]);
const walkinForm = ref("walkinForm");
const registered = ref(null);

const isLoading = computed(() => {
    return walkinForm.value.isLoading;
});
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
            <FormPatientWalkin :patient-id="patientId" ref="walkinForm" />
        </template>
        <template #footer>
            <div>
                <UButton
                    icon="material-symbols:playlist-add-rounded"
                    @click="emit('close', { modal: 'walkin', id: registered })"
                    :loading="isLoading"
                    :disabled="isLoading"
                >
                    {{ $t("newReception") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
