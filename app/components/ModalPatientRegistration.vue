<script setup>

const emit = defineEmits(['close'])

const created = ref(false)

async function onPatientSubmitted(patientData) {
    console.log("New patient registered:", patientData);
    try {
        const res = await $fetch("api/patient/register", {
            body: patientData,
            method: "POST",
        });
        created = true
    } catch (e) {
        console.error(e);
    }
}
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
            <UButton color="neutral" icon="material-symbols-add"
                @click="emit('close', {modal: 'walkin', id: 12})"
            >
                {{ $t("registerNewPatient") }}
            </UButton>

            <FormPatientRegistration
                v-on:submitted="onPatientSubmitted"
                ref="newPatientForm"
            />
        </template>
        <template #footer>
            <UButton
                color="primary"
                form="patient-registration-form"
                @click="$refs.newPatientForm.$refs.form.submit()"
            >
                {{ $t("register") }}
            </UButton>
        </template>
    </UModal>
</template>
