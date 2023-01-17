<template>
    <div style="position: relative">
        <div v-if="loading" class="loader"></div>
        <div>
            <cui-input :label="$lang.allergyItem" v-model="allergyData.name"></cui-input>
                <div style="display: flex; justify-content: space-between; width: 200px">
                    <cui-radio label="low" :value="1" v-model="allergyData.level" />
                    <cui-radio label="med" :value="2" v-model="allergyData.level" />
                    <cui-radio label="high" :value="3" v-model="allergyData.level" />
                </div>
            <cui-textarea :label="$lang.note" v-model="allergyData.note" />
        </div>
        <div style="display: flex; justify-content: flex-end">
            <cui-button :disabled="loading" plain :label="$lang.cancel" @click="$emit('close')"></cui-button>
            <cui-button :disabled="allergyData.name === ''" :loading="loading" primary :label="$lang.save" @click="save()"></cui-button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        allergy: {
            default: null,
            type: Object
        }
    },
    emits: ['update', 'close'],
    data() {
        return {
            allergyData: {
                name: "",
                level: 1,
                note: ""
            },
            loading: false
        }
    },
    methods: {
        save() {
            this.loading = true
            this.$emit('update', this.allergyData)
        }
    },
    created() {
        if (this.allergy)
            Object.assign(this.allergyData, this.allergy)
    },
}
</script>