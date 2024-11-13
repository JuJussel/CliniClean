<template>
    <div class="flex gap-2 items-center">
        <div class="flex flex-col gap-1 mb-4">
            <label for="nameKana">{{ $t("nameKana") }}</label>
            <InputText v-model="newHabit.name" />
        </div>
            <div class="flex flex-col gap-1 mb-4">
            <label for="nameKana">{{ $t("nameKana") }}</label>
            <InputText v-model="newHabit.values[0]" />
        </div>
        <Button icon="pi pi-check" @click="add" />
    </div>
</template>

<script setup>

const emit = defineEmits(['add'])

const newHabit = ref({
    icon: 'pi pi-crown',
    name: '',
    values: ['']
})

const add = () => {
    emit('add', newHabit.value)
}


</script>