<template>
    <button class="menu-item" :class="{ 'is-active': isActive ? isActive() : null }" @click="action" :title="title">
        <i :class="icon"></i>
    </button>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        action: {
            type: Function,
            required: true,
        },
        isActive: {
            type: Function,
            default: null,
        },
    },
}
</script>

<style scoped>
.menu-item {
    width: 1.75rem;
    height: 1.75rem;
    color: var(--cui-font-color);
    border: none;
    background-color: transparent;
    border-radius: 0.4rem;
    padding: 0.25rem;
    margin-right: 0.25rem;
    cursor: pointer
}

.menu-item.is-active,
.menu-item:hover {
    color: #FFF;
    background-color: var(--p-primary-color);
}
</style>
