<template>
    <cui-table :data="procedures" compact>
        <template v-slot:row="row">
            <td>
                <i :class="row.cat.icon"></i>
                {{  row.name }}
            </td>
            
        </template>
        <template v-slot:expand="{ expand }">
            <!--exam -->
            <div v-if="expand.cat.code === 60">
                Exam
            </div>
            <!-- perscription -->
            <div v-if="expand.cat.code === 25">
                {{ expand.varData?.timing.name || "" }}
                {{ expand.varData?.amount || "" }}
                {{ expand.taniname || "" }}
                {{ expand.varData?.duration || ""}}
                {{ expand.varData?.timing.unit || "" }}

            </div>
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