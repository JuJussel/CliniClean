<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import * as z from "zod";
import { Time, CalendarDate, CalendarDateTime, ZonedDateTime } from '@internationalized/date'

const emit = defineEmits(["submitted"]);

const props = defineProps({
    patientId: {
        type: String,
        required: true,
    },
    patientRef: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const toast = useToast();

async function fetchPatientData(patientId) {
    isLoading.value = true;
    try {
        const patientData = await $fetch(`/api/patient/${patientId}`);
        patient.value = patientData.data;
    } catch (e) {
        toast.add({
            title: "Error",
            description: "Failed to fetch patient data",
            color: "error",
        });
        console.error("Error fetching patient data:", e);
        patient.value = null;
    } finally {
        isLoading.value = false;
    }
}

async function onSubmit(event) {
    emit("submitted", event.data);
}

const systemStore = useSystemStore();

const isLoading = ref(true);
const patient = ref(null);
const reservationData = reactive({
    doctor: "",
    reservationMemo: "",
    patient: props.patientRef,
    date: undefined,
    time: undefined,
});

const schema = z.object({
    doctor: z.string($t("validationMessages.stringEmpty")),
    reservationMemo: z.string(),
    patient: z.string(),
    date: z.custom((val) =>
      val instanceof CalendarDate ||
      val instanceof CalendarDateTime ||
      val instanceof ZonedDateTime,
        { message: $t("validationMessages.stringEmpty") }
    ),
    time: z.custom((val) => val instanceof Time, {
      message: $t("validationMessages.stringEmpty")
    })
});

const setDate = (date) => {
    console.log(date);

    reservationData.date = new CalendarDate(
        date.start.getFullYear(),
        date.start.getMonth() + 1, // JS months are 0-indexed!
        date.start.getDate(),
    );
    reservationData.time = new Time(
        date.start.getHours(),
        date.start.getMinutes(),
        date.start.getSeconds(),
    );
};

// Fetch patient data when component mounts
onMounted(() => {
    fetchPatientData(props.patientId);
});

// Expose isLoading for parent components
defineExpose({
    isLoading,
    reservationData,
    setDate,
});

const patientName = computed(() => {
    if (patient.value?.name) {
        return `${patient.value.name.family || ""} ${patient.value.name.given || ""}`.trim();
    }
    return "";
});
</script>

<template>
    <UForm
        :disabled="disabled"
        ref="form"
        @submit="onSubmit"
        :state="reservationData"
        :schema="schema"
    >
        <UFormField :label="$t('patient')" name="name">
            <UInput
                v-model="patientName"
                disabled
                variant="subtle"
                class="flex"
            />
        </UFormField>
        <UFormField :label="$t('date')" name="date">
            <UInputDate
                v-model="reservationData.date"
                variant="subtle"
                class="flex"
            />
        </UFormField>
        <UFormField :label="$t('time')" name="time">
            <UInputTime
                v-model="reservationData.time"
                variant="subtle"
                class="flex"
            />
        </UFormField>
        <UFormField :label="$t('doctor')" name="doctor">
            <USelect
                v-model="reservationData.doctor"
                :items="systemStore.system?.doctors || []"
                valueKey="_id"
                labelKey="fullName"
                :placeholder="$t('select')"
                searchable
                class="w-full"
            />
        </UFormField>
        <UFormField :label="$t('memo')" name="reservationMemo">
            <UTextarea
                v-model="reservationData.reservationMemo"
                class="w-full"
            />
        </UFormField>
    </UForm>
</template>
