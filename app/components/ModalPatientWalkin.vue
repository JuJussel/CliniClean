<script setup>
defineProps(["patientId"]);
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
            <FormPatientWalkin :patient-id="patientId" />
        </template>
        <template #footer>
            <div>
                <UButton
                    color="neutral"
                    icon="material-symbols:playlist-add-rounded"
                    @click="emit('close', { modal: 'walkin', id: registered })"
                >
                    {{ $t("newReception") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
