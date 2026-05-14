<script setup>
const systemStore = useSystemStore();
const userStore = useUserStore();
const toast = useToast();

const searching = ref(false);
const procedures = ref([]);
const searchInput = ref("");
const favs = ref([]);
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

defineEmits(["selected"]);

const filteredProcedureCategories = computed(() => {
    return systemStore?.system?.ui.procedureCategories.filter(
        (item) => item.code != 90,
    );
});

const searchProcedures = (delay = 1000) => {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout.value = setTimeout(async () => {
        if (searchInput.value === "") {
            procedures.value = favs.value.filter(
                (item) => item.cat.code === activeCategory.value,
            );
            return;
        }
        searching.value = true;
        try {
            if (activeCategory.value == 25 || activeCategory.value == 30) {
                const res = await fetch(
                    `/api/medications/search?cat=${activeCategory.value}&search=${searchInput.value}`,
                );
                procedures.value = await res.json();
            } else {
                procedures.value = await fetch(
                    `/api/procedures/search?cat=${activeCategory.value}&search=${searchInput.value}`,
                );
            }
        } catch (error) {
            console.error(error);
            toast.add({ title: error.message, color: "error" });
        } finally {
            searching.value = false;
        }
    }, delay);
};

const getFavourites = async () => {
    searching.value = true;
    try {
        const res = await fetch(
            `/api/user/${userStore?.userData?._id}/favourites`,
        );
        favs.value = await res.json();
    } catch (error) {
        console.error(error);
        toast.add({ title: error.message, color: "error" });
    } finally {
        searching.value = false;
    }
};

const selectProcedure = (item) => {
    emit("selected", item);
    try {
        fetch(`/api/users/${userStore?.userData?._id}/favourites`, {
            method: "POST",
            body: JSON.stringify(item),
        });
    } catch (error) {
        console.error(error);
        toast.add({
            title: error.message,
            color: "error",
        });
    }
};

watch(activeCategory, () => {
    procedures.value = favs.value.filter(
        (item) => item.cat.code === activeCategory.value,
    );
});

onMounted(async () => {
    await getFavourites();
});
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
