<script>
const searchQuery = ref("");
</script>

<template>
    <div>
        <UInput
            v-model="searchQuery"
            class="max-w-sm"
            icon="i-lucide-search"
            :placeholder="$t('patientSearch')"
        />
    </div>
</template>
