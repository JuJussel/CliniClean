<template>
    <div>
        <cui-input :label="$lang.allergyItem"></cui-input>
            <div style="display: flex; justify-content: space-between; width: 200px">
                <cui-radio label="low" :value="1" v-model="editModal.data.level" />
                <cui-radio label="med" :value="2" v-model="editModal.data.level" />
                <cui-radio label="high" :value="3" v-model="editModal.data.level" />
            </div>
        <cui-textarea :label="$lang.note"></cui-textarea>
    </div>
</template>

<script>

export default {
    data() {
        return {
            editModal: {
                visible: false,
                loading: false,
                editData: null,
                data: null,
                baseData: {
                    name: "",
                    level: 1
                }
            }
        }
    }
}
</script>