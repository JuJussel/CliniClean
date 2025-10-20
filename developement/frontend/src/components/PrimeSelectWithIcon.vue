<template>
  <!-- Wrapper around PrimeVue Select that renders an icon plus label
       Option objects should be: { value, label, icon } -->
  <Select
    v-bind="$attrs"
    :options="options"
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <template #option="slotProps">
      <div class="flex items-center">
        <i v-if="slotProps.option?.icon" :class="slotProps.option.icon" class="mr-2" />
        <div>{{ slotProps.option?.label }}</div>
      </div>
    </template>

    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <i v-if="slotProps.value?.icon" :class="slotProps.value.icon" class="mr-2" />
        <div>{{ slotProps.value?.label }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup>
import { toRefs } from 'vue'
import Select from 'primevue/select'

defineProps({
  modelValue: null,
  options: { type: Array, default: () => [] }
})

const emits = defineEmits(['update:modelValue'])

// expose Select for inner use (not strictly necessary but helpful)
const { options } = toRefs(defineProps())
</script>

<style scoped>
/* small spacing adjustments can be added here if needed */
</style>
