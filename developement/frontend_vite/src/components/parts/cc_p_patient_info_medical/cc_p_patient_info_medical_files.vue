<template>
    <cui-card noPadding style="max-height: 100%">
        <cui-tree></cui-tree>
    </cui-card>
</template>

<script>
export default {
    created() {
        this.getFiles();
    },
    data() {
        return {
            files: [],
        };
    },
    methods: {
        async getFiles() {
            let fileList =
                this.$store.getters.layoutData.medical.patient.files || [];
            let files = await this.$dataService().get.files(fileList);
            this.files = files;
        },
    },
};
</script>