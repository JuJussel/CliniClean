<template>
    <div style="position: relative">
        <vs-input
            :label="label"
            v-model="value"
            :loading="loading"
            @input="search"
            @focus="focused = true"
            @blur="blur"
            :placeholder="placeholder"
            class="si-dummy"
            v-bind:class="{ 'si-focused': showSelect, 'si-table': table, 'si-dark': dark }"
        >
            <template #icon><i :class="icon" v-if="icon"></i></template>
        </vs-input>
        <div class="vs-select__options vs-component--primary si-content" v-if="showSelect" v-bind:class="{ 'si-table': table}">
            <div class="vs-select__options__content">
                <button v-for="item in results" :key="item.id" class="vs-select__option" @click="selectItem(item)">
                    <slot :item="item"> {{ item }} </slot>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        placeholder: { default: ''},
        label: { default: false },
        results: { default: [] },
        valueLabel: {default: 'name'},
        dark: {default: false, type: Boolean},
        icon: {default: null},
        table: {default: false, type: Boolean}
    },
    data () {
        return {
            value: '',
            loading: false,
            focused: false
        }
    },
    methods: {
        search (d) {
            this.loading = true
            this.$emit('change', d)
        },
        selectItem (d) {
            this.value = d[this.valueLabel] //Only works with objects for now. Add if needed
            this.$emit('select', d)
        },
        blur () {
            let that = this
            setTimeout ( function () { that.focused = false }, 240)
        }
    },
    computed: {
        showSelect () {
            return this.results.length > 0 && this.focused
        },
        parent () {
            return document.documentElement.parentNode.className
        }
    },
    watch: {
        results () {
            this.loading = false
        }
    }
}
</script>

<style>
 .si-content {
    margin-top: -30px;
    margin-left: 20px;
    width: calc(100% - 40px)
 }
 .si-content.si-table {
    margin-top: -8px;
    width: 100%;
    margin-left: 0
 }
 .si-focused .vs-input {
     background-color: white!important;
     background: white!important;
     box-shadow: 0px 5px 25px -4px rgba(0, 0, 0, var(--vs-shadow-opacity))
 }
 .si-dummy .vs-input__icon {
     background: #ccd3d7
 }
 .si-focused .vs-input__icon {
     z-index: 100000
 }
 .si-dark .vs-input{
     background: rgba(var(--vs-dark), 0.1);
 }
 .si-dark .vs-input:focus {
     background: rgba(var(--vs-dark), 0.1)
 }
</style>