<template>
    <div>
        <h2>
            {{ order}}
        </h2>
    </div>
</template>

<script>
export default {
    props: {
        order: {
            default: null
        }
    }
}
</script>