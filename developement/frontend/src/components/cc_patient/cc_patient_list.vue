<template>
    <div class="cc-patient-list-main-cont">
        <cui-card>
            <cui-table :data="patientList" style="margin: -10px">
                <template #header>
                    <div style="display: flex; align-items: center">
                        <h2>{{ $lang.reception }}</h2>
                        <cui-input noNote></cui-input>
                    </div>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.name }} </cui-th>
                    <cui-th> {{ $lang.status }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ row.name }} </td>
                    <td> 
                        <cui-tag
                            :danger="row.status === 2"
                            :primary="row.status === 1"
                        >
                            {{ docStati[row.status] }}
                        </cui-tag>
                    </td>
                </template>
            </cui-table>

        </cui-card>
        <cui-card>B</cui-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            patientList: []
        }
    }
}
</script>

<style scoped>
    .cc-patient-list-main-cont {
        height: 100%;
        display: flex
    }
</style>