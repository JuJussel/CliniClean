<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    patientId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['close', 'saved'])

const toast = useToast()
const dayjs = useDayjs()
const { t } = useI18n()
const userStore = useUserStore()

const isSubmitting = ref(false)

const form = ref({
    date: dayjs().format('YYYY-MM-DDTHH:mm'),
    bloodPreasureHigh: null,
    bloodPreasureLow: null,
    pulse: null,
    temperature: null,
    spo2: null,
    weight: null,
    height: null,
    waist: null,
    head: null,
    breast: null,
    memo: ''
})

async function handleRecordSubmit() {
    isSubmitting.value = true
    try {
        const response = await $fetch(`/api/patient/${props.patientId}/vitals`, {
            method: 'POST',
            body: {
                ...form.value,
                date: new Date(form.value.date),
                recordedBy: userStore.userData?._id || null
            }
        })
        if (response && response.success) {
            toast.add({
                title: t('saved') || '保存しました',
                description: t('vitalsTab.saveSuccess'),
                color: 'success'
            })
            emit('saved')
            emit('close')
        } else {
            throw new Error('Failed to save vitals')
        }
    } catch (error) {
        console.error('Error saving vitals:', error)
        toast.add({
            title: t('error') || 'Error',
            description: t('vitalsTab.saveError'),
            color: 'error'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <UModal>
        <template #title>
            <div class="flex items-center gap-2">
                <UIcon name="material-symbols:vital-signs-rounded" class="size-5" />
                {{ $t('vitalsTab.modalTitle') }}
            </div>
        </template>
        
        <template #body>
            <form id="vitals-record-form" @submit.prevent="handleRecordSubmit" class="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                <div class="grid grid-cols-2 gap-4">
                    <!-- Temperature -->
                    <UFormField :label="`${$t('vitalCategories.temperature')} (℃)`">
                        <UInput v-model.number="form.temperature" type="number" step="0.1" class="w-full" placeholder="36.5" />
                    </UFormField>
                    
                    <!-- Pulse -->
                    <UFormField :label="`${$t('vitalCategories.pulse')} (bpm)`">
                        <UInput v-model.number="form.pulse" type="number" class="w-full" placeholder="72" />
                    </UFormField>

                    <!-- BP High -->
                    <UFormField :label="`${$t('bloodPreasure')} - 収縮期(S) (mmHg)`">
                        <UInput v-model.number="form.bloodPreasureHigh" type="number" class="w-full" placeholder="120" />
                    </UFormField>

                    <!-- BP Low -->
                    <UFormField :label="`${$t('bloodPreasure')} - 拡張期(D) (mmHg)`">
                        <UInput v-model.number="form.bloodPreasureLow" type="number" class="w-full" placeholder="80" />
                    </UFormField>

                    <!-- SpO2 -->
                    <UFormField :label="`${$t('vitalCategories.spo2')} (%)`">
                        <UInput v-model.number="form.spo2" type="number" class="w-full" placeholder="98" />
                    </UFormField>

                    <!-- Weight -->
                    <UFormField :label="`${$t('vitalCategories.weight')} (kg)`">
                        <UInput v-model.number="form.weight" type="number" step="0.1" class="w-full" placeholder="60.0" />
                    </UFormField>

                    <!-- Height -->
                    <UFormField :label="`${$t('vitalCategories.height')} (cm)`">
                        <UInput v-model.number="form.height" type="number" step="0.1" class="w-full" placeholder="170.0" />
                    </UFormField>

                    <!-- Waist -->
                    <UFormField :label="`${$t('vitalCategories.waist')} (cm)`">
                        <UInput v-model.number="form.waist" type="number" step="0.1" class="w-full" placeholder="80.0" />
                    </UFormField>

                    <!-- Head -->
                    <UFormField :label="`${$t('vitalCategories.head')} (cm)`">
                        <UInput v-model.number="form.head" type="number" step="0.1" class="w-full" placeholder="55.0" />
                    </UFormField>

                    <!-- Breast -->
                    <UFormField :label="`${$t('vitalCategories.breast')} (cm)`">
                        <UInput v-model.number="form.breast" type="number" step="0.1" class="w-full" placeholder="90.0" />
                    </UFormField>
                </div>

                <!-- Memo -->
                <UFormField :label="$t('vitalsTab.memo')">
                    <UTextarea v-model="form.memo" class="w-full" placeholder="測定メモ" />
                </UFormField>
            </form>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3 w-full">
                <UButton 
                    type="button" 
                    color="neutral" 
                    variant="outline"
                    @click="emit('close')"
                    :disabled="isSubmitting"
                >
                    {{ $t('cancel') || 'キャンセル' }}
                </UButton>
                <UButton 
                    type="submit" 
                    form="vitals-record-form"
                    color="primary"
                    :loading="isSubmitting"
                    :disabled="isSubmitting"
                >
                    {{ $t('vitalsTab.modalSave') }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
