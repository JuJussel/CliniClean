<script setup></script>

<template>
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

    <UPageFeature
    :title="$t('registerNewPatient')"
        description="Customize Nuxt UI with your own colors, fonts, and more."
        icon="material-symbols:person-add"
    />
        <FormPatientRegistration />
    



</template>
