<template>
    <div style="display: flex">
        <cui-select
            :data="shotLocations"
            v-model="varData.location"
            style="width: 100px"
            :label="$lang.shotLocation"
            @update:modelValue="updateValue"
            :disabled="item.order?.done || item.order?.locked"
        />
        <cui-input
            style="width: 100px; margin-left: 30px"
            v-model="varData.amount"
            :append="$lang.vial"
            :label="$lang.shotAmount"
            @update:modelValue="updateValue"
            :disabled="item.order?.done || item.order?.locked"
        />
        <cui-input
            style="width: 100px; margin-left: 30px"
            v-model="varData.lot"
            :label="$lang.shotLot"
            @update:modelValue="updateValue"
            :disabled="item.order?.done || item.order?.locked"
        />
    </div>
</template>

<script>
export default {
    props: {
        item: {
            default: null,
        },
    },
    created() {
        this.setData();
    },
    emits: ["update"],
    methods: {
        updateValue() {
            this.$emit("update", this.varData);
        },
        setData() {
            if (this.item.varData) {
                this.varData = this.item.varData;
            }
        },
    },
    data() {
        return {
            shotLocations: this.$store.getters.config.shotLocations,
            varData: {
                location: null,
                amount: "",
                lot: "",
            },
        };
    },
};
</script>