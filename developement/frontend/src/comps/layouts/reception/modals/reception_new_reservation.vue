<template>
    <div class="grid grid-cols-2 gap-16">
        <div></div>
        <div style="height: 500px">
            <Calendar ref="calendar" :reRender="350" @selectDate="" />

        </div>
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" :label="('cancel')" severity="secondary" @click="$emit('close')" raised></Button>
        <Button type="button" :label="('save')" @click="commit()" raised></Button>
    </div>

</template>

<script setup>

import Calendar from '../../../shared/calendar.vue'

const props = defineProps(['patient'])
const emit = defineEmits(['close', 'commit'])

</script>