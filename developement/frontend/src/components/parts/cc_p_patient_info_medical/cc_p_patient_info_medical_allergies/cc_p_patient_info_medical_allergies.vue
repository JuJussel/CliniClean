<template>
    <div>
        <cui-table :data="allergies">
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
            style="width: 600px; height: 640px"
            v-if="editModal.open"
        >
            <template #header>
                {{ $lang.allergy }}
                {{ editModal.data ? $lang.edit : $lang.register }}
            </template>
            <allegryEditor 
                :allergy="editModal.data" 
                @loading="editModal.loading = true"
                @update="saveAllergy">
            </allegryEditor>
        </cui-card>
    </cui-modal>

</template>

<script>

import allegryEditor from './cc_p_patient_info_medical_allergy_edit.vue'

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
        allergies() {
            return this.$store.getters.layoutData.medical?.patient?.allergies || []
        }
    },
    methods: {
        openEditor(data = null) {
            if (data) Object.assign(editModal.data, data)
            this.editModal.open = true
        },
        saveAllergy(allergy) {
            //save to DB
            // this.editModal.open = false
        }
    },
}
</script>