<template>
    <div class="cc-scoped-wrapper">
        <cui-table :data="basicTable">
            <template #header>
                <h2> {{ this.patientData.name }} </h2>
                <cui-button icon="fas fa-external-link-alt" plain />
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.label }} </td>
                <td> {{ row.value }} </td>
            </template>
        </cui-table>
        <cui-table :data="medicalTable">
            <template #header>
                <h2> {{ $lang.basic }} </h2>
                <cui-button icon="fas fa-edit" plain @click="showBasicModal" />
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.label }} </td>
                <td> {{ row.value }} </td>
            </template>
        </cui-table>
        <cui-table style="grid-column-end: span 2">
            <template #header>
                <h2> {{ $lang.note }} </h2>
            </template>
        </cui-table>
    <cui-modal :visible="modals.basic.visible" :closable="!modals.basic.loading" @close="modals.basic.visible = false">
        <cui-card style="width: 250px; height: auto; position: relative">
            <template #header> {{ $lang.basic }} </template>
            <div style="position: relative">
                <div class="loader" v-if="modals.basic.loading"/>
                {{ $lang.bloodType }}
                <div style="display: flex; justify-content: space-between; width: 100%">
                    <div>
                        <cui-radio
                            v-model="modals.basic.data.bloodType"
                            :label="$lang.unknown"
                            :value="$lang.unknown"
                        />

                    </div>
                    <div>
                        <cui-radio
                            v-model="modals.basic.data.bloodType"
                            v-for="(item, index) in bloodTypes.minus"
                            :key="index"
                            :label="item"
                            :value="item"
                        />
                    </div>
                    <div>
                        <cui-radio
                            v-model="modals.basic.data.bloodType"
                            v-for="(item, index) in bloodTypes.plus"
                            :key="index"
                            :label="item"
                            :value="item"
                        />
                    </div>
                </div>
                <cui-input :label="$lang.alcohol" v-model="modals.basic.data.alcohol" :append="$lang.countCup" />
                <cui-input :label="$lang.tabaco" v-model="modals.basic.data.tabaco" :append="$lang.countStick" />
            </div>
            <template #footer>
                    <cui-button
                        :label="$lang.cancel"
                        @click="this.modals.basic.visible = false"
                        plain
                        :loading="modals.basic.loading"
                    />
                    <cui-button
                        :label="$lang.register"
                        primary
                        @click="updateBasic"
                        :loading="modals.basic.loading"
                    />
            </template>
        </cui-card>

    </cui-modal>
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
    data() {
        return {
            modals: {
                basic: {
                    loading: false,
                    visible: false
                }
            },
            bloodTypes: {
                minus: [
                    '0-',
                    'A-',
                    'B-',
                    'AB-'
                ],
                plus: [
                    '0+',
                    'A+',
                    'B+',
                    'AB+'
                ]
            }
            
            

        }
    },
    computed: {
        basicTable() {
            return [
                {label: this.$lang.id, value: this.patientData.id},
                {label: this.$lang.age, value: this.$dayjs().diff(this.patientData.birthdate, 'year')},
                {label: this.$lang.gender, value: this.patientData.gender == 1 ? this.$lang.male : this.$lang.female},

            ]
        },
        medicalTable() {
            return [
                {label: this.$lang.bloodType, value: this.patientData.bloodType || this.$lang.unknown},
                {label: this.$lang.alcohol, value: this.patientData.alcohol || this.$lang.unknown},
                {label: this.$lang.tabaco, value: this.patientData.tabaco || this.$lang.unknown}
            ]
        }
    },
    methods: {
        showBasicModal() {
            this.modals.basic.data = {
                bloodType: JSON.parse(JSON.stringify(this.patientData.bloodType || '不明')),
                alcohol: JSON.parse(JSON.stringify(this.patientData.alcohol || '')),
                tabaco: JSON.parse(JSON.stringify(this.patientData.tabaco || ''))
            };
            this.modals.basic.visible = true;
        },
        async updateBasic() {
            this.modals.basic.loading = true;
            const sendData = {
                data: this.modals.basic.data,
                patientId: this.patientData.id
            }
            await this.$dataService().put.medical.basics(sendData);
            this.modals.basic.loading = false;
            this.modals.basic.visible = false;
            this.$emit('update');
        }
    }
}
</script>

<style scoped>
    .cc-scoped-wrapper {
        display: grid;
        grid-template-columns: calc(50% - 10px) auto;
        grid-template-rows: 210px auto;
        gap: 20px;
    }
</style>