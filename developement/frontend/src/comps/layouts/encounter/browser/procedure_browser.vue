<template>
    <div class="h-full">
        <SelectButton
            class="!flex flex-wrap bg-[var(--p-togglebutton-background)] mb-2"
            v-model="activeCategory"
            :options="filteredProcedureCategories"
            optionLabel="label"
            optionValue="code"
            aria-labelledby="basic"
            @change="triggerSearch(0)"
        >
            <template #option="slotProps">
                {{ $t(slotProps.option.label) }}
            </template>
        </SelectButton>
        <IconField class="mb-2">
            <InputIcon>
                <ProgressSpinner
                    v-if="isSearching"
                    class="!w-[18px] !h-[18px]"
                />
                <i v-else class="pi pi-search" />
            </InputIcon>
            <InputText
                v-model="searchInput"
                @update:modelValue="triggerSearch(1000)"
                :placeholder="$t('procedureSearch')"
                class="w-full"
            />
        </IconField>
        <DataTable
            paginator
            :rows="10"
            :value="listData"
            selectionMode="single"
            dataKey="srycd"
            @update:selection="selectProcedure"
        >
            <Column field="name" :header="$t('procedureName')"></Column>
            <Column :header="$t('points')">
                <template #body="slotProps">
                    <div class="h-[34px] flex justify-end align-center">
                        <Tag
                            :value="slotProps.data.cost.slice(0, -3)"
                            severity="secondary"
                            class="w-12 h-8"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import useApi from "@/composables/apiComposable.js";

const userStore = useUserStore();
const listStore = useListStore();
const favs = ref([]);
const activeCategory = ref(listStore.listData.procedureCategories[0].code);
const searchInput = ref("");
const isSearching = ref(false);
const listData = ref([]);
const encounterStore = useEncounterStore();

onMounted(async () => {
    favs.value = await useApi.get(
        "users/" + userStore.userData.id + "/favourites"
    );
    listData.value = favs.value.filter(
        (item) => item.cat.code === activeCategory
    );
});

// Functions
const selectProcedure = async (item) => {
    item.cat = filteredProcedureCategories.value.find(
        (item) => item.code === activeCategory.value
    );
    console.log(item);

    favs.value = await useApi.put(
        "users/" + userStore.userData.id + "/favourites",
        item
    );
    encounterStore.encounterData.karte.procedures.push(item);
};

const triggerSearch = (delay = 1000) => {
    if (globalThis.timeout) {
        clearTimeout(globalThis.timeout);
    }
    globalThis.timeout = setTimeout(async () => {
        if (searchInput.value === "") return;
        isSearching.value = true;
        if (activeCategory.value == 25 || activeCategory.value == 30) {
            listData.value = await useApi.get(
                "medications/" + activeCategory.value + "/" + searchInput.value
            );
        } else {
            listData.value = await useApi.get(
                "procedures/" +
                    activeCategory.value +
                    "/search/" +
                    searchInput.value
            );
        }
        isSearching.value = false;
    }, delay);
};

// Computes
const filteredProcedureCategories = computed(() => {
    return listStore.listData.procedureCategories.filter(
        (item) => item.code != 90
    );
});

// const listData = computed(() => {
//     if (search.value === "") {
//         return favs.value.filter((item) => item.cat.code === activeCategory);
//     }
// });
</script>
