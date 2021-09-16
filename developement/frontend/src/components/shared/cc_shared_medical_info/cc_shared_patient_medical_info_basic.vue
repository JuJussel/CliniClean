<template>
    <div class="cc-scoped-wrapper">
        <cui-table :data="basicTable">
            <template v-slot:row="{ row }">
                <td> {{ row.label }} </td>
                <td> {{ row.value }} </td>
            </template>
        </cui-table>
        <cui-table></cui-table>
        <cui-table style="grid-column-end: span 2"></cui-table>
    </div>
</template>

<script>
export default {
    props: {
        patientData: {
            default: null
        }
    },
    computed: {
        basicTable() {
            return [
                {label: this.$lang.id, value: this.patientData.id},
                {label: this.$lang.name, value: this.patientData.name},
                {label: this.$lang.age, value: this.$dayjs().diff(this.patientData.birthdate, 'year')},
                {label: this.$lang.gender, value: this.patientData.gender == 1 ? this.$lang.male : this.$lang.female},

            ]
        }
    }
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