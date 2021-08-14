<template>
    <div>
        <cui-table :data="procedures">
            <template v-slot:row="{ row }">
                <td style="width: 20px">
                    <i :class="row.cat.icon"></i>
                </td>
                <td> 
                    {{ row.name }}
                    <i class="fas fa-clipboard-list"></i>
                </td>
                <td style="width: 60px">
                    <div class="cc-shared-procedures-list-row-buttons">
                        <cui-button
                            icon="fas fa-shopping-basket"
                            white
                            @click.stop=""
                        />
                        <cui-button
                            icon="fas fa-yen-sign"
                            white
                            @click.stop=""
                        />
                        <cui-button
                            icon="far fa-trash-alt"
                            danger
                            @click.stop=""
                        />
                    </div>

                </td>
            </template>
            <template v-slot:expand="{ expand }">
                <div>
                    <component :is="expand.cat.label" :item="expand" @update="item => expand.varData = item"></component>
                </div>
            </template>
        </cui-table>
    </div>
</template>

<script>

import exam from "./cc_shared_procedure_exam.vue"

export default {
    components: {
        'exam': exam
    },
    props: {
        procedures: {
            default: null,
            type: Array
        }
    }
}
</script>

<style>
    .cui-table tbody tr:not(.selected, .expanded, .noHover):hover
    .cc-shared-procedures-list-row-buttons {
        opacity: 1;
    }
    .cc-shared-procedures-list-row-buttons {
        transition: all .2s ease;
        display: flex;
        opacity: 0;
    }
    .cc-shared-procedures-list-row-buttons .cui-button {
        margin: 0 5px!important
    }
</style>