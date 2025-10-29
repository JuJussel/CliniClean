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
                    <div
                        v-if="
                            searchResults.length > 0 &&
                            patient.hasContacts &&
                            !selectedContact
                        "
                        class="mb-3"
                    >
                        <Listbox
                            v-model="selectedContact"
                            :options="searchResults"
                            :optionLabel="
                                (contact) =>
                                    `${contact.name.family} ${contact.name.given}`
                            "
                            filter
                            listStyle="max-height:250px"
                            class="w-full"
                            :loading="searchLoading"
                            :placeholder="t('selectExistingContact')"
                            @change="handleContactSelect"
                        />
                    </div>
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
        if (!newVal || selectedContact.value) return;

        const query = `${newVal.family || ""}${newVal.given || ""}`.trim();
        if (query.length < 2) {
            searchResults.value = [];
            return;
        }

        searchLoading.value = true;
        try {
            const results = await useApi.get(
                "persons/search?query=" +
                    JSON.stringify(patient.value.contact.name)
            );
            searchResults.value = results;
        } catch (error) {
            console.error("Search error:", error);
            searchResults.value = [];
        } finally {
            searchLoading.value = false;
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
                        disabled: false,
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
                        disabled: "selectedContact",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "givenKana",
                        label: t("firstNameKana"),
                        outerClass: "col-6",
                        validation: "required|notKanji",
                        disabled: "selectedContact",
                    },
                ],
            },
            {
                $formkit: "group",
                if: "searchResults.length > 0 && !selectedContact",
                children: [
                    {
                        $el: "div",
                        attrs: {
                            class: "col-12 mb-3",
                        },
                        children: [
                            {
                                $cmp: "ListBox",
                                props: {
                                    options: "$searchResults",
                                    optionLabel:
                                        "name.family + ' ' + name.given",
                                    filter: true,
                                    listStyle: "max-height:250px",
                                    class: "w-full",
                                    loading: "$searchLoading",
                                    placeholder: t("selectExistingContact"),
                                },
                                on: {
                                    change: "handleContactSelect($event.value)",
                                },
                            },
                        ],
                    },
                ],
            },

            {
                $formkit: "primeSelect",
                name: "use",
                label: t("relation"),
                optionLabel: (o) => t(o),
                options: listStore.listData.relations,
                outerClass: "col-4",
                optionLabel: (o) => t(o.name),
                validation: "required",
                outerClass: "col-6",
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
</script>
