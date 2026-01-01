<template>
    <Toolbar>
        <template #start>
            <span class="pi pi-user mr-2"></span>
            <div class="text-base font-bold">{{ $t("newPatient") }}</div>
        </template>
        <template #center> </template>
        <template #end>
            <div class="gap-4 flex">
                <Button
                    :label="$t('cancel')"
                    @click="
                        uiStore.tabs.reception.multiview.mode = PatientSearch
                    "
                    severity="secondary"
                    icon="pi pi-times"
                />
                <Button
                    :label="$t('register')"
                    icon="pi pi-check"
                    severity="success"
                    @click="submitForm('patientForm')"
                    :loading="loading"
                />
            </div>
        </template>
    </Toolbar>
    <div
        class="overflow-auto min-h-0 p-2 flex justify-center mt-4"
        :pt="{
            content: {
                class: 'flex justify-center',
            },
            header: { class: '!hidden' },
        }"
    >
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
</template>

<script setup>
import useApi from "@/composables/apiComposable.js";
import { useI18n } from "vue-i18n";
import { submitForm } from "@formkit/vue";
import PatientInfo from "./ReceptionEditorPatientInfo.vue";
import PatientSearch from "./ReceptionEditorPatientSearch.vue";
import { useToast } from "primevue/usetoast";
import { getNode } from "@formkit/core";

const uiStore = useUiStore();

const { t } = useI18n();
const toast = useToast();
const listStore = useListStore();
const receptionStore = useReceptionStore();
const searchLoading = ref(false);
const loading = ref(false);
let searchTimeout = null;
const searchResults = ref([]);

const patient = ref({
    birthDate: null,
    gender: "male",
    name: {
        family: "",
        given: "",
        familyKana: "",
        givenKana: "",
    },
    telecom: [
        { system: "phone", value: "", use: "home" },
        { system: "mail", value: "", use: "home" },
    ],
    address: {
        address: "",
        zip: "",
        country: "JPN",
        line: "",
    },
    occupation: "employee",
    contact: {
        register: false,
        id: null,
        name: {
            family: "",
            given: "",
            familyKana: "",
            givenKana: "",
        },
        address: {
            address: "",
            zip: "",
            country: "JPN",
            line: "",
        },
    },
});

// Watch for changes in contact name
watch(
    () => patient.value.contact?.name,
    (newVal) => {
        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        if (!newVal) return;

        const node = getNode("contactSearch");
        if (!node) return;

        // Set new timeout
        searchTimeout = setTimeout(async () => {
            // Check if we have at least 2 characters in any field
            const hasMinChars = Object.values(newVal).some(
                (val) => (val || "").length >= 2
            );
            if (!hasMinChars) {
                node.props.options = [];
                return;
            }

            searchLoading.value = true;

            try {
                // Build query parameters with only non-empty values
                const params = new URLSearchParams();
                if (newVal.family) params.append("family", newVal.family);
                if (newVal.given) params.append("given", newVal.given);
                if (newVal.familyKana)
                    params.append("familyKana", newVal.familyKana);
                if (newVal.givenKana)
                    params.append("givenKana", newVal.givenKana);

                const results = await useApi.get(
                    `persons/search?${params.toString()}`
                );
                searchResults.vaklue = results;
                node.props.options = results;
            } catch (error) {
                // Only handle error if it's not an abort error
                if (error.name !== "AbortError") {
                    console.error("Search error:", error);
                }
            } finally {
                searchLoading.value = false;
            }
        }, 1000); // 1 second delay
    },
    { deep: true }
);

const handleContactSelect = (c) => {
    if (!c) return;
    existingContact.value = c.value;
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
        $cmp: "Fieldset",
        props: {
            legend: t("name"),
            pt: { content: { class: "grid grid-cols-2 gap-2" } },
        },
        children: [
            {
                $formkit: "group",
                name: "name",
                children: [
                    {
                        $formkit: "primeInputText",
                        name: "family",
                        label: t("lastName"),
                        validation: "required",
                        variant: "filled",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "given",
                        label: t("firstName"),
                        validation: "required",
                        variant: "filled",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "familyKana",
                        label: t("lastNameKana"),
                        validation: "required|notKanji",
                        variant: "filled",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "givenKana",
                        label: t("firstNameKana"),
                        validation: "required|notKanji",
                        variant: "filled",
                    },
                ],
            },
        ],
    },
    {
        $cmp: "Fieldset",
        props: {
            legend: t("basic"),
            pt: { content: { class: "grid grid-cols-4 gap-2" } },
        },
        children: [
            {
                $formkit: "primeDatePicker",
                name: "birthDate",
                label: t("birthdate"),
                showIcon: true,
                outerClass: "col-span-2",
                validation: "required|date_before",
                variant: "filled",
            },
            {
                $formkit: "primeSelect",
                name: "gender",
                label: t("gender"),
                optionLabel: (g) => t(g),
                options: listStore.listData.genders,
                validation: "required",
                variant: "filled",
            },
            {
                $formkit: "primeSelect",
                name: "occupation",
                label: t("occupation"),
                optionLabel: (o) => t(o),
                options: listStore.listData.occupations,
                validation: "required",
                variant: "filled",
            },
        ],
    },
    {
        $cmp: "Fieldset",
        props: {
            legend: t("contactInfo"),
            pt: { content: { class: "grid grid-cols-2 gap-2" } },
        },
        children: [
            {
                $formkit: "list",
                name: "telecom",
                children: [
                    {
                        $formkit: "group",
                        for: ["item", "key", "$telecom"],
                        children: [
                            {
                                $formkit: "primeInputText",
                                name: "value",
                                label: t("email"),
                                if: "$item.system === 'mail'",
                                validation: "required|email",
                                variant: "filled",
                            },
                            {
                                $formkit: "primeInputText",
                                name: "value",
                                label: t("phone"),
                                if: "$item.system === 'phone'",
                                validation: "required|japanesePhone",
                                variant: "filled",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        $cmp: "Fieldset",
        props: {
            legend: t("contactInfo"),
            pt: { content: { class: "grid grid-cols-3 gap-2" } },
        },
        children: [
            {
                $formkit: "group",
                name: "address",
                children: [
                    {
                        $formkit: "primeInputText",
                        name: "postalCode",
                        label: t("zipCode"),
                        validation: "required|japanesePostal",
                        variant: "filled",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "text",
                        label: t("address"),
                        validation: "required",
                        variant: "filled",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "line",
                        label: t("RoomOrCompany"),
                        variant: "filled",
                    },
                ],
            },
        ],
    },

    // {
    //     $formkit: "list",
    //     name: "telecom",
    //     children: [
    //         {
    //             $formkit: "group",
    //             for: ["item", "key", "$telecom"],
    //             children: [
    //                 {
    //                     $formkit: "primeSelect",
    //                     name: "use",
    //                     label: t("use"),
    //                     optionLabel: (o) => t(o),
    //                     options: listStore.listData.telecomUses,
    //                     outerClass: "col-3",
    //                     variant: "filled",
    //                 },
    //                 {
    //                     $formkit: "primeSelect",
    //                     name: "system",
    //                     label: t("system"),
    //                     optionLabel: (o) => t(o),
    //                     options: listStore.listData.telecomTypes,
    //                     outerClass: "col-3",
    //                     variant: "filled",
    //                 },
    //                 {
    //                     $formkit: "primeInputText",
    //                     name: "value",
    //                     label: t("phoneOrMail"),
    //                     outerClass: "col-6",
    //                     if: "$item.system === 'email'",
    //                     validation: "required|email",
    //                     variant: "filled",
    //                 },
    //                 {
    //                     $formkit: "primeInputText",
    //                     name: "value",
    //                     label: t("phoneOrMail"),
    //                     outerClass: "col-6",
    //                     if: "$item.system === 'phone'",
    //                     validation: "required|japanesePhone",
    //                     variant: "filled",
    //                 },
    //             ],
    //         },
    //     ],
    // },
    // {
    //     $el: "h3",
    //     children: t("relation"),
    // },
    // {
    //     $formkit: "group",
    //     name: "contact",
    //     children: [
    //         {
    //             $formkit: "primeCheckbox",
    //             name: "register",
    //             id: "registerContact",
    //             suffix: t("registerContact"),
    //         },
    //     ],
    // },
    // {
    //     $formkit: "group",
    //     if: "$contact.register",
    //     name: "contact",
    //     children: [
    //         {
    //             $el: "div",
    //             attrs: {
    //                 class: "grid gap-4 grid-cols-2 w-full",
    //             },
    //             children: [
    //                 {
    //                     $el: "div",
    //                     attrs: {
    //                         class: "grid grid-cols-2 gap-4",
    //                     },
    //                     children: [
    //                         {
    //                             $formkit: "group",
    //                             name: "name",
    //                             children: [
    //                                 {
    //                                     $formkit: "primeInputText",
    //                                     name: "family",
    //                                     label: t("lastName"),
    //                                     validation: "required",
    //                                 },
    //                                 {
    //                                     $formkit: "primeInputText",
    //                                     name: "given",
    //                                     label: t("firstName"),
    //                                     validation: "required",
    //                                 },
    //                                 {
    //                                     $formkit: "primeInputText",
    //                                     name: "familyKana",
    //                                     label: t("lastNameKana"),
    //                                     validation: "required|notKanji",
    //                                 },
    //                                 {
    //                                     $formkit: "primeInputText",
    //                                     name: "givenKana",
    //                                     label: t("firstNameKana"),
    //                                     validation: "required|notKanji",
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     $formkit: "primeListbox",
    //                     id: "contactSearch",
    //                     name: "cookie_notice",
    //                     label: t("existingPerson"),
    //                     pt: { root: { class: "h-[122px]" } },
    //                     optionLabel: (o) => `${o.name.family}${o.name.given}`,
    //                     options: [],
    //                 },
    //             ],
    //         },
    //         {
    //             $formkit: "group",
    //             name: "address",
    //             children: [
    //                 {
    //                     $formkit: "primeSelect",
    //                     name: "use",
    //                     label: t("use"),
    //                     optionLabel: (o) => t(o),
    //                     options: listStore.listData.telecomUses,
    //                     outerClass: "$reset col-2",
    //                 },
    //                 {
    //                     $formkit: "primeInputText",
    //                     name: "postalCode",
    //                     label: t("zipCode"),
    //                     outerClass: "col-3",
    //                     validation: "japanesePostal",
    //                 },
    //                 {
    //                     $formkit: "primeInputText",
    //                     name: "text",
    //                     label: t("address"),
    //                     outerClass: "col-3",
    //                 },
    //                 {
    //                     $formkit: "primeInputText",
    //                     name: "line",
    //                     label: t("RoomOrCompany"),
    //                     outerClass: "col-4",
    //                 },
    //             ],
    //         },
    //     ],
    // },
];
</script>
