<script setup>
import { ref } from "vue";

const props = defineProps({
    patientId: {
        type: String,
        required: true,
    },
});

const toast = useToast();

async function fetchPatientData(patientId) {
    try {
        const patientData = await $fetch(`/api/patient/${patientId}`);
        return patientData.data;
    } catch (e) {
        toast.add({
            title: "Error",
            description: "Failed to fetch patient data",
            color: "error",
        });
        console.error("Error fetching patient data:", e);
        return null;
    }
}

const systemStore = useSystemStore();
const dayjs = useDayjs();

const state = reactive({});

const patient = await fetchPatientData(props.patientId);
const selectedDoctor = ref(null);
const selectedInsurance = ref(null);
const selectedPublicInsurance = ref(null);
const insuranceConfirmed = ref(false);

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
        accessorKey: "Certificate_StartDate",
        header: $t("insuranceNumber"),
    },
];

const publicInsuranceColumns = [
    {
        accessorKey: "Insurance_Combination_Number",
        header: $t("id"),
    },
    {
        accessorKey: "name",
        header: $t("publicInsuranceProvider"),
    },
    {
        accessorKey: "recipient",
        header: $t("publicInsuranceRecepient"),
    },
];

const insuranceOptions = [];

const publicInsuranceOptions = [];

const receptionDate = computed(() => dayjs().format("LL"));
const patientName = computed(() => {
    if (patient?.name) {
        return `${patient.name.family || ""} ${patient.name.given || ""}`.trim();
    }
    return "";
});
</script>

<template>
    <div class="grid grid-cols-2 gap-6" v-if="patient">
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
                v-model="selectedDoctor"
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
                v-model="insuranceConfirmed"
                class="mt-[10px]"
            />
        </UFormField>
    </div>
    <div class="mt-4">
        <!-- Insurance Table -->
        <div>
            <label class="block text-sm font-medium mb-2">{{
                $t("insurance")
            }}</label>
            <UTable
                v-model="selectedInsurance"
                :data="patient.insuranceSets"
                :columns="insuranceColumns"
            />
        </div>

        <!-- Public Insurance Table -->
        <div>
            <label class="block text-sm font-medium mb-2">{{
                $t("publicInsurance")
            }}</label>
            <UTable
                v-model="selectedPublicInsurance"
                :data="publicInsuranceOptions"
                :columns="publicInsuranceColumns"
            />
        </div>
    </div>
</template>
