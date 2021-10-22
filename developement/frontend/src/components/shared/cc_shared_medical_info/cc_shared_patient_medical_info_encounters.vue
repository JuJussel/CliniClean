<template>
    <div style="height: 100%">
        <cui-table :data="patientData.encounters" >
            <template #header>
                <h2> {{ $lang.karte }} {{ $lang.valid }} </h2>
            </template>
            <template #thead>
                <cui-th> {{ $lang.date }} </cui-th>
                <cui-th> {{ $lang.encounterType  }} </cui-th>
                <cui-th 
                    v-for="(item,index) in procedureCategories"
                    :key="index"
                    style="width: 35px"
                > 
                    {{ $lang.procedureCategoryLabels[item.label] }} 
                </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ $parseDate(row.date) }} </td>
                <td> {{ parseType(row.type) }} </td>
                <td 
                    v-for="(item,index) in procedureCategories"
                    :key="index"
                    style="width: 35px; text-align: center"
                > 
                    <i v-if="hasType(row, item)" :class="hasType(row, item)?.cat?.icon"></i>
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
    methods: {
        parseType(type) {
            return this.$store.getters.encounterTypes.find(item => item.id === type).name;
        },
        hasType(row, type) {
            if(!row.karte?.procedures) return false;
            let has = row.karte.procedures.find(item => item.cat.code === type.code);
            return has;
        }
    },
    computed: {
        procedureCategories() {
            return this.$store.getters.config.procedureCategories.filter(item => item.orcaCode);
        }
    }

}
</script>