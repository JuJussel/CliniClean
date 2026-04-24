<script setup>
const toast = useToast()
const emit = defineEmits(['close'])

const registered = ref(false);

async function onPatientSubmitted(patientData) {
    console.log("New patient registered:", patientData);
    try {
        const res = await $fetch("api/patient/register", {
            body: patientData,
            method: "POST",
        });

        toast.add($t("patientRegistered"), {type: "success"})
        registered.value = true

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
            <div v-if="registered">
                {{ $t("patientRegistered") }}
            </div>
            <FormPatientRegistration
                v-else
                v-on:submitted="onPatientSubmitted"
                ref="newPatientForm"
            />
        </template>
        <template #footer>
            <div v-if="registered">
                <UButton 
                    color="neutral" 
                    icon="material-symbols:playlist-add-rounded"
                    @click="emit('close', {modal: 'walkin', id: 12})"
                >
                    {{ $t("newReception") }}
                </UButton>

            </div>
            <div v-else>
                <UButton
                    color="primary"
                    form="patient-registration-form"
                    @click="$refs.newPatientForm.$refs.form.submit()"
                >
                    {{ $t("register") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
