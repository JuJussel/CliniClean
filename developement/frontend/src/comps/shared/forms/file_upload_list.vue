<template>
    <div class="flex gap-4 items-center">
        <FileUpload :multiple="true" mode="basic" @select="updateFiles" customUpload auto severity="secondary"
            class="p-button-outlined shrink-0" />
        <DataView :value="filesRaw">
            <template #empty>
                {{ $t('filesSelect') }}
            </template>
            <template #list="slotProps">
                <div v-for="(item, index) in slotProps.items" :key="index" class="flex gap-2 items-center">
                    <Button icon="pi pi-times" severity="danger" text size="small" @click="removeFile(index)" />
                    <i class="pi pi-file-arrow-up"></i>
                    <div>{{ item[0].name }}</div>
                </div>
            </template>
        </DataView>
    </div>
</template>

<script setup>



const filesRaw = ref([])

const updateFiles = (event) => {
    filesRaw.value.push(event.files)
}

const removeFile = (file) => {
    filesRaw.value.splice(file, 1)
}

defineExpose({
    filesRaw
})


</script>