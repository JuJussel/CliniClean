<script setup>
const systemStore = useSystemStore();
const userStore = useUserStore();
const toast = useToast();

const searching = ref(false);
const procedures = ref([]);
const searchInput = ref("");
const vaccineSearch = ref("");
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

const isPrevVacTab = computed(() => {
    const catObj = filteredProcedureCategories.value?.find(
        (c) => c.code === activeCategory.value
    );
    return catObj?.label === 'prevVac';
});

const vaccineTreeItems = computed(() => {
    const vaccines = systemStore?.system?.settings?.vaccines;
    if (!vaccines || !Array.isArray(vaccines)) return [];

    const query = vaccineSearch.value?.toLowerCase() || '';

    return vaccines
        .map((diseaseGroup) => {
            const filteredVaccines = (diseaseGroup.vaccines || []).map((vaccine) => {
                const filteredVariants = (vaccine.variants || []).filter((variant) => {
                    if (!query) return true;
                    return (
                        variant.name?.toLowerCase().includes(query) ||
                        vaccine.commonName?.toLowerCase().includes(query) ||
                        diseaseGroup.name?.toLowerCase().includes(query)
                    );
                });

                if (filteredVariants.length === 0) return null;

                return {
                    label: vaccine.commonName,
                    icon: 'material-symbols:syringe-outline',
                    _key: `${diseaseGroup.name}::${vaccine.commonName}`,
                    children: filteredVariants.map((variant) => ({
                        label: variant.name,
                        icon: 'material-symbols:vaccines-outline',
                        _key: `${diseaseGroup.name}::${vaccine.commonName}::${variant.name}`,
                        _variantData: variant,
                        _commonName: vaccine.commonName,
                        _diseaseName: diseaseGroup.name,
                    })),
                };
            }).filter(Boolean);

            if (filteredVaccines.length === 0) return null;

            return {
                label: diseaseGroup.name,
                icon: 'material-symbols:coronavirus-outline',
                _key: diseaseGroup.name,
                defaultExpanded: !!query,
                children: filteredVaccines,
            };
        })
        .filter(Boolean);
});

watch(activeCategory, () => {
    searchInput.value = "";
    vaccineSearch.value = "";
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

const selectVaccine = (e, treeItem) => {
    if (treeItem.children && treeItem.children.length > 0) {
        e.preventDefault();
        return;
    }

    const catObj = systemStore?.system?.ui.procedureCategories.find(
        (c) => c.code === activeCategory.value
    );

    const item = {
        name: treeItem._variantData?.name || treeItem.label,
        commonName: treeItem._commonName,
        disease: treeItem._diseaseName,
        url: treeItem._variantData?.url || null,
        cat: catObj || { code: activeCategory.value },
        varData: { location: null, amount: null, lot: null },
    };

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
            <!-- Vaccine tree view for prevVac tab -->
            <template v-if="isPrevVacTab">
                <UInput
                    v-model="vaccineSearch"
                    class="max-w-sm mb-3"
                    icon="material-symbols:search-rounded"
                    :placeholder="$t('searchVaccines')"
                />
                <UTree
                    :items="vaccineTreeItems"
                    color="neutral"
                    :get-key="(item) => item._key || item.label"
                    expanded-icon="material-symbols:coronavirus-outline"
                    collapsed-icon="material-symbols:coronavirus-outline"
                    @select="selectVaccine"
                />
            </template>
            <!-- Standard search + table for other tabs -->
            <template v-else>
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
        </template>
    </UTabs>
</template>
