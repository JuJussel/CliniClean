<template>
    <div style="position: relative">
        <div v-if="loading" class="loader"></div>
        <div style="display: grid; grid-template-columns: 360px auto; grid-gap: 20px">
            <div style="overflow: auto;">
                <cui-radio :label="$lang.other" value="other" v-model="template"></cui-radio>
                <cui-input :disabled="template !== 'other'" :label="$lang.title" v-model="problemData.name"></cui-input>
                <div style="display: grid; grid-template-columns: 50% auto; gap: 10px">
                    <cui-datepicker v-model="problemData.start" :label="$lang.startDate"></cui-datepicker>
                    <cui-datepicker v-model="problemData.end" :label="$lang.endDate"></cui-datepicker>
                </div>
                <cui-textarea cols="40" :label="$lang.note" v-model="problemData.note" />

            </div>

            <div>
                <div style="display: flex; flex-wrap: wrap">
                        <cui-radio 
                            v-for="item in listStore.listData.problemTemplates" 
                            :key="item.name" 
                            :label="$lang.problemLabels[item]"
                            style="width: 150px"
                            :value="item"
                            v-model="template"
                            >
                        </cui-radio>
                </div>
            </div>
        </div>
        <div style="display: flex; justify-content: flex-end">
            <cui-button :disabled="loading" plain :label="$lang.cancel" @click="$emit('close')"></cui-button>
            <cui-button :disabled="problemData.name === '' && template === 'other'" :loading="loading" primary :label="$lang.save" @click="save()"></cui-button>
        </div>
    </div>
</template>

<script>

import { useListStore } from '@/stores/list'
import { mapStores } from 'pinia'

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
                start: "",
                end: "",
                edited: this.$dayjs(),
                note: ""
            },
            template: "other",
            loading: false
        }
    },
    methods: {
        save() {
            this.loading = true
            if (this.template !== 'other') {
                this.problemData.name = this.$lang.problemLabels[this.template]
            }
            this.$emit('update', this.problemData)
        }
    },
    created() {
        if (this.problem)
            Object.assign(this.problemData, this.problem)
    },
    computed: {
        ...mapStores(useListStore)
    }
}
</script>