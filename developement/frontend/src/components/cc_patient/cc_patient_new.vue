<template>
    <div class="cc-patient-new-main">
        <cui-card>
            <template #header>
                <h2> 基本 </h2>
            </template>
            <div class="cc-patient-new-form">
                <cui-input label="名前"></cui-input>
            </div>
        </cui-card>
        <cui-card></cui-card>
                <cui-card></cui-card>
        <cui-card></cui-card>
        <cui-card></cui-card>
        <cui-card></cui-card>

    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
    .cc-patient-new-main {
        height: 100%;
        display: grid;
        grid-template-rows: 50% 50%;
        grid-template-columns: 30% 30% 40%;
    }
</style>