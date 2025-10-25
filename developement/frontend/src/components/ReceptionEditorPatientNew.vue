<template>
    <div>
        <div class="h-[calc(100vh-200px)] overflow-auto min-h-0 p-4">
            <FormKit
                id="patientForm"
                v-model="patient"
                type="form"
                @submit="submitPatient"
                :disabled="loading"
                actionsClass="!hidden"
                class="p-4"
                :actions="false"
            >
                <FormKitSchema :schema="formSchema" :data="patient" />
            </FormKit>
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

const formSchema = [
    {
        $el: "h3",
        children: [t("name"), ""],
    },
    {
        $formkit: "list",
        name: "name",
        children: [
            {
                $formkit: "group",
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
                ],
            },
            {
                $formkit: "group",
                children: [
                    {
                        $formkit: "primeInputText",
                        name: "family",
                        label: t("lastNameKana"),
                        outerClass: "col-6",
                        validation: "required|notKanji",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "given",
                        label: t("firstNameKana"),
                        outerClass: "col-6",
                        validation: "required|notKanji",
                    },
                ],
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
        $formkit: "list",
        name: "address",
        children: [
            {
                $formkit: "group",
                for: ["item", "key", "$address"],
                children: [
                    {
                        $formkit: "primeSelect",
                        name: "use",
                        label: t("use"),
                        optionLabel: (o) => t(o),
                        options: listStore.listData.telecomUses,
                        outerClass: "col-2",
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
    {
        $el: "h3",
        children: t("householder"),
    },

    {
        $formkit: "list",
        name: "contact",
        children: [
            {
                $formkit: "group",
                for: ["item", "key", "$contact"],
                children: [
                    {
                        $formkit: "primeInputText",
                        id: "householderName",
                        name: "name",
                        label: t("name"),
                        outerClass: "col-8",
                    },
                    {
                        $formkit: "primeSelect",
                        name: "use",
                        label: t("relation"),
                        optionLabel: (o) => t(o),
                        options: listStore.listData.relations,
                        outerClass: "col-4",
                        optionLabel: (o) => t(o.name),
                        if: "$get(householderName).value",
                        validation: "required",
                    },
                ],
            },
        ],
    },
];

const loading = ref(false);

const patient = ref({
    birthDate: null,
    gender: "male",
    name: [
        {
            nameRepresentationUse: "IDE",
            use: "official",
            family: "",
            given: "",
        },
        {
            nameRepresentationUse: "SYL",
            use: "official",
            family: "",
            given: "",
        },
    ],
    telecom: [{ system: "phone", value: "", use: "home" }],
    address: [
        {
            use: "home",
            type: "postal",
            line: [],
            text: "",
            postalCode: "",
            country: "JPN",
        },
    ],
    occupation: "employee",
    contact: [{ name: "", relation: "" }],
});

async function submitPatient() {
    loading.value = true;
    const payload = JSON.parse(JSON.stringify(patient.value));
    try {
        // const response = await useApi.post("/patients", payload);
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
