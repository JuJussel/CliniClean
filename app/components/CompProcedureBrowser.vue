<script setup>
const systemStore = useSystemStore();

const filteredProcedureCategories = computed(() => {
    return systemStore.system.ui.procedureCategories.filter(
        (item) => item.code != 90,
    );
});
</script>

<template>
    <UTabs
        :items="filteredProcedureCategories"
        color="neutral"
        class="h-full"
        :ui="{
            content: 'h-full',
            list: 'flex-wrap',
            indicator: 'hidden',
            trigger:
                'data-[state=active]:bg-inverted data-[state=active]:text-inverted rounded-md',
        }"
    >
        <template #default="{ item }">
            {{ $t(item.label) }}
        </template>
        <template #search> </template>
    </UTabs>
</template>
