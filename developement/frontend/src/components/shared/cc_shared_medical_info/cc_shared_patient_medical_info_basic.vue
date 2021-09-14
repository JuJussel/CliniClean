<template>
    <div class="cc-scoped-wrapper">
        <cui-table>
            <template #header>
                <h2>Basic</h2>
            </template>
        </cui-table>
        <cui-table></cui-table>
        <cui-table style="grid-column-end: span 2"></cui-table>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
    .cc-scoped-wrapper {
        display: grid;
        grid-template-columns: calc(50% - 10px) auto;
        grid-template-rows: 200px auto;
        gap: 20px;
    }
</style>