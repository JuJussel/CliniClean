<template>
    <div>
        Data Explorer
        <div>
            <vue-echarts></vue-echarts>
        </div>
    </div>
</template>

<script>

import { VueEcharts } from 'vue3-echarts'; 

export default {
    components: {
        VueEcharts,
    }
}
</script>