<template>
    <div style="display: flex">
        <cui-select
            :data="shotLocations"
            v-model="varData.location"
            style="width: 100px"
            :label="$lang.shotLocation"
            @update:modelValue="updateValue"
        />
        <cui-input
            style="width: 100px; margin-left: 30px"
            v-model="varData.amount"
            append="ml"
            :label="$lang.shotAmount"
            @update:modelValue="updateValue"
        />
        <cui-input 
            style="width: 100px; margin-left: 30px"
            v-model="varData.lot"
            :label="$lang.shotLot"
            @update:modelValue="updateValue"
        />
    </div>
</template>

<script>
export default {
    props: {
        item: {
            default: null
        }
    },
    created() {
        this.getShotLocations();
        this.setData()
    },
    emits: ['update'],
    methods: {
        async getShotLocations() {
            this.shotLocations = await this.$dataService().get.lists.shotLocations();
        },
        updateValue() {
            this.$emit('update', this.varData)
        },
        setData() {
            if (this.item.varData) {
                this.varData = this.item.varData
            }
        }

    },
    data() {
        return {
            shotLocations: [],
            varData: {
                location: null,
                amount: "",
                lot: ""
            }
        }
    }
}
</script>