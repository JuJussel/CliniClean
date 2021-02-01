<template>
    <div style="width: 100%; text-align: left; margin: 20px">
        <div style="display:flex">
            <i :class="kouiCats[koui.type].icon" style="margin-right: 10px"></i>
            <span> 
                <div>
                    {{ koui.name }} 
                </div>
                <div v-if="koui.type === '30' || koui.type === '31'">
                    <span> {{ koui.var.location }} </span>
                    <span v-if="koui.var.amount !==''"> {{ koui.var.amount }} ml</span>
                </div>
                <div v-if="koui.type === '25'">
                    <span> {{ medType[koui.var.type] }} </span>
                    <span v-if="koui.var.amount"> {{ koui.var.amount }} </span>
                    <span v-if="koui.var.unit"> {{ koui.var.unit }} </span>
                    <span v-if="koui.var.timing.name"> {{ koui.var.timing.name }} </span>
                    <span v-if="koui.var.times"> {{ koui.var.times }} </span>
                    <span v-if="koui.var.timing.unit"> {{ koui.var.timing.unit }} </span>
                </div>
            </span>
        </div>
        <!-- Common -->
        <div>
            <div v-if="koui.comment.content !== ''" > {{ koui.comment.content }} </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'koui'
    ],
    data() {
        return {
            kouiCats: this.$store.getters.kouiCats,
            medType: {
                '1': '内服',
                '3': '屯服',
                '5': '外用'
            }
        }
    }
}
</script>
