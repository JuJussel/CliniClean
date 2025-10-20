<template>
    <div>
        <div class="h-[calc(100vh-200px)] overflow-auto min-h-0">
            <FormKitDataEdit
                v-model="patient"
                :schema="formSchema"
                class="p-4"
            />
        </div>
        <div class="flex justify-end mt-4">
            <Button :label="$t('register')" icon="pi pi-check" @click="save" />
        </div>
    </div>
</template>

<script setup>
import { FormKitDataEdit } from "@sfxcode/formkit-primevue/components";

import useApi from "@/composables/apiComposable.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const listStore = useListStore();

const genders = listStore.listData.genders;
const telecomTypes = listStore.listData.telecomTypes;
const telecomUses = listStore.listData.telecomUses;
const addressUses = listStore.listData.addressUses;

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
                    },
                    {
                        $formkit: "primeInputText",
                        name: "given",
                        label: t("firstName"),
                        outerClass: "col-6",
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
                    },
                    {
                        $formkit: "primeInputText",
                        name: "given",
                        label: t("firstNameKana"),
                        outerClass: "col-6",
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
                    },
                    {
                        $formkit: "primeInputText",
                        name: "text",
                        label: t("address"),
                        outerClass: "col-3",
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
        children: t("relation"),
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
                        $formkit: "primeSelect",
                        name: "use",
                        label: t("relation"),
                        optionLabel: (o) => t(o),
                        options: listStore.listData.relations,
                        outerClass: "col-4",
                        optionLabel: (o) => t(o.name),
                    },
                    {
                        $formkit: "primeInputText",
                        name: "name",
                        label: t("name"),
                        outerClass: "col-8",
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

function addName() {
    patient.value.name.push({ use: "additional", family: "", given: "" });
}

function removeName(idx) {
    patient.value.name.splice(idx, 1);
}

function addTelecom() {
    patient.value.telecom.push({ system: "phone", value: "", use: "home" });
}

function removeTelecom(idx) {
    patient.value.telecom.splice(idx, 1);
}

function addAddress() {
    patient.value.address.push({
        use: "home",
        type: "postal",
        line: [],
        text: "",
        postalCode: "",
        country: "JPN",
    });
}

function removeAddress(idx) {
    patient.value.address.splice(idx, 1);
}

function addContact() {
    patient.value.contact.push({ name: "", relation: "" });
}

function removeContact(idx) {
    patient.value.contact.splice(idx, 1);
}

async function save() {
    if (!validateForm()) return;
    const payload = JSON.parse(JSON.stringify(patient.value));

    try {
        // emit event or update store as needed
        alert("Saved");
    } catch (e) {
        console.error(e);
        alert("Save failed");
    }
}
</script>
