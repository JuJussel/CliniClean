<template>
    <cui-table :data="procedures" compact>
        <template v-slot:row="row">
            <td>
                <i :class="row.cat.icon"></i>
                {{  row.name }}
            </td>
            
        </template>
        <template v-slot:expand="{ expand }">
            Expand
        </template>
    </cui-table>
</template>

<script>
export default {
    props: {
        procedures: {
            type: Array,
            default: []
        }
    }
}
</script>