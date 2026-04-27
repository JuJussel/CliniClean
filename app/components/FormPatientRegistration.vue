<script setup>
import * as z from "zod";

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
});

const systemStore = useSystemStore();

const emit = defineEmits(["submitted"]);

const state = reactive({
    type: "patient",
    birthDate: null,
    gender: "female",
    name: {
        family: "田中",
        given: "由依",
        familyKana: "たなか",
        givenKana: "ゆい",
    },
    telecom: {
        email: "yui@mail.com",
        phoneMobile: "08012345678",
        phoneHome: "08012345678",
    },
    address: {
        address: "東京都品川区小山",
        zip: 1420062,
        country: "JPN",
        line: "Room 101",
    },
    occupation: "employee",
});

const schema = z.object({
    birthDate: z
        .custom((val) => val && typeof val === "object" && "toDate" in val, {
            message: "Invalid date selection",
        })
        .transform((calendarDate) => calendarDate.toDate("UTC")) // Convert to native Date
        .pipe(z.date())
        .refine((date) => date <= new Date(), {
            message: "Birth date cannot be in the future",
        }),
    name: z.object({
        family: z.string().min(1, $t("validationMessages.stringEmpty")),
        given: z.string().min(1, $t("validationMessages.stringEmpty")),
        familyKana: z.string().min(1, $t("validationMessages.stringEmpty")),
        givenKana: z.string().min(1, $t("validationMessages.stringEmpty")),
    }),
    gender: z.enum(["male", "female", "other", "unknown"]),
    telecom: z.object({
        email: z
            .email()
            .min(1, $t("validationMessages.stringEmpty"))
            .optional()
            .or(z.literal("")),
        phoneMobile: z.string().min(1, $t("validationMessages.stringEmpty")),
    }),
    address: z.object({
        address: z.string().min(1, $t("validationMessages.stringEmpty")),
        zip: z.number().min(999999, $t("validationMessages.stringEmpty")),
        line: z.string().min(1, $t("validationMessages.stringEmpty")),
    }),
});

async function fetchAddress() {
    try {
        const response = await $fetch("/api/address/" + state.address.zip, {
            method: "GET",
        });
        if (response.success && response.data) {
            state.address.address = response.data.address;
        } else {
            throw new Error(response.message || "Failed to fetch address");
        }
    } catch (error) {
        console.error("Error fetching address:", error);
        // Show user-friendly error message
    }
}

async function onSubmit(event) {
    emit("submitted", event.data);
}
</script>

<template>
    <UForm
        ref="form"
        :schema="schema"
        :state="state"
        :disabled="disabled"
        class="max-w-175"
        @submit="onSubmit"
    >
        <div class="grid grid-cols-6 gap-6">
            <UFormField
                :label="$t('lastName')"
                name="name.family"
                class="col-span-3"
            >
                <UInput v-model="state.name.family" class="flex" />
            </UFormField>
            <UFormField
                :label="$t('firstName')"
                name="name.given"
                class="col-span-3"
            >
                <UInput v-model="state.name.given" class="flex" />
            </UFormField>
            <UFormField
                :label="$t('lastNameKana')"
                name="name.familyKana"
                class="col-span-3"
            >
                <UInput v-model="state.name.familyKana" class="flex" />
            </UFormField>
            <UFormField
                :label="$t('firstNameKana')"
                name="name.givenKana"
                class="col-span-3"
            >
                <UInput v-model="state.name.givenKana" class="flex" />
            </UFormField>

            <UFormField
                :label="$t('birthDate')"
                name="birthDate"
                class="col-span-3"
            >
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

            <UFormField :label="$t('gender')" name="gender" class="col-span-3">
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
            <UFormField
                :label="$t('zipCode')"
                name="address.zip"
                class="col-span-2"
            >
                <UInputNumber
                    v-model="state.address.zip"
                    class="flex"
                    placeholder="1420063"
                    @change="fetchAddress"
                    :increment="false"
                    :decrement="false"
                    :format-options="{ useGrouping: false }"
                />
            </UFormField>
            <UFormField
                :label="$t('address')"
                name="address.address"
                class="col-span-2"
            >
                <UInput v-model="state.address.address" class="flex" />
            </UFormField>
            <UFormField
                :label="$t('RoomOrCompany')"
                name="address.line"
                class="col-span-2"
            >
                <UInput v-model="state.address.line" class="flex" />
            </UFormField>
            <UFormField
                :label="$t('email')"
                name="telecom.email"
                class="col-span-3"
            >
                <UInput
                    v-model="state.telecom.email"
                    class="flex"
                    placeholder="email@mail.com"
                />
            </UFormField>
            <UFormField
                :label="$t('phone')"
                name="telecom.phoneMobile"
                class="col-span-3"
            >
                <UInput
                    v-model="state.telecom.phoneMobile"
                    class="flex"
                    placeholder="08012345678"
                />
            </UFormField>
        </div>
    </UForm>
</template>
