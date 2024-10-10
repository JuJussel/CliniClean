<template>
    <div>
        <InputGroup>
            <InputGroupAddon>
                <i class="pi pi-search" />
            </InputGroupAddon>
            <InputText v-model="search" :placeholder="$t('procedureSearch')" />
        </InputGroup>
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
const search = ref("");

async () => {
    favs.value = useApi.get("users/" + userStore.userData.id + "/favourites");
};

const selectProcedure = async (item) => {
    favs = await useApi.put(
        "users/" + userStore.userData.id + "/favourites",
        item.row
    );
};

const filteredProcedureCategories = computed(() => {
    return listStore.listData.procedureCategories.filter(
        (item) => item.code != 90
    );
});

const listData = computed(() => {
    if (search.value === "") {
        return favs.value.filter((item) => item.cat.code === activeCategory);
    }
});
</script>
