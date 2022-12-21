<template>
    <cui-card noPadding style="max-height: 100%">
        <cui-tree v-if="treeData.length > 0" :nodes="treeData">
            <template #title> {{ $lang.files }} </template>
        </cui-tree>
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
        openFile(file) {
            console.log(file);
            return
            let url = this.$GLOBALS.filesUrl + file.id + "." + file.extension;
            window.open(
                url,
                "_blank",
                "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10"
            );
        }
    },
    computed: {
        treeData() {
            let tree = [];
            this.files.forEach((item) => {
                let type = item.type.split("/")[0];
                let index = tree.findIndex((i) => i.type === type);
                if (index < 0) {
                    tree.push({ name: this.$lang[type], type: type });
                    index = 0
                }
                if (type === "image") {
                    let source = item.meta.source
                    let name = item.meta.symbol ? item.meta.symbol + "-" + item.meta.number : this.$parseDate(item.date) || item.id
                    if (tree[index].children) {
                        let index2 = tree[index].children.findIndex((i) => i.name === source);
                        if (index2 < 0) {
                            tree[index]?.children.push({ type: source, name: this.$lang[source], children: [] });
                            index2 = tree[index].children.length - 1
                        }
                        console.log(JSON.stringify(tree[index].children[index2]));
                        tree[index].children[index2].children.push({ name: name})
                    } else {
                        tree[index].children = [{ name: this.$lang[source], children: [{ name: name }] }]                        
                    }
                }


            });

            return tree;
        },
    },
};
</script>