<script setup>
async function onPatientSubmitted(patientData) {
    console.log("New patient registered:", patientData);
    try {
        const res = await $fetch("api/patient/register", {
            body: patientData,
            method: "POST",
        });
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
    <UModal>
        <UButton color="neutral" icon="material-symbols-add">
            {{ $t("registerNewPatient") }}
        </UButton>
        <template #title>
            <div class="flex items-center gap-2">
                <UIcon name="material-symbols:person-add" class="size-5" />
                {{ $t("registerNewPatient") }}
            </div>
        </template>
        <template #body>
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
