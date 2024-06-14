<template>
    <div class="grid grid-cols-2">
        <div>ddd</div>
        <div>
            <div>{{ $t('comment') }}</div>
            <Textarea v-model="value" rows="5" cols="30" />
        </div>
    </div>

    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="$emit('close')"></Button>
        <Button type="button" label="Save" @click=""></Button>
    </div>
</template>

<script setup>

const emit = defineEmits(['close', 'commit'])

</script>