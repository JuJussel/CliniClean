<template>
    <div style="height: 100%">
        <cui-table :data="persc" style="max-height:610px">
            <template #header>
                <h2> {{ $lang.procedureCategoryLabels.perscription }} </h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.perscriptionType }} </cui-th>
                <cui-th> {{ $lang.perscriptionName }} </cui-th>
                <cui-th> {{ $lang.perscriptionName }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ $parseDate(row.date) }} </td>
                <td> {{ row.varData.type.name }} </td>
                <td> {{ row.name }} </td>
                <td> 
                    {{ row.varData.timing.name }} 
                    {{ row.varData.amount + row.taniname }} 
                    {{ row.varData.duration + row.varData.timing.unit }} 
                </td>
            </template>
        </cui-table>    
    </div>
</template>

<script>
export default {
    props: {
        patientData: {
            default: null
        }
    },
    emits: [
        'update'
    ],
    computed: {
        persc() {
            let perscriptions = [];
            this.patientData.encounters.forEach(enc => {
                let procedures =  enc.karte?.procedures || null;
                if(!procedures) return;
                procedures = procedures.filter(proc => proc.cat?.code === 25)
                procedures = procedures.map(item => {
                    item.encounter = enc.id;
                    item.date = enc.date;
                    return item;
                })
                perscriptions = perscriptions.concat(procedures);

            })
            return perscriptions
        }
    }

}
</script>