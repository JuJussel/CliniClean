<template>
    <div>
        <div class="h-[calc(100vh-200px)] overflow-auto min-h-0">
            <FormKitDataEdit
                v-model="patient"
                id="patientForm"
                actionsClass="!hidden"
                :schema="formSchema"
                class="p-4"
                @data-saved="submitPatient"
            />
        </div>
        <div class="flex justify-end mt-4">
            <Button
                :label="$t('register')"
                icon="pi pi-check"
                @click="validateForm()"
            />
        </div>
    </div>
</template>

<script setup>
import { FormKitDataEdit } from "@sfxcode/formkit-primevue/components";

import useApi from "@/composables/apiComposable.js";
import { useI18n } from "vue-i18n";
import { submitForm } from "@formkit/vue";

const { t } = useI18n();

const listStore = useListStore();

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
                        validation: "required",
                    },
                    {
                        $formkit: "primeInputText",
                        name: "given",
                        label: t("firstNameKana"),
                        outerClass: "col-6",
                        validation: "required",
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
        validation: "required",
    },
    {
        $formkit: "primeSelect",
        name: "gender",
        label: t("gender"),
        optionLabel: (g) => t(g),
        options: listStore.listData.genders,
        outerClass: "col-3",
    },
    {
        $formkit: "primeSelect",
        name: "occupation",
        label: t("occupation"),
        optionLabel: (o) => t(o),
        options: listStore.listData.occupations,
        outerClass: "col-3",
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
                        validation: "required",
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
                        validation: "required",
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
                    },
                ],
            },
        ],
    },
];

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

async function validateForm() {
    await submitForm("patientForm");
}

async function submitPatient() {
    const payload = JSON.parse(JSON.stringify(patient.value));
    alert("Saved");
}
</script>
