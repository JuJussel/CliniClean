<template>
    <div style="height: 100%">
        <cui-table :data="vitalCats" compact>
            <template #header>
                <h2> {{ $lang.vitals }} </h2>
                <cui-button
                    icon="fas fa-plus" 
                    :label="$lang.register"
                    v-if="!isViewer"
                    @click="openVitalRegister"/>    
            </template>
            <template #thead>
                <cui-th class="vital-row-header-scoped" style="z-index: 5!important">
                    <cui-checkbox v-if="isViewer" :label="$lang.showChart" v-model="showChartAll"/>
                </cui-th>
                <cui-th
                    v-for="(item, index) in patientData.vitals" 
                    :key="index"
                    style="min-width: 100px; font-size: 12px"
                >
                {{ $parseDate(item.date) }}
                </cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td class="vital-row-header-scoped"> 
                    <span style="display: flex">
                        <cui-checkbox v-if="isViewer" v-model="row.selectedDisp" :label="$lang.vitalCategories[row.name] + (row.unit || '') " />
                        <span v-else>
                            {{ $lang.vitalCategories[row.name] }}
                            {{ row.unit }}
                        </span>
                    </span>
                </td>
                <td
                    v-for="(item, index) in patientData.vitals" 
                    :key="index"
                     style="border-right: solid 1px var(--cui-gray-2)"
                >
                    {{ returnVitalValue(item.values, row) }}
                </td>
            </template>
        </cui-table>    
    </div>
    <cui-modal :visible="modals.vitalRegister.visible" :closable="!modals.vitalRegister.loading" @close="modals.vitalRegister.visible = false">
        <cui-card style="width: 600px; max-height: 500px; position: relative" v-if="modals.vitalRegister.data">
            <template #header> {{ $lang.vitals }} {{ $lang.register }} </template>
            <div class="vital-cont-scoped">
                <div class="loader" v-if="modals.vitalRegister.loading"/>
                <cui-input 
                    v-for="(item, index) in modals.vitalRegister.data" 
                    :key="index" 
                    :label="$lang.vitalCategories[item.name]"
                    v-model="item.value"
                    :append="item.unit"
                    style="width: 150px; margin-right: 20px"
                />
            </div>
            <template #footer>
                <cui-button
                    :label="$lang.cancel"
                    @click="this.modals.vitalRegister.visible = false"
                    plain
                    :loading="modals.vitalRegister.loading"
                />
                <cui-button
                    :label="$lang.register"
                    primary
                    @click="register"
                    :disabled="!inputPresent"
                    :loading="modals.vitalRegister.loading"
                />
            </template>
        </cui-card>
    </cui-modal>
</template>

<script>
export default {
    props: {
        patientData: {
            default: null,
        },
        isViewer: {
            default: false,
            type: Boolean
        }
    },
    emits: [
        'update',
        'selectChange'
    ],
    data() {
        return {
            showChartAll: false,
            modals: {
                vitalRegister: {
                    visible: false,
                    loading: false,
                    data: null
                }
            },
            vitalCats: []
        }
    },
    created() {
        this.vitalCats = this.$store.getters.staticLists.vitalCategories.map(
                v => ({...v, selectedDisp: false})
            );
    },
    watch: {
        showChartAll() {
            this.vitalCats.forEach((item, index) => {
                this.vitalCats[index].selectedDisp = this.showChartAll
            })
            this.$emit('selectChange', this.vitalCats)
        },
        vitalCats: {
            deep: true,
            handler() {
                if (this.vitalCats) {
                    this.$store.commit('SET_VIEW_DATA', {selectedVitalCats: this.vitalCats})                   
                }
            }
        }

    },
    methods: {
        openVitalRegister() {
            let vitalCatsEdit = this.vitalCats;
            vitalCatsEdit.forEach(item => {
                item.value = "";
            })
            this.modals.vitalRegister.data = vitalCatsEdit;
            this.modals.vitalRegister.visible = true;
        },
        async register() {
            this.modals.vitalRegister.loading = true;
            let vitals = this.modals.vitalRegister.data.filter(item => item.value !== "");
            const sendData = {
                patientId: this.patientData.id,
                values: vitals
            }
            await this.$dataService().post.medical.vitals(sendData);
            this.modals.vitalRegister.loading = false;
            this.modals.vitalRegister.visible = false;
            this.$emit('update');
        },
        returnVitalValue(vitals, row) {
            return vitals.find(item => item.code === row.code)?.value || "";
        }
    },
    computed: {
        inputPresent() {
            if (!this.modals.vitalRegister.data) return false;
            let hasValue = this.modals.vitalRegister.data.filter(item => item.value !== "");
            if (hasValue.length > 0) return true;
            return false;
        }
    }
}
</script>

<style>
    .vital-cont-scoped {
        position: relative;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
    }
    .vital-row-header-scoped {
        min-width: 100px;
        position: sticky;
        left: 0;
        z-index: 3!important;
        background: linear-gradient(90deg, white 0%, white calc(100% - .05em), var(--cui-gray-2) calc(100% - .05em), var(--cui-gray-2) 100%);
    }
</style>