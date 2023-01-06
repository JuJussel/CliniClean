<template>
    <div>
        <cui-input :label="$lang.allergyItem" v-model="localData.name"></cui-input>
            <div style="display: flex; justify-content: space-between; width: 200px">
                <cui-radio label="low" :value="1" v-model="localData.level" />
                <cui-radio label="med" :value="2" v-model="localData.level" />
                <cui-radio label="high" :value="3" v-model="localData.level" />
            </div>
        <cui-textarea :label="$lang.note" v-model="localData.note" />
    </div>
</template>

<script>

export default {
    data() {
        return {
            localData: {
                name: "",
                level: 1,
                note: ""
            }
        }
    },
    created() {
        if (this.$store.getters.layoutData.medical.allergyEditor?.data) {
            Object.assign(this.localData, this.$store.getters.layoutData.medical.allergyEditor.data)
        }
    },
    watch: {
        localData() {
            // let storeData = this.$store.getters.layoutData.medical.allergyEditor
            // storeData.data = this.localData
            console.log(this.localData);
            // this.$store.commit('SET_LAYOUT_DATA', ['medical', {allegryEditor: storeData}])
        }
    }
}
</script>