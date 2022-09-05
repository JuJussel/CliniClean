<template>
    <div style="height: 100%">
        <cui-table :data="procedures" style="max-height:610px">
            <template #header>
                <h2> {{ $lang.procedursOnly }} </h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th></cui-th>
                <cui-th> {{ $lang.procedureName }} </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ $parseDate(row.date) }} </td>
                <td> 
                    <i :class="row.cat.icon" />
                    {{ $lang.procedureCategoryLabels[row.cat.label] }} 
                </td>
                <td> {{ row.name }} </td>
            </template>
        </cui-table>    
    </div>
</template>

<script>
export default {
    computed: {
        patientData() {
            return this.$store.getters.layoutData.medical.patient
        },
        procedures() {
            let proceduresList = [];
            this.patientData.encounters.forEach(enc => {
                let procedures =  enc.karte?.procedures || null;
                if(!procedures) return;
                procedures = procedures.filter(proc => proc.cat?.code !== 25)
                procedures = procedures.map(item => {
                    item.encounter = enc.id;
                    item.date = enc.date;
                    return item;
                })
                proceduresList = proceduresList.concat(procedures);

            })
            return proceduresList
        }
    }

}
</script>