<template>
    <span>
        {{ dispDate }}
    </span>
</template>

<script>
    export default {
        computed: {
            dispDate() {
            return(this.$moment(this.date).format("YYYY年M月D日"));
            }
        },
        props: [
            'date'
        ]
    }
</script>