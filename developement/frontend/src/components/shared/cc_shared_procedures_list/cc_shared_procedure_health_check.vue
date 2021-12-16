<template>
    <div>
        <cui-table :data="healthCheckItems" compact square>
            <template v-slot:row="{ row }">
                <td style="width: 200px; color: var(--cui-gray-5)">
                    <span v-if="row[0] === 'exam'">
                        {{ row[1].name }}
                    </span>
                    <span v-else>{{ $lang[row[0]] }}</span>
                </td>
                <td>
                    <div v-if="row[0] === 'exam'">
                        <div v-for="(exam, index) in row[1].varData" :key="index">
                            <span v-if="exam.result.shared.name === '分析物固有結果コード'">{{ exam.result.single.name }}</span>                            
                            <span v-else>{{ exam.result.shared.name }}</span>
                        </div>
                    </div>
                    <div v-else>
                        <span v-if="row[1].value && typeof(row[1].value) === 'boolean'"> {{ $lang.has }} </span>
                        <span v-else-if="row[1].value"> {{ row[1].value }} {{ row[1].unit }} </span>
                        <span v-else> {{ $lang.hasNot }} </span>
                    </div>
                    <div v-if="row[1].schema">
                        <img :src="row[1].schema + '?' + random" style="max-height: 100px">
                    </div>
                    <div v-if="row[1].value && row[1].note">
                        {{ row[1].note }}
                    </div>
                </td>
            </template>
        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            default: null,
        },
        random: {
            default: 1
        }
    },
    emits: ["update"],
    methods: {
        updateValue() {
            this.$emit("update", this.varData);
        },    },
    data() {
        return {
        };
    },
    computed: {
        healthCheckItems() {
            let array =  Object.entries(this.item.varData);
            let exams = this.item.varData.exams;
            let index = array.findIndex(item => item[0] === 'exams');
            array.splice(index, 1);
            console.log(array);
            exams.forEach(item => {
                item = [
                    'exam',
                    item
                ]
                array.push(item);
            });
            return array;
        }
    }
};
</script>