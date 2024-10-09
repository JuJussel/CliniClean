<template>
    <div text class="menu-item" :class="{ 'is-active': isActive ? isActive() : null }" @click="action" :title="title">
        <i :class="icon"></i>
    </div>
</template>

<script setup>

const props = defineProps({
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
    }
})

</script>
<!-- --text-color -->
<style scoped>
.menu-item {
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px;
    width: 26px;
    color: #64748b;
}

.menu-item.is-active {
    color: var(--p-primary-color)
}

.menu-item:hover {
    color: #334155
}
</style>
