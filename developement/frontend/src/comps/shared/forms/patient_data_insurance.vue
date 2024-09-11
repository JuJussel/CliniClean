<template>
    <div>
        <div class="flex items-center gap-2">
            <ToggleSwitch v-model="isPublic" />
            <span>{{ $t('publicInsurance') }}</span>
        </div>
    </div>
</template>

<script setup>
import ToggleSwitch from 'primevue/toggleswitch';

const isPublic = ref(false)



</script>