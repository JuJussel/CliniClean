<template>
    <div>
        <cui-table :data="procedures">
            <template v-slot:row="{ row }">
                <td style="width: 20px">
                    <i :class="row.cat.icon"></i>
                </td>
                <td> 
                    <b>{{ row.name }}</b>
                    <i v-if="row.varData" class="fas fa-clipboard-list"></i>
                </td>
                <td style="width: 60px">
                    <div class="cc-shared-procedures-list-row-buttons" @click.stop="">
                        <cui-button
                            icon="fas fa-shopping-basket"
                            white
                        />
                        <cui-button
                            icon="fas fa-yen-sign"
                            white
                        />
                        <cui-button
                            icon="far fa-trash-alt"
                            danger
                            @click="removeProcedure(row)"
                        />
                    </div>

                </td>
            </template>
            <template v-slot:expand="{ expand }">
                <div>
                    <component 
                        :is="expand.cat.label" 
                        :item="expand" 
                        @update="item => expand.varData = item"
                        v-if="expand.cat.code !== '40' || expand.cat.code !== '50'"
                    />
                    <div>
                        <cui-input 
                            :label="$lang.comment"
                            v-model="expand.comment"
                        />
                    </div>
                </div>
            </template>
        </cui-table>
    </div>
</template>

<script>

import exam from "./cc_shared_procedure_exam.vue"
import shot from "./cc_shared_procedure_shot.vue"
import perscription from "./cc_shared_procedure_perscription.vue"

export default {
    components: {
        'exam': exam,
        'shot': shot,
        'perVac': shot,
        'perscription': perscription
    },
    emits: ['remove'],
    props: {
        procedures: {
            default: null,
            type: Array
        }
    },
    methods: {
        removeProcedure(procedure) {
            this.$emit('remove', procedure._index)
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