<template>
    <div style="display: flex; flex-wrap: wrap">
        <cui-select 
            :data="types"
            displayValueProp="name"
            v-model="varData.type"
            :label="$lang.perscriptionType"
            style="margin-right: 30px"
            @update:modelValue="updateValue"
        />
        <cui-select 
            :data="filteredTimings"
            displayValueProp="name"
            v-model="varData.timing"
            :label="$lang.perscriptionTiming" 
            style="margin-right: 30px; width: 150px"
            @update:modelValue="updateValue"
        />
        <cui-input 
            :append="item?.taniname" 
            v-model="varData.amount"
            :label="$lang.perscriptionAmount" 
            style="margin-right: 30px; width: 80px"
            :disabled="!varData.type || !varData.timing"
            @update:modelValue="updateValue"
        />
        <cui-input 
            :append="varData.timing?.unit" 
            v-model="varData.lot"
            :label="$lang.perscriptionDuration" 
            style="width: 80px"
            :disabled="!varData.type || !varData.timing"
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
    emits: ['update'],
    created() {
        this.getTypes();
        this.getTimings();
        this.setData()
    },
    data() {
        return {
            types: [],
            timings: [],
            varData: {
                type: null,
                timing: null,
                amount: null,
                duration: null
            }
        }
    },
    methods: {
        async getTypes() {
            this.types = await this.$dataService().get.lists.perscriptionTypes();
        },
        async getTimings() {
            this.timings = await this.$dataService().get.lists.perscriptionTimings();
        },
        updateValue() {
            this.$emit('update', this.varData);
        },
        setData() {
            if (this.item.varData) {
                this.varData = this.item.varData
            }
        }
    },
    computed: {
        filteredTimings() {
            if(this.varData.type?.code) {
                return this.timings.filter(item => item.typeCode === this.varData.type.code)
            } else {
                return []
            }
        }
    }
}
</script>