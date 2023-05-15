<template>
    <div style="position: relative">
        <div v-if="loading" class="loader"></div>
        <div>
            <cui-input :label="$lang.allergyItem" v-model="allergyData.name"></cui-input>
                <div style="display: flex; justify-content: space-between; width: 200px">
                    <cui-radio :label="$lang.allergySevrenity.light" :value="$lang.allergySevrenity.light" v-model="allergyData.level" />
                    <cui-radio :label="$lang.allergySevrenity.medium" :value="$lang.allergySevrenity.medium" v-model="allergyData.level" />
                    <cui-radio :label="$lang.allergySevrenity.high" :value="$lang.allergySevrenity.high" v-model="allergyData.level" />
                </div>
            <div style="display: grid; grid-template-columns: 50% auto; gap: 10px">
                <cui-datepicker v-model="allergyData.start" :label="$lang.startDate"></cui-datepicker>
                <cui-datepicker v-model="allergyData.end" :label="$lang.endDate"></cui-datepicker>
            </div>
            <cui-textarea :label="$lang.reaction" v-model="allergyData.reaction" />
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
                level: this.$lang.allergySevrenity.light,
                start: "",
                end: "",
                edited: this.$dayjs(),
                note: "",
                reaction: ""
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