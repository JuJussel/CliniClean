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
            v-model="varData.duration"
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
        // this.setData()
    },
    data() {
        return {
            ready: false,
            types: this.$store.getters.config.perscriptionTypes,
            timings: this.$store.getters.config.perscriptionTimings,
            varData: {
                type: this.item?.varData?.type ? this.item.varData.type : null,
                timing: this.item?.varData?.timing ? this.item.varData.timing : null,
                amount: this.item?.varData?.amount ? this.item.varData.amount : null,
                duration: this.item?.varData?.duration ? this.item.varData.duration : null,
            }
        }
    },
    methods: {
        updateValue() {
            this.$emit('update', this.varData);
        },
        setData() {
            if (this.item.varData) {
                this.varData = this.item.varData
            }
            this.ready = true;
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