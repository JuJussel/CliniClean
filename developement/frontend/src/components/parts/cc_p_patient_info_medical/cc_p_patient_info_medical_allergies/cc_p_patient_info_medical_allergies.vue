<template>
    <div>
        <cui-table :data="allergyStore.list">
            <template #header>
                <h2>{{ $lang.allergy }} {{ $lang.valid }}</h2>
                <cui-button
                    icon="fas fa-plus"
                    :label="$lang.register"
                    @click="openEditor"
                    v-if="$store.getters.layoutData.medical?.encounter"
                />
            </template>
        </cui-table>
    </div>
    <cui-modal
        :visible="editModal.open"
        @close="editModal.open = false"
    >
        <cui-card
            style="width: 450px; height: 320px"
            v-if="editModal.open"
        >
            <template #header>
                {{ $lang.allergy }}
                {{ editModal.data ? $lang.edit : $lang.register }}
            </template>
            <allegryEditor 
                :allergy="editModal.data" 
                @loading="editModal.loading = true"
                @close="editModal.open = false"
                @update="saveAllergy">
            </allegryEditor>
        </cui-card>
    </cui-modal>
</template>

<script>

import allegryEditor from './cc_p_patient_info_medical_allergy_edit.vue'
import { useAllergyStore } from '@/stores/medical/allergy'
import { mapStores } from 'pinia'

export default {
    components: { allegryEditor },
    data() {
        return {
            editModal: {
                open: false,
                data: null,
                loading: false
            }
        }
    },
    computed: {
        ...mapStores(useAllergyStore),
    },
    methods: {
        openEditor(data = null) {
            if (data) Object.assign(editModal.data, data)
            this.editModal.open = true
        },
        async saveAllergy(allergy) {
            //save to DB
            try {
                let result = await this.$api.get("doctors")
                this.allergyStore.setData()
            } catch (err) {
                this.$apiError(err)
            }
            // this.editModal.open = false
        }
    },
}
</script>