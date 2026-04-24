<script setup>
import { th } from "zod/v4/locales";

const toast = useToast();
const emit = defineEmits(["close"]);
const loading = ref(false);

const registered = ref(false);

async function onPatientSubmitted(patientData) {
    loading.value = true;

    try {
        const res = await $fetch("api/patient/register", {
            body: patientData,
            method: "POST",
        });

        if (res.success && res.data?.id) {
            // toast.add( { title: $t("patientRegistered") })
            registered.value = true;
        } else {
            throw new Error(res.message);
        }
        loading.value = false;
    } catch (e) {
        loading.value = false;

        console.error("Registration error:", e);
        toast.add({ title: e.message, color: "error" });
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
                :disabled="loading"
                ref="newPatientForm"
            />
        </template>
        <template #footer>
            <div v-if="registered">
                <UButton
                    color="neutral"
                    icon="material-symbols:playlist-add-rounded"
                    @click="emit('close', { modal: 'walkin', id: 12 })"
                >
                    {{ $t("newReception") }}
                </UButton>
            </div>
            <div v-else>
                <UButton
                    color="primary"
                    form="patient-registration-form"
                    :loading="loading"
                    @click="$refs.newPatientForm.$refs.form.submit()"
                >
                    {{ $t("register") }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
