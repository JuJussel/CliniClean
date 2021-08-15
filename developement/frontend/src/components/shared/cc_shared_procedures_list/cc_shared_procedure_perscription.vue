<template>
    <div style="display: flex">
        <cui-select 
            :data="types"
            displayValueProp="name"
            v-model="varData.type"
            :label="$lang.perscriptionType"
            @update:modelValue="updateValue"
        />
        <cui-select 
            :data="filteredTimings"
            displayValueProp="name"
            v-model="varData.timing"
            :label="$lang.perscriptionTiming" 
            style="margin-left: 30px; width: 150px"
            @update:modelValue="updateValue"
        />
        <cui-input 
            :append="item?.taniname" 
            v-model="varData.amount"
            :label="$lang.perscriptionAmount" 
            style="margin-left: 30px; width: 80px"
            :disabled="!varData.type || !varData.timing"
            @update:modelValue="updateValue"
        />
        <cui-input 
            :append="varData.timing?.unit" 
            v-model="varData.lot"
            :label="$lang.perscriptionDuration" 
            style="margin-left: 30px; width: 80px"
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
            },
            timer: null
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
            if(this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(function() {
                console.log('timer');
                this.$emit('update', JSON.parse(JSON.stringify(this.varData)))
            }.bind(this), 1000)
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