<template>
    <div>
        <cui-input :label="$lang.allergyItem" v-model="allergyData.name"></cui-input>
            <div style="display: flex; justify-content: space-between; width: 200px">
                <cui-radio label="low" :value="1" v-model="allergyData.level" />
                <cui-radio label="med" :value="2" v-model="allergyData.level" />
                <cui-radio label="high" :value="3" v-model="allergyData.level" />
            </div>
        <cui-textarea :label="$lang.note" v-model="allergyData.note" />
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
    emits: ['loading', 'update'],
    data() {
        return {
            allergyData: {
                name: "",
                level: 1,
                note: ""
            }
        }
    },
    created() {
        if (this.allergy)
            Object.assign(this.allergyData, this.allergy)
    },
}
</script>