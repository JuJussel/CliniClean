<template>
    <cui-card noPadding style="max-height: 100%">
        <cui-tree v-if="treeData.length > 0" :nodes="treeData" @select="openFile">
            <template #title> {{ $lang.files }} </template>
        </cui-tree>
    </cui-card>
</template>

<script>

import { usePatientStore } from '@/stores/patient'
import { mapStores } from 'pinia'

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
            let files = await this.$api.get('files?patient=' + this.patientStore.patientData.id);
            this.files = files;
        },
        openFile(file) {
            console.log('click');
            if(!file.meta) return
            let filename = file.meta.id + '.' + file.meta.extension;
            console.log(filename);
            let url = this.$GLOBALS.filesUrl + filename;
            window.open(
                url,
                "_blank",
                "resizable=yes, scrollbars=yes, titlebar=yes, width=800, height=900, top=100, left=10"
            );
        }
    },
    computed: {
        ...mapStores(usePatientStore),
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
                        tree[index].children[index2].children.push({ name: name, meta: item })
                    } else {
                        tree[index].children = [{ name: this.$lang[source], children: [{ name: name, meta: item  }] }]                        
                    }
                }


            });

            return tree;
        },
    },
};
</script>