<script setup></script>

<template>
    <UPageFeature
        :title="$t('insuranceOrMyNumber')"
        description="Customize Nuxt UI with your own colors, fonts, and more."
        icon="material-symbols:id-card-outline"
    />
    <UTable :data="[]" />

    <UPageFeature
        description="Customize Nuxt UI with your own colors, fonts, and more."
        icon="material-symbols:person-add"
    >
        <template #title>
            <UButton color="neutral">{{ $t("registerNewPatient") }}</UButton>
        </template>
    </UPageFeature>
    <FormPatientRegistration />

    <UPageFeature
        title="Search"
        description="Customize Nuxt UI with your own colors, fonts, and more."
        icon="material-symbols:search"
    >
        <template #title>
            <UInput class="max-w-sm" :placeholder="$t('patientSearch')" />
        </template>
    </UPageFeature>
    <UTable :data="[]" />
</template>
