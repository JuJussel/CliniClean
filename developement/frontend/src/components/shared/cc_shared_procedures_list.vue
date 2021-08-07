<template>
    <div>
        <cui-table :data="procedures">
            <template v-slot:row="{ row }">
                <td style="width: 20px">
                    <i :class="row.cat.icon"></i>
                </td>
                <td> 
                    {{ row.name }}
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
                <div> {{ expand.name }} </div>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
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