<template>
    <div>
        <SelectButton
            class="!flex flex-wrap bg-[var(--p-togglebutton-background)] mb-2"
            v-model="activeCategory"
            :options="filteredProcedureCategories"
            optionValue="code"
            aria-labelledby="basic"
        >
            <template #option="slotProps">
                {{ $t(slotProps.option.label) }}
            </template>
        </SelectButton>
        <IconField class="mb-2">
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText
                v-model="searchInput"
                @update:modelValue="triggerSearch"
                :placeholder="$t('procedureSearch')"
                class="w-full"
            />
        </IconField>

        <DataView :value="listData">
            <template #list="slotProps"> Hi </template>
        </DataView>
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
const listData = ref(
    favs.value.filter((item) => item.cat.code === activeCategory)
);

async () => {
    favs.value = useApi.get("users/" + userStore.userData.id + "/favourites");
};

// Functions
const selectProcedure = async (item) => {
    favs = await useApi.put(
        "users/" + userStore.userData.id + "/favourites",
        item.row
    );
};

const triggerSearch = async (input) => {
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
