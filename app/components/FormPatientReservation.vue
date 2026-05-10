<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import * as z from "zod";
import {
    Time,
    CalendarDate,
    CalendarDateTime,
    ZonedDateTime,
} from "@internationalized/date";

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
    receptionMemo: "",
    patient: props.patientRef,
    date: undefined,
    time: undefined,
    status: 1, // Default to "scheduled"
});

const schema = z
    .object({
        receptionMemo: z.string(),
        patient: z.string(),
        status: z.number(),
        doctor: z.string(),
        date: z
            .custom(
                (val) =>
                    val instanceof CalendarDate ||
                    val instanceof CalendarDateTime ||
                    val instanceof ZonedDateTime,
                { message: $t("validationMessages.stringEmpty") },
            )
            .refine((date) => new Date(date) >= new Date(), {
                message: $t("validationMessages.dateMax"),
            }),
        time: z.custom((val) => val instanceof Time, {
            message: $t("validationMessages.stringEmpty"),
        }),
    })
    .transform((data) => {
        // 1. Extract the YYYY-MM-DD part
        // .toString() on CalendarDate/DateTime returns ISO format
        const datePart = data.date.toString().split("T")[0];

        // 2. Extract the HH:mm:ss part
        const timePart = data.time.toString();

        // 3. Create a native JS Date object
        // Note: This creates the date in the execution environment's local time.
        // If you want to force UTC, append a 'Z': new Date(`${datePart}T${timePart}Z`)
        const mongoDate = new Date(`${datePart}T${timePart}`);

        // 4. Transform Doctor
        if (data.doctor === "") {
            data.doctor = null; // Set to null if empty string
        }

        // 4. Return the new shape of the data
        return {
            ...data,
            date: mongoDate, // This is what you'll save to MongoDB
        };
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
        <UFormField :label="$t('memo')" name="receptionMemo">
            <UTextarea v-model="reservationData.receptionMemo" class="w-full" />
        </UFormField>
    </UForm>
</template>
