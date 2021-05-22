<template>
    <div>
        <cui-input />

        <cui-select />

        cui-input
    </div>
</template>

<script>
export default {
    created() {
        if (this.$state.transferData.reception) {
            this.walkin = this.$state.transferData.reception
        }
    },
    data() {
        return {
            searchResults: [],
            walkin: {
                patient: {
                },
                insurance: {

                },
                encouterType: 1,
                note: ''
            }
        }
    }
}
</script>