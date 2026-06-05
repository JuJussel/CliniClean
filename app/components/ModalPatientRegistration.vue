<script setup>
const toast = useToast();
const emit = defineEmits(["close"]);
const loading = ref(false);

const registered = ref(null);

async function onPatientSubmitted(patientData) {
    loading.value = true;

    try {
        const res = await $fetch("api/patient/register", {
            body: patientData,
            method: "POST",
        });

        if (res.success && res.data?.patient) {
            toast.add( { title: $t("patientRegistered") })
            registered.value = res.data.patient;
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
            <div v-if="registered" class="flex justify-between gap-2 w-full">
                <div class="flex gap-2">
                    <UButton
                        color="neutral"
                        icon="material-symbols:playlist-add-rounded"
                        @click="
                            emit('close', { modal: 'walkin', patient: registered })
                        "
                    >
                        {{ $t("newReception") }}
                    </UButton>
                    <UButton
                        color="neutral"
                        icon="material-symbols:calendar-clock-rounded"
                        @click="
                            emit('close', {
                                modal: 'reservation',
                                patient: registered,
                            })
                        "
                    >
                        {{ $t("reservation") }}
                    </UButton>
                    <UButton
                        color="neutral"
                        icon="material-symbols:person-edit-sharp"
                        @click="
                            emit('close', { modal: 'edit', patient: registered })
                        "
                    >
                        {{ $t("edit") }}
                    </UButton>
                </div>
                <UButton
                    color="neutral"
                    variant="outline"
                    @click="emit('close')"
                >
                    {{ $t("close") }}
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
