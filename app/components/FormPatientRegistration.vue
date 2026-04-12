<script setup>
import * as z from "zod";

const systemStore = useSystemStore();

const state = reactive({
    type: "patient",
    birthDate: null,
    gender: "male",
    name: {
        family: "",
        given: "",
        familyKana: "",
        givenKana: "",
    },
    telecom: {
        email: "",
        phoneMobile: "",
        phoneHome: "",
    },
    address: {
        address: "",
        zip: "",
        country: "JPN",
        line: "",
    },
    occupation: "employee",
});

const schema = z.object({
    birthDate: z.coerce
        .date()
        .date($t("validationMessages.dateBase"))
        .max(new Date(), $t("validationMessages.dateMax"))
        .min(new Date(1900, 0, 1), $t("validationMessages.dateMin")),
    name: z.object({
        family: z.string().min(1, $t("validationMessages.stringEmpty")),
        given: z.string().min(1, $t("validationMessages.stringEmpty")),
        familyKana: z.string().min(1, $t("validationMessages.stringEmpty")),
        givenKana: z.string().min(1, $t("validationMessages.stringEmpty")),
    }),
    gender: z.enum(["male", "female", "other", "unknown"]),
    telecom: z.object({
        email: z.email().optional(),
        phoneMobile: z.string(),
    }),
    address: z.object({
        address: z.string(),
        zip: z.number(),
        line: z.string(),
    }),
});

async function fetchAddress() {
    const address = await $fetch("/api/address/" + state.address.zip, {
        method: "GET",
    });
    state.address.address = address.address;
}

function onSubmit() {
    console.log("Form submitted with state:", state);
}
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-2">
            <UFormField :label="$t('lastName')" name="name.family">
                <UInput v-model="state.name.family" class="flex" />
            </UFormField>
            <UFormField :label="$t('firstName')" name="name.given">
                <UInput v-model="state.name.given" class="flex" />
            </UFormField>
            <UFormField :label="$t('lastNameKana')" name="name.familyKana">
                <UInput v-model="state.name.familyKana" class="flex" />
            </UFormField>
            <UFormField :label="$t('firstNameKana')" name="name.givenKana">
                <UInput v-model="state.name.givenKana" class="flex" />
            </UFormField>

            <UFormField :label="$t('birthDate')" name="birthDate">
                <UInputDate
                    v-model="state.birthDate"
                    :label="$t('birthDate')"
                    class="flex"
                >
                    <template #trailing>
                        <UPopover>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                icon="i-lucide-calendar"
                                aria-label="Select a date"
                                class="px-0"
                            />

                            <template #content>
                                <UCalendar
                                    v-model="state.birthDate"
                                    class="p-2"
                                />
                            </template>
                        </UPopover>
                    </template>
                </UInputDate>
            </UFormField>

            <UFormField :label="$t('gender')" name="gender">
                <USelect
                    v-model="state.gender"
                    :items="systemStore.system?.ui?.genders"
                    class="w-full"
                >
                    <template #item-label="{ item }">
                        {{ $t(item) }}
                    </template>
                    {{ $t(state.gender) }}
                </USelect>
            </UFormField>
        </div>

        <div class="grid grid-cols-3 gap-2">
            <UFormField :label="$t('zipCode')" name="zipCode">
                <UInput
                    v-model="state.address.zip"
                    class="flex"
                    placeholder="1420063"
                    @change="fetchAddress"
                />
            </UFormField>
            <UFormField :label="$t('address')" name="address">
                <UInput v-model="state.address.address" class="flex" />
            </UFormField>
            <UFormField :label="$t('RoomOrCompany')" name="addressLine">
                <UInput v-model="state.address.line" class="flex" />
            </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-2">
            <UFormField :label="$t('email')" name="email">
                <UInput
                    v-model="state.telecom.email"
                    class="flex"
                    placeholder="email@mail.com"
                />
            </UFormField>
            <UFormField :label="$t('phone')" name="phone">
                <UInput
                    v-model="state.telecom.phoneMobile"
                    class="flex"
                    placeholder="08012345678"
                />
            </UFormField>
        </div>

        <UButton type="submit"> Submit </UButton>
    </UForm>
</template>
