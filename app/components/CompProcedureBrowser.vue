<script setup>
const systemStore = useSystemStore();
const userStore = useUserStore();
const toast = useToast();

const searching = ref(false);
const procedures = ref([]);
const searchInput = ref("");
const activeCategory = ref(systemStore?.system?.ui.procedureCategories[0].code);
const timeout = ref(null);
const columns = [
    {
        accessorKey: "name",
        header: $t("procedureName"),
    },
    {
        accessorKey: "cost",
        header: $t("points"),
    },
];

const emit = defineEmits(["selected"]);

watch(activeCategory, () => {
    searchInput.value = "";
    procedures.value = [];
    if (timeout.value) {
        clearTimeout(timeout.value);
    }
});

const filteredProcedureCategories = computed(() => {
    return systemStore?.system?.ui.procedureCategories.filter(
        (item) => item.code != "90",
    );
});

const searchProcedures = (delay = 1000) => {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout.value = setTimeout(async () => {
        procedures.value = []
        if (searchInput.value === "") return

        searching.value = true;
        try {
            const res = await fetch(
                `/api/procedure/search?cat=${activeCategory.value}&search=${searchInput.value}`,
            );
            const data = await res.json();
            procedures.value = data.data || [];
        } catch (error) {
            console.error(error);
            toast.add({ title: error.message, color: "error" });
        } finally {
            searching.value = false;
        }
    }, delay);
};

const selectProcedure = (e, row) => {
    const item = row.original;
    const catObj = systemStore?.system?.ui.procedureCategories.find(
        (c) => c.code == activeCategory.value
    );
    item.cat = catObj || { code: activeCategory.value };

    const label = catObj.label;
    if (label === 'shot' || label === 'prevVac') {
        item.varData = { location: null, amount: null, lot: null };
    } else if (label === 'perscription') {
        item.varData = { type: null, timing: [], amount: null, duration: null };
    } else if (label === 'exam') {
        item.varData = [];
    }

    emit("selected", item);
};

</script>

<template>
    <UTabs
        :items="filteredProcedureCategories"
        color="neutral"
        class="h-full"
        valueKey="code"
        v-model="activeCategory"
        :ui="{
            content: 'h-full',
            list: 'flex-wrap',
            indicator: 'hidden',
            trigger:
                'data-[state=active]:bg-inverted data-[state=active]:text-inverted rounded-md',
        }"
    >
        <template #leading="{ item }">
            <UIcon :name="systemStore?.icons?.[item.label]" class="size-5" />
        </template>
        <template #default="{ item }">
            {{ $t(item.label) }}
        </template>
        <template #content="{ item }">
            <UInput
                v-model="searchInput"
                :loading="searching"
                class="max-w-sm"
                icon="material-symbols:search-rounded"
                :placeholder="$t('patientSearch')"
                @update:modelValue="searchProcedures"
            />
            <UTable
                :data="procedures"
                :columns="columns"
                class="w-full border border-gray-200 dark:border-gray-800 rounded-lg"
                @select="selectProcedure"
            >
                <template #cost-cell="{ row }">
                    <div class="flex justify-end">
                        {{ row.original.cost?.slice(0, -3) || "0" }}
                    </div>
                </template>
            </UTable>
        </template>
    </UTabs>
</template>
