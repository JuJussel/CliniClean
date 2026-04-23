<script setup>

defineProps(['patientId'])

</script>

<template>
        <UModal>
        <template #title>
            <div class="flex items-center gap-2">
                <UIcon name="material-symbols:person-add" class="size-5" />
                {{ $t("registerNewPatient") }}
            </div>
        </template>
        <template #body>
            {{ patientId }}
        </template>
    </UModal>

</template>