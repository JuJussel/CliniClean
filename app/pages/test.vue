<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const fields: AuthFormField[] = [
    {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
    },
];

const schema = z.object({
    email: z.email("Invalid email"),
    password: z
        .string("Password is required")
        .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
    console.log("Submitted", payload);
}
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm
                :schema="schema"
                :fields="fields"
                title="Welcome back!"
                icon="i-lucide-lock"
                @submit="onSubmit"
            >
                <!-- <template #validation>
                    <UAlert
                        color="error"
                        icon="i-lucide-info"
                        title="Error signing in"
                    />
                </template> -->
            </UAuthForm>
        </UPageCard>
    </div>
</template>
