<template>
    <div>
        <cui-table :data="healthCheckItems" compact square>
            <template v-slot:row="{ row }">
                <td style="width: 150px">
                    {{ $lang[row[0]] }}
                </td>
                <td>
                    <div>
                        <span v-if="row[1].value"> {{ row[1].value }} </span>
                        <span v-else> {{ $lang.hasNot }} </span>
                    </div>
                    <div v-if="row[1].value && row[1].note">
                        {{ row[1].note }}
                    </div>
                </td>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            default: null,
        },
    },
    emits: ["update"],
    methods: {
        updateValue() {
            this.$emit("update", this.varData);
        },    },
    data() {
        return {
        };
    },
    computed: {
        healthCheckItems() {
            return Object.entries(this.item.varData)
        }
    }
};
</script>