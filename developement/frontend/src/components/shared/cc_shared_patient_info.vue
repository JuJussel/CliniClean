<template>
        <div>
            <cui-table :data="patient" square>
                <template #header>
                    <h2>基本</h2>
                </template>
                <template v-slot:row="row">
                    <td> {{row.label}} </td>
                    <td>{{ row.value }}</td>
                </template>
            </cui-table>
            <cui-table :data="patient" square>
                <template #header>
                    <h2>保険</h2>
                </template>
                <template v-slot:row="row">
                    <td> {{row.label}} </td>
                    <td>{{ row.value }}</td>
                </template>
            </cui-table>

        </div>
</template>

<script>
export default {
    props: {
        patientId: {
            default: null,
            type: Number
        }
    },
    data() {
        return {
            test: "Hello",
            patient: [
                {label: '名前', value: '渡辺春子'},
                {label: '生年月日', value: '1998年1月12日'},
                {label: '性別', value: '女性'},
                {label: '住所', value: '142-0063品川区荏原'},
                {label: '電話番号', value: '08044938473'},

            ]
        }
    }
    
}
</script>