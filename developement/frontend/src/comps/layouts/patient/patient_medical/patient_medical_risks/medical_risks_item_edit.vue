<template>
        <InputGroup v-for="(value, i) in itemData" :key="i" class="mb-2">
            <InputText v-model="itemData[i]" />
            <Button :disabled="itemData[i]=== ''" icon="pi pi-plus"  severity="secondary" @click="itemData.push('')"/>
        </InputGroup>
</template>

<script setup>

const props = defineProps(['itemData'])

if (props.itemData.length == 0) {
    props.itemData.push('')
}

</script>