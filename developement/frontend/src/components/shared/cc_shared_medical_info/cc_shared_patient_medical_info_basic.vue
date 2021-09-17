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
        <cui-table style="grid-column-end: span 2"></cui-table>
    <cui-modal :visible="modals.basic.visible" closable @close="modals.basic.visible = false">
        <cui-card style="width: 250px; height: auto" >
            <template #header> {{ $lang.basic }} </template>
            <div class="cc-scoped-modal-cont">
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
                <cui-input :label="$lang.alcohol" v-model="modals.basic.data.alcohol" append="f" />
                <cui-input :label="$lang.tabaco" v-model="modals.basic.data.tabaco" append="f" />
            </div>
            <template #footer>
                <cui-button
                    :label="$lang.cancel"
                    @click="$emit('close')"
                    plain
                />
                <cui-button
                    :label="$lang.register"
                    primary
                    :disabled="!inputOK"
                    @click="registerWalkin"
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
    data() {
        return {
            modals: {
                basic: {
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
                bloodType: '',
                alcohol: '',
                tabaco: ''
            };
            this.modals.basic.visible = true;
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
    .cc-scoped-modal-cont {
    }
</style>