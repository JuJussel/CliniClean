<template>
    <div style="height: 100%">
        <cui-table :data="examsList" style="max-height:610px">
            <template #header>
                <h2> {{ $lang.exam }} </h2>
            </template>
            <template #thead>
                <cui-th class="vital-row-header-scoped" style="z-index: 5!important"></cui-th>
                <cui-th
                    v-for="(item, index) in exams" 
                    :key="index"
                    style="min-width: 150px"
                >
                {{ parseDate(item.date) }}
                </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td class="vital-row-header-scoped"> 
                    {{ row.label }} 
                </td>
                <td
                    v-for="(item, index) in exams" 
                    :key="index"
                >
                    {{ parseValue(item, row) }}
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
        parseDate(date) {
            return this.$dayjs(date).format(
                'YYYY' + this.$lang.dateLocals.yearSeparator +
                'MM' + this.$lang.dateLocals.monthSeparator +
                'DD' + this.$lang.dateLocals.daySeparator
            )
        },
        parseValue(results, row) {
            
            let match = results.data.find(res => {
                let name = res.result.shared.name === '分析物固有結果コード'? res.result.single.name : res.result.shared.name;
                return name === row.label
            })
            return(match?.value || null)
        }
    },
    computed: {
        exams() {
            let examResults = [];
            this.patientData.encounters.forEach(enc => {
                let procedures =  enc.karte?.procedures || null;
                if(!procedures) return;
                let exams = procedures.filter(proc => proc.cat?.code === 60);
                if(exams.length < 1) return;
                exams.forEach(exm => {
                    let varData = exm.varData || [];
                    exm = varData.map(varD => {
                        varD.encounter = enc.id,
                        varD.date = enc.date
                        return varD
                    });
                    let dateObject = {
                        date: enc.date,
                        data: exm
                    };
                    examResults = examResults.concat(dateObject)
                });

            })
            return examResults
        },
        examsList() {
            let examList = [];
            this.exams.forEach(exm => {
                exm.data.forEach(dat => {
                    let resultName = dat.result.shared.name === '分析物固有結果コード'? dat.result.single.name : dat.result.shared.name;
                    let examObject = {
                        label: resultName,
                        exam: dat.item
                    }
                    if (examList.findIndex(i => i.label === examObject.label) === -1) examList.push(examObject);

                })
            });
            return examList
        }
    }

}
</script>