<template>
    <div class="cc-reception-main-cont">
        <cui-card>
            1
        </cui-card>
        <cui-card>
            2
        </cui-card>
        <cui-card>
            3
        </cui-card>
        <cui-card>
            4
        </cui-card>

    </div>
</template>

<script>
export default {
    name: "Reception Main"
}
</script>

<style scoped>
    .cc-reception-main-cont {
        display: grid;
        grid-template-columns: 50% 25% auto;
        grid-template-rows: 30% 70%;
    }
</style>