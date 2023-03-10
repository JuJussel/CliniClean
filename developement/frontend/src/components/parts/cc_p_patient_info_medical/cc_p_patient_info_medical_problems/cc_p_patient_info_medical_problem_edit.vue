<template>
    <div style="position: relative">
        <div v-if="loading" class="loader"></div>
        <div>
            <cui-input :label="$lang.title" v-model="problemData.name"></cui-input>
            <cui-textarea :label="$lang.note" v-model="problemData.note" />
        </div>
        <div style="display: flex; justify-content: flex-end">
            <cui-button :disabled="loading" plain :label="$lang.cancel" @click="$emit('close')"></cui-button>
            <cui-button :disabled="problemData.name === ''" :loading="loading" primary :label="$lang.save" @click="save()"></cui-button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        problem: {
            default: null,
            type: Object
        }
    },
    emits: ['update', 'close'],
    data() {
        return {
            problemData: {
                name: "",
                note: ""
            },
            loading: false
        }
    },
    methods: {
        save() {
            this.loading = true
            this.$emit('update', this.problemData)
        }
    },
    created() {
        if (this.problem)
            Object.assign(this.problemData, this.problem)
    },
}
</script>