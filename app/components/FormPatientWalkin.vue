<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import * as z from "zod";

const emit = defineEmits(["submitted"]);

const props = defineProps({
    patientId: {
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
const dayjs = useDayjs();

const isLoading = ref(true);
const patient = ref(null);
const walkinData = reactive({
    doctor: "",
    ins: "",
    insuranceConfirmed: false,
    receptionMemo: "",
    status: 2, // 2 for walk-in
    patient: props.patientId,
});

const schema = z.object({
    doctor: z.string().min(1, $t("validationMessages.stringEmpty")),
    ins: z.string().min(1, $t("validationMessages.selectRequired")),
    insuranceConfirmed: z.boolean(),
    receptionMemo: z.string(),
    status: z.number(),
    patient: z.string(),
});

// Fetch patient data when component mounts
onMounted(() => {
    fetchPatientData(props.patientId);
});

// Expose isLoading for parent components
defineExpose({
    isLoading,
    walkinData,
});

const handleInsuranceSelected = (insuranceRow) => {
    console.log(insuranceRow);

    walkinData.ins = insuranceRow.Insurance_Combination_Number;
};

const insuranceColumns = [
    {
        accessorKey: "Insurance_Combination_Number",
        header: $t("id"),
    },
    {
        accessorKey: "InsuranceProvider_WholeName",
        header: $t("insuranceProviderName"),
    },
    {
        accessorFn: (row) =>
            row.PublicInsurance_Information?.[0]?.PublicInsurance_Name,
        header: $t("publicInsurance") + "1",
    },
    {
        accessorFn: (row) =>
            row.PublicInsurance_Information?.[1]?.PublicInsurance_Name,
        header: $t("publicInsurance") + "2",
    },
    {
        accessorFn: (row) =>
            row.PublicInsurance_Information?.[2]?.PublicInsurance_Name,
        header: $t("publicInsurance") + "3",
    },
    {
        accessorKey: "Certificate_StartDate",
        header: $t("insuranceNumber"),
    },
];

const receptionDate = computed(() => dayjs().format("LL"));
const patientName = computed(() => {
    if (patient.value?.name) {
        return `${patient.value.name.family || ""} ${patient.value.name.given || ""}`.trim();
    }
    return "";
});
</script>

<template>
    <!-- Loading Skeleton -->
    <div v-if="isLoading">
        <div class="grid grid-cols-2 gap-6 mb-4">
            <!-- Patient Name Skeleton -->
            <div>
                <USkeleton class="h-5 w-20 mb-2" />
                <USkeleton class="h-10 w-full" />
            </div>
            <!-- Reception Date Skeleton -->
            <div>
                <USkeleton class="h-5 w-24 mb-2" />
                <USkeleton class="h-10 w-full" />
            </div>
            <!-- Doctor Skeleton -->
            <div>
                <USkeleton class="h-5 w-16 mb-2" />
                <USkeleton class="h-10 w-full" />
            </div>
            <!-- Insurance Confirm Skeleton -->
            <div>
                <USkeleton class="h-5 w-32 mb-2" />
                <USkeleton class="h-6 w-6" />
            </div>
            <!-- Memo Skeleton (spans full width) -->
            <div class="col-span-2">
                <USkeleton class="h-5 w-16 mb-2" />
                <USkeleton class="h-24 w-full" />
            </div>
        </div>
        <!-- Insurance Table Skeleton -->
        <div class="mt-4">
            <USkeleton class="h-5 w-20 mb-2" />
            <div class="space-y-2">
                <USkeleton class="h-10 w-full" />
                <USkeleton class="h-10 w-full" />
                <USkeleton class="h-10 w-full" />
            </div>
        </div>
    </div>
    <!-- Loaded Content -->
    <UForm
        v-else
        :disabled="disabled"
        class="grid grid-cols-2 gap-6"
        ref="form"
        @submit="onSubmit"
        :state="walkinData"
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
        <UFormField :label="$t('reception')" name="receptionDate">
            <UInput
                v-model="receptionDate"
                disabled
                variant="subtle"
                class="flex"
            />
        </UFormField>
        <UFormField :label="$t('doctor')" name="doctor">
            <USelect
                v-model="walkinData.doctor"
                :items="systemStore.system?.doctors || []"
                valueKey="id"
                labelKey="fullName"
                :placeholder="$t('select')"
                searchable
                class="w-full"
            />
        </UFormField>
        <UFormField
            :label="$t('patient') + $t('confirm')"
            name="insuranceConfirmed"
        >
            <UCheckbox
                :label="$t('insurance') + $t('confirm')"
                v-model="walkinData.insuranceConfirmed"
                class="mt-2.5"
            />
        </UFormField>
        <UFormField :label="$t('memo')" name="receptionMemo">
            <UTextarea v-model="walkinData.receptionMemo" class="w-full" />
        </UFormField>
        <UFormField
            name="ins"
            :label="$t('insurance')"
            v-if="!isLoading"
            class="col-span-2"
        >
            <CompTable
                :data="patient.insuranceSets || []"
                :columns="insuranceColumns"
                @row-selected="handleInsuranceSelected"
            />
        </UFormField>
    </UForm>
</template>
