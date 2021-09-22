<template>
    <div>
        <cui-table>
            <template #header>
                <h2> {{ $lang.vitals }} </h2>
                <cui-button icon="fas fa-plus" :label="$lang.register" @click="openVitalRegister"/>    
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
            default: null
        }
    },
    emits: [
        'update'
    ],
    data() {
        return {
            modals: {
                vitalRegister: {
                    visible: false,
                    loading: false,
                    data: null
                }
            }
        }
    },
    methods: {
        openVitalRegister() {
            let vitalCatsEdit = this.$store.getters.config.vitalCategories;
            vitalCatsEdit.forEach(item => {
                item.value = "";
            })
            this.modals.vitalRegister.data = vitalCatsEdit;
            this.modals.vitalRegister.visible = true;
        },
        async register() {
            this.modals.vitalRegister.loading = true;
            const sendData = {
                patientId: this.patientData.id,
                data: this.modals.vitalRegister.data
            }
            await this.$dataService().post.medical.vitals(sendData);
            this.modals.vitalRegister.loading = false;
            this.modals.vitalRegister.visible = false;
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
</style>