<template>
    <div>
        <div class="h-[calc(100vh-200px)] overflow-auto min-h-0 p-4">
            <div class="max-w-[700px]">
                <FormKit
                    id="patientForm"
                    v-model="patient"
                    type="form"
                    @submit="submitPatient"
                    :disabled="loading"
                    actionsClass="!hidden"
                    :actions="false"
                >
                    <FormKitSchema :schema="formSchema" :data="patient" />
                </FormKit>
            </div>
        </div>
        <div class="flex justify-end mt-4">
            <Button
                :label="$t('register')"
                icon="pi pi-check"
                @click="submitForm('patientForm')"
                :loading="loading"
            />
        </div>
    </div>
</template>

<script setup>
import useApi from "@/composables/apiComposable.js";
import { useI18n } from "vue-i18n";
import { submitForm } from "@formkit/vue";
import PatientInfo from "./ReceptionEditorPatientInfo.vue";
import { useToast } from "primevue/usetoast";

const { t } = useI18n();
const toast = useToast();
const listStore = useListStore();
const receptionStore = useReceptionStore();

const searchResults = ref([]);
const searchLoading = ref(false);
const selectedContact = ref(null);
const currentSearchController = ref(null);

const patient = ref({
    birthDate: null,
    gender: "male",
    name: {
        family: "",
        given: "",
        familyKana: "",
        givenKana: "",
    },
    telecom: [{ system: "phone", value: "", use: "home" }],
    address: {
        address: "",
        zip: "",
        country: "JPN",
        line: "",
    },
    occupation: "employee",
    hasContacts: false,
});
const loading = ref(false);

// Watch for changes in contact name
watch(
    () => patient.value.contact?.name,
    async (newVal) => {
        // Cancel any pending request
        if (currentSearchController.value) {
            currentSearchController.value.abort();
        }

        if (!newVal || selectedContact.value) return;

        // Check if we have at least 2 characters in any field
        const hasMinChars = Object.values(newVal).some(
            (val) => (val || "").length >= 2
        );
        if (!hasMinChars) {
            searchResults.value = [];
            return;
        }

        // Create new AbortController for this request
        currentSearchController.value = new AbortController();
        searchLoading.value = true;

        try {
            // Build query parameters with only non-empty values
            const params = new URLSearchParams();
            if (newVal.family) params.append("family", newVal.family);
            if (newVal.given) params.append("given", newVal.given);
            if (newVal.familyKana)
                params.append("familyKana", newVal.familyKana);
            if (newVal.givenKana) params.append("givenKana", newVal.givenKana);

            const results = await useApi.get(
                `persons/search?${params.toString()}`,
                { signal: currentSearchController.value?.signal }
            );

            // Only update results if controller exists and request wasn't aborted
            if (
                currentSearchController.value &&
                !currentSearchController.value.signal.aborted
            ) {
                searchResults.value = results;
            }
        } catch (error) {
            // Only handle error if it's not an abort error
            if (error.name !== "AbortError") {
                console.error("Search error:", error);
                searchResults.value = [];
            }
        } finally {
            // Only reset loading state if this was the last request and controller still exists
            if (
                currentSearchController.value &&
                !currentSearchController.value.signal.aborted
            ) {
                searchLoading.value = false;
            }
            currentSearchController.value = null;
        }
    },
    { deep: true }
);
const handleContactSelect = (contact) => {
    if (!contact) return;

    // Disable form fields by setting selectedContact
    selectedContact.value = contact;

    // Update contact information
    patient.value.contact = {
        ...patient.value.contact,
        name: { id: contact._id },
        person: contact._id,
    };
};
async function submitPatient() {
    loading.value = true;
    const payload = JSON.parse(JSON.stringify(patient.value));
    try {
        const response = await useApi.post("/patients", payload);
        toast.add({
            severity: "success",
            summary: t("success"),
            detail: t("patientCreatedSuccessfully"),
            life: 3000,
        });
        receptionStore.multiView.data.patient = response;
        receptionStore.multiView.mode = PatientInfo;
    } catch (error) {
        toast.add({
            severity: "error",
            summary: error,
            detail: t("patientCreationFailed"),
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
}

const formSchema = [
    {
        $el: "h3",
        children: [t("name"), ""],
    },
    {
        $formkit: "group",
        name: "name",
        children: [
            {
                $formkit: "primeInputText",
                name: "family",
                label: t("lastName"),
                outerClass: "col-6",
                validation: "required",
            },
            {
                $formkit: "primeInputText",
                name: "given",
                label: t("firstName"),
                outerClass: "col-6",
                validation: "required",
            },
            {
                $formkit: "primeInputText",
                name: "familyKana",
                label: t("lastNameKana"),
                outerClass: "col-6",
                validation: "required|notKanji",
            },
            {
                $formkit: "primeInputText",
                name: "givenKana",
                label: t("firstNameKana"),
                outerClass: "col-6",
                validation: "required|notKanji",
            },
        ],
    },
    {
        $el: "h3",
        children: t("basic"),
    },
    {
        $formkit: "primeDatePicker",
        name: "birthDate",
        label: t("birthdate"),
        outerClass: "col-6",
        showIcon: true,
        validation: "required|date_before",
    },
    {
        $formkit: "primeSelect",
        name: "gender",
        label: t("gender"),
        optionLabel: (g) => t(g),
        options: listStore.listData.genders,
        outerClass: "col-3",
        validation: "required",
    },
    {
        $formkit: "primeSelect",
        name: "occupation",
        label: t("occupation"),
        optionLabel: (o) => t(o),
        options: listStore.listData.occupations,
        outerClass: "col-3",
        validation: "required",
    },
    {
        $el: "h3",
        children: t("contactInfo"),
    },

    {
        $formkit: "list",
        name: "telecom",
        children: [
            {
                $formkit: "group",
                for: ["item", "key", "$telecom"],
                children: [
                    {
                        $formkit: "primeSelect",
                        name: "use",
                        label: t("use"),
                        optionLabel: (o) => t(o),
                        options: listStore.listData.telecomUses,
                        outerClass: "col-3",
                    },
                    {
                        $formkit: "primeSelect",
                        name: "system",
                        label: t("system"),
                        optionLabel: (o) => t(o),
                        options: listStore.listData.telecomTypes,
                        outerClass: "col-3",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "value",
                        label: t("phoneOrMail"),
                        outerClass: "col-6",
                        if: "$item.system === 'email'",
                        validation: "required|email",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "value",
                        label: t("phoneOrMail"),
                        outerClass: "col-6",
                        if: "$item.system === 'phone'",
                        validation: "required|japanesePhone",
                    },
                ],
            },
        ],
    },
    {
        $el: "h3",
        children: t("address"),
    },
    {
        $formkit: "group",
        name: "address",
        children: [
            {
                $formkit: "primeInputText",
                name: "postalCode",
                label: t("zipCode"),
                outerClass: "col-4",
                validation: "required|japanesePostal",
            },
            {
                $formkit: "primeInputText",
                name: "text",
                label: t("address"),
                outerClass: "col-4",
                validation: "required",
            },
            {
                $formkit: "primeInputText",
                name: "line",
                label: t("RoomOrCompany"),
                outerClass: "col-4",
            },
        ],
    },
    {
        $el: "h3",
        children: t("relation"),
    },
    {
        $formkit: "primeCheckbox",
        name: "hasContacts",
        id: "registerContact",
        suffix: t("registerContact"),
    },
    {
        $formkit: "group",
        if: "$hasContacts",
        name: "contact",
        children: [
            {
                $formkit: "group",
                name: "name",
                children: [
                    {
                        $formkit: "primeInputText",
                        name: "family",
                        label: t("lastName"),
                        outerClass: "col-6",
                        validation: "required",
                        disabled: "$selectedContact",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "given",
                        label: t("firstName"),
                        outerClass: "col-6",
                        validation: "required",
                        disabled: "$selectedContact",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "familyKana",
                        label: t("lastNameKana"),
                        outerClass: "col-6",
                        validation: "required|notKanji",
                        disabled: "$selectedContact",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "givenKana",
                        label: t("firstNameKana"),
                        outerClass: "col-6",
                        validation: "required|notKanji",
                        disabled: "$selectedContact",
                    },
                ],
            },
            {
                $formkit: "primeListbox",
                name: "selectedContact",
                label: "Cookie notice",
                optionLabel: "name",
                // optionValue: "value",
                options: "$searchResults",
            },
        ],
    },
    {
        $formkit: "group",
        name: "contact",
        if: "$contact.name.id == undefined && $hasContacts",
        children: [
            {
                $formkit: "group",
                name: "address",
                children: [
                    {
                        $formkit: "primeSelect",
                        name: "use",
                        label: t("use"),
                        optionLabel: (o) => t(o),
                        options: listStore.listData.telecomUses,
                        outerClass: "$reset col-2",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "postalCode",
                        label: t("zipCode"),
                        outerClass: "col-3",
                        validation: "required|japanesePostal",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "text",
                        label: t("address"),
                        outerClass: "col-3",
                        validation: "required",
                    },
                    {
                        $formkit: "list",
                        name: "line",
                        children: [
                            {
                                $formkit: "primeInputText",
                                label: t("RoomOrCompany"),
                                outerClass: "col-4",
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
</script>
