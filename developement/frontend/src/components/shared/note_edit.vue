<template>
    <div v-loading="loading">
        <vs-textarea
            v-model="formData.note"
            placeholder="入力"
            maxlength="190"
            label="メモ"
            ></vs-textarea>
        <div style="display: flex; justify-content: flex-end">
            <vs-button transparent dark @click="$emit('close')">キャンセル</vs-button>
            <vs-button primary @click="save" :disabled="!inputOK">保存</vs-button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        noteData: {
            default: false
        }
    },
    computed: {
        formData() {
            if(this.noteData) {
                Object.assign(this.noteDefaultData, this.noteData)
            }
            return this.noteDefaultData
        },
        inputOK() {
            if (false
            ) {
                return false
            }
            return true
        }
    },
    data() {
        return {
            loading: false,
            noteDefaultData: {
                note: '',
                noteID: null,
                patient_id: this.$store.getters.activePatient,
                encounter_id: this.$store.getters.activeShinsatu
            }
        }
    },
    methods: {
        save() {
            this.loading = true

            if (this.noteData.edit) {
                this.$put('patientnotes/' + this.noteData.id, this.formData)
                .then(result => {
                    this.$emit('confirm')
                    this.$emit('close')
                })
                .catch(result => {
                    this.$apiError(result)
                })                
            } else {
                this.$post('patientnotes', this.formData)
                .then(result => {
                    this.$emit('confirm')
                    this.$emit('close')
                })
                .catch(result => {
                    this.$apiError(result)
                })                

            }


        }
    }
}
</script>