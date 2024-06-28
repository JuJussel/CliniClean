<template>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="$emit('close')" raised></Button>
        <Button type="button" label="Save" @click="commit()" raised></Button>
    </div>

</template>

<script setup>

const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])

function commit() {

}
</script>