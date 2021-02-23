<template>
    <div style="width: 100%">
        <div v-if="koui.type === '60'" style="margin-top: 10px">
            <vs-row v-for="(tr, index) in koui.var.results" :key="index" style="padding: 10px">
                <vs-col w="8" style="padding: 5px"> {{ tr.name }} </vs-col>
                <vs-col w="4">
                    <vs-input readonly icon-after state="dark" v-model="tr.value" placeholder="値">
                        <template #icon v-if="tr.unit !=='' && tr.unit !== '　'">
                            {{ tr.unit }}
                        </template>
                    </vs-input>
                </vs-col>
            </vs-row>
        </div>
        <!-- Shot Prev -->
        <div v-else-if="koui.type === '30' || koui.type === '31'">
            <vs-row style="margin-top: 10px">
                <vs-col w="4">
                    <vs-input v-model="koui.var.location" icon-after label="位置選択" readonly>
                    </vs-input>
                </vs-col>
                <vs-col w="4">
                    <vs-input v-model="koui.var.amount" icon-after label="接種量" type="number" readonly>
                        <template #icon>ml</template>
                    </vs-input>
                </vs-col>
                <vs-col w="4">
                    <vs-input v-model="koui.var.lotNo" label="LotNo" readonly>
                    </vs-input>
                </vs-col>
            </vs-row>
        </div>
        <!-- Common -->
        <div>
            <vs-textarea v-if="koui.comment.content !== ''" v-model="koui.comment.content" placeholder="コメント" readonly></vs-textarea>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'koui'
    ]
}
</script>
