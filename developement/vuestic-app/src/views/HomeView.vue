<script setup>
import Reception from '../components/Reception.vue'
</script>

<template>
  <VaNavbar color="secondary" class="h-18">
    <template #left>
      <VaNavbarItem class="logo">
        LOGO
      </VaNavbarItem>
    </template>
    <template #right>
      <VaNavbarItem class="hidden sm:block">
        Dashboard
      </VaNavbarItem>
      <VaNavbarItem class="hidden sm:block">
        Reports
      </VaNavbarItem>
      <VaNavbarItem class="hidden sm:block">
        Users
      </VaNavbarItem>
      <VaNavbarItem>
        <VaIcon name="mdi-magnify" />
      </VaNavbarItem>
      <VaNavbarItem>
        <VaIcon name="mdi-account-circle-outline" />
      </VaNavbarItem>
    </template>
  </VaNavbar>

  <main style="height: calc(100% - 61px);" class="p-2">
    <Reception />
  </main>
</template>
