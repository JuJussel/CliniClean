<template>
    <div ref="vitalLoad">
        <div style="max-height: 500px;overflow: auto; display: flex; flex-flow: wrap;">
            <vs-input
                v-for="(item, index) in vitalCats"
                :key="index"
                :label="item.name"
                v-model="item.value"
                icon-after
                v-bind:class="{longIcon11: item.unit.length > 3}"
                style="width: 40%"
                >
                <template #icon>
                    <span>{{ item.unit }}</span>
                </template>

            </vs-input>
        </div>


        <div class="cc-dialog-footer">
            <vs-button @click="$emit('close')" transparent dark>キャンセル</vs-button>
            <vs-button @click="save()" :disabled="!inputOK">登録</vs-button>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        inputOK() {
            let hasInput = this.vitalCats.filter(cat => cat.value !== '')
            if (hasInput.length > 0) {
                return true
            }
            return false
        }
    },
    data() {
        return {
            vitalCats: []
        }
    },
    created() {

        this.$get('vitalcategories')
        .then(result => {
            this.vitalCats = result.data
        })
        .catch(result => {
            this.$apiError(result)
        })

    },
    methods: {
        save() {
            const loading = this.$vs.loading({
                target: this.$refs.vitalLoad,
                color: 'dark'
            })

            let sendData = {
                items: this.vitalCats.filter(cat => cat.value !== ''),
                patient_id: this.$store.getters.activePatient,
                encounter_id: this.$store.getters.activeShinsatu
            }

            this.$post('vitals', sendData)
            .then(result => {
                loading.close()
                this.$emit('update')
                this.$emit('close')
            })
            .catch(result => {
                this.$apiError(result)
            })

        }
    }
}
</script>
<style>
    .longIcon11 > div > .vs-input__icon {
        width: 50px!important
    }
</style>