<template>
    <div>
        <cui-table>
            <template #header>
                <h2> {{ $lang.vitals }} </h2>
                <cui-button icon="fas fa-plus" :label="$lang.register" />    
            </template>    
        </cui-table>    
    </div>
</template>

<script>
export default {
    
}
</script>