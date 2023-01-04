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
        :visible="allergyEditorOpen"
        :closable="!$store.getters.layoutData.medical.allegryEditor?.loading"
        @close="this.$store.commit('SET_LAYOUT_DATA', ['medical', {allegryEditor: {open: false, data: null}}])"
    >
        <cui-card
            style="width: 600px; height: 640px"
            v-if="$store.getters.layoutData.medical.allegryEditor?.open"
        >
            <template #header>
                {{ $lang.allergy }}
                {{ editModal.data ? $lang.edit : $lang.register }}
            </template>
            <allegryEditor></allegryEditor>
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
                visible: false,
                data: null
            }
        }
    },
    computed: {
        allergies() {
            return this.$store.getters.layoutData.medical?.patient?.allergies || []
        },
        allergyEditorOpen() {
            return this.$store.getters.layoutdata.medical.allegryEditor?.open || false
        }
    },
    methods: {
        openEditor(data = null) {
            this.$store.commit('SET_LAYOUT_DATA', ['medical', {allegryEditor: {open: true, data: data}}])
        }
    },
}
</script>