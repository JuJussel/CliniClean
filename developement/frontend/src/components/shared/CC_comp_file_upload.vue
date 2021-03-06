<template>
    <div ref="uploadCont">      
        <fileSelect @change="updateFiles"></fileSelect>
        <vs-input label="説明" v-model="description"></vs-input>
        <div class="cc-dialog-footer">
            <vs-button @click="$emit('close')" transparent dark>キャンセル</vs-button>
            <vs-button @click="submit()" :disabled="files.length < 1">追加</vs-button>
        </div>
   </div>
</template>

<script>

import fileSelect from "../shared/CC_comp_file_select";

export default {
    props: {
        patient: {default: null}
    },
    components: {
        fileSelect: fileSelect,
    },
    data() {
        return {
            files: [],
            description: ''
        }
    },
    methods: {
        submit() {
            if (this.files.length > 0) {
                const isLoading = this.$vs.loading({
                    target: this.$refs.uploadCont,
                    color: 'dark'
                })
                let sendData  = {
                    fileList: [],
                    hasFiles: true,
                    fileMeta: {
                        fileInfo: [],
                        info: this.patient,
                        type: 3
                    }
                }
                this.files.forEach(file => {
                    sendData.fileList.push(file.data)
                    sendData.fileMeta.fileInfo.push(this.description)
                })

                this.$post('files', sendData)
                .then(result => {
                    isLoading.close()
                    this.$emit('uploaded')
                    this.$emit('close')
                })
                .catch(result => {
                    this.$apiError(result)
                    isLoading.close()
                })
            }
        },
        updateFiles(files) {
            this.files = files
        }
    }
}
</script>