<script setup>
import { ref, computed, onMounted, inject } from 'vue'

const props = defineProps({
    patientId: {
        type: String,
        required: true
    }
})

const toast = useToast()
const dayjs = useDayjs()
const openEncounterInTabs = inject("openEncounterInTabs", null)

const isLoading = ref(true)
const patient = ref(null)
const isUpdatingBloodType = ref(false)

// Fetch patient data including visit history (encounters)
async function fetchPatientData() {
    isLoading.value = true
    try {
        const response = await $fetch(`/api/patient/${props.patientId}`)
        if (response && response.success) {
            patient.value = response.data
        } else {
            throw new Error('Failed to fetch patient data')
        }
    } catch (error) {
        console.error('Error fetching patient data:', error)
        toast.add({
            title: $t('error') || 'Error',
            description: error.message || 'Failed to load patient details',
            color: 'error'
        })
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchPatientData()
})

// Calculate patient age in years
const patientAge = computed(() => {
    if (!patient.value?.birthDate) return null
    return dayjs().diff(dayjs(patient.value.birthDate), 'year')
})

// Blood Type options
const bloodTypes = [
    { value: 'A+', label: 'A型 Rh+' },
    { value: 'A-', label: 'A型 Rh-' },
    { value: 'B+', label: 'B型 Rh+' },
    { value: 'B-', label: 'B型 Rh-' },
    { value: 'O+', label: 'O型 Rh+' },
    { value: 'O-', label: 'O型 Rh-' },
    { value: 'AB+', label: 'AB型 Rh+' },
    { value: 'AB-', label: 'AB型 Rh-' },
    { value: '未登録', label: '未登録' }
]

// Handle saving blood type to the database
async function handleBloodTypeChange(newBloodType) {
    if (!patient.value) return
    isUpdatingBloodType.value = true
    try {
        const response = await $fetch(`/api/patient/${props.patientId}`, {
            method: 'PUT',
            body: { bloodType: newBloodType }
        })
        if (response && response.success) {
            patient.value.bloodType = newBloodType
            toast.add({
                title: $t('saved') || '保存しました',
                description: `血液型を ${newBloodType} に更新しました。`,
                color: 'success'
            })
        } else {
            throw new Error('Failed to update blood type')
        }
    } catch (error) {
        console.error('Error updating blood type:', error)
        toast.add({
            title: $t('error') || 'Error',
            description: '血液型の更新に失敗しました。',
            color: 'error'
        })
    } finally {
        isUpdatingBloodType.value = false
    }
}

// Split encounters into past visits (waiting, in progress, payment, completed) and next reservations
const pastVisits = computed(() => {
    if (!patient.value?.encounters) return []
    // Filter encounters that are not scheduled reservations (status !== 1)
    return patient.value.encounters.filter(e => e.status !== 1)
})

const nextVisits = computed(() => {
    if (!patient.value?.encounters) return []
    // Filter encounters that are scheduled as reservations (status === 1)
    // Sort chronologically ascending (future dates closest to now first)
    return patient.value.encounters
        .filter(e => e.status === 1)
        .slice()
        .reverse()
})

const getEncounterStatusColor = (statusId) => {
    const colors = {
        1: 'amber',
        2: 'blue',
        3: 'indigo',
        4: 'orange',
        5: 'success',
        99: 'red'
    }
    return colors[statusId] || 'neutral'
}

const getEncounterStatusLabel = (statusId) => {
    const labels = {
        1: 'reservation',
        2: 'arrived',
        3: 'activeReception',
        4: 'billing',
        5: 'completed',
        99: 'canceled'
    }
    return labels[statusId] || 'unknown'
}

const resolveDepartmentName = (deptCode) => {
    if (!deptCode) return $t('departments.general')
    const key = `departments.${deptCode}`
    const translated = $t(key)
    return translated !== key ? translated : deptCode
}
</script>

<template>
    <div class="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
        <!-- Loading Skeleton State -->
        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Left Side Skeletons -->
            <div class="space-y-6">
                <!-- Demographic summary skeleton -->
                <UCard>
                    <div class="flex items-center gap-4">
                        <USkeleton class="h-16 w-16 rounded-full" />
                        <div class="space-y-2 flex-1">
                            <USkeleton class="h-4 w-1/4" />
                            <USkeleton class="h-6 w-1/2" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
                        <div v-for="i in 3" :key="i" class="space-y-2">
                            <USkeleton class="h-3 w-1/3" />
                            <USkeleton class="h-4 w-3/4" />
                        </div>
                    </div>
                </UCard>
                <!-- Contact info skeleton -->
                <UCard>
                    <template #header>
                        <USkeleton class="h-5 w-1/4" />
                    </template>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="i in 4" :key="i" class="space-y-2">
                            <USkeleton class="h-3 w-1/3" />
                            <USkeleton class="h-4 w-3/4" />
                        </div>
                    </div>
                </UCard>
            </div>
            <!-- Right Side Skeletons -->
            <div class="space-y-6">
                <UCard v-for="i in 2" :key="i">
                    <template #header>
                        <USkeleton class="h-5 w-1/3" />
                    </template>
                    <div class="space-y-3">
                        <div v-for="j in 3" :key="j" class="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                            <div class="space-y-2 flex-1">
                                <USkeleton class="h-4 w-1/3" />
                                <USkeleton class="h-3 w-1/4" />
                            </div>
                            <USkeleton class="h-6 w-16 rounded-full" />
                        </div>
                    </div>
                </UCard>
            </div>
        </div>

        <!-- Loaded Content View -->
        <div v-else-if="patient" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <!-- Left Column: Patient Profile & Demographics -->
            <div class="space-y-6">
                
                <!-- 1. Profile Summary Card -->
                <UCard class="w-full relative overflow-hidden">
                    <!-- Subtle decorative background gradient circles -->
                    <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/5 dark:bg-primary/10 blur-xl pointer-events-none"/>
                    
                    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                        <!-- Gender-colored Avatar wrapper -->
                        <div
class="relative flex items-center justify-center h-20 w-20 rounded-full border shadow-sm shrink-0"
                             :class="patient.gender === 'female' 
                                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-500' 
                                : patient.gender === 'male'
                                ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-500'
                                : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'">
                            <UIcon
:name="patient.gender === 'female' 
                                ? 'material-symbols:female-rounded' 
                                : patient.gender === 'male'
                                ? 'material-symbols:male-rounded'
                                : 'material-symbols:person-rounded'" 
                                class="h-10 w-10" />
                        </div>
                        
                        <!-- Header names and IDs -->
                        <div class="flex-1 text-center sm:text-left space-y-1">
                            <span class="text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
                                ID: {{ patient.id }}
                            </span>
                            <div class="text-xs text-neutral-400 dark:text-neutral-500">
                                {{ patient.name?.familyKana || '' }} {{ patient.name?.givenKana || '' }}
                            </div>
                            <h2 class="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex flex-col sm:flex-row sm:items-center gap-2">
                                <span>{{ patient.name?.family || '' }} {{ patient.name?.given || '' }}</span>
                                <span class="hidden sm:inline-block h-4 w-px bg-neutral-300 dark:bg-neutral-700"/>
                                <UBadge
size="sm" variant="subtle"
                                         :color="patient.gender === 'female' ? 'rose' : (patient.gender === 'male' ? 'primary' : 'neutral')">
                                    {{ $t(patient.gender) }}
                                </UBadge>
                            </h2>
                        </div>
                    </div>

                    <!-- Core Demographics Fields Grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/50">
                        <div class="space-y-1">
                            <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                <UIcon name="material-symbols:calendar-today-outline-rounded" /> {{ $t('birthDate') }}
                            </span>
                            <p class="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                {{ patient.birthDate ? dayjs(patient.birthDate).format('YYYY年MM月DD日') : '未設定' }}
                            </p>
                        </div>
                        
                        <div class="space-y-1">
                            <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                <UIcon name="material-symbols:hourglass-top-rounded" /> {{ $t('age') }}
                            </span>
                            <p class="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                {{ patientAge !== null ? `${patientAge} 歳` : '不明' }}
                            </p>
                        </div>

                        <div class="space-y-1 col-span-2 sm:col-span-1">
                            <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                <UIcon name="material-symbols:water-drop-outline-rounded" class="text-rose-500" /> {{ $t('bloodType') }}
                            </span>
                            
                            <!-- Blood Type Dropdown with Autosave -->
                            <div class="relative w-full">
                                <USelect
                                    :model-value="patient.bloodType || '未登録'"
                                    :items="bloodTypes"
                                    value-key="value"
                                    label-key="label"
                                    size="sm"
                                    color="neutral"
                                    variant="subtle"
                                    :loading="isUpdatingBloodType"
                                    class="w-full font-medium"
                                    @update:model-value="handleBloodTypeChange"
                                />
                            </div>
                        </div>
                    </div>
                </UCard>

                <!-- 2. Address & Telecom Details Card -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-200">
                            <UIcon name="material-symbols:contact-page-outline-rounded" />
                            <h3 class="text-sm font-bold tracking-wider uppercase">
                                {{ $t('contactInfo') }}
                            </h3>
                        </div>
                    </template>

                    <div class="space-y-4">
                        <!-- Address Display Section -->
                        <div class="p-3.5 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200/30 dark:border-neutral-800/30 space-y-2">
                            <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                <UIcon name="material-symbols:home-pin-outline-rounded" /> {{ $t('address') }}
                            </span>
                            <div class="space-y-1">
                                <p v-if="patient.address?.zip" class="text-xs font-semibold text-neutral-500">
                                    〒 {{ patient.address.zip }}
                                </p>
                                <p class="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                                    {{ patient.address?.line || '' }}{{ patient.address?.address || '' }}
                                </p>
                                <p v-if="!patient.address?.line && !patient.address?.address" class="text-xs text-neutral-400">
                                    住所情報はありません。
                                </p>
                            </div>
                        </div>

                        <!-- Telecom Grid -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Mobile Phone -->
                            <div class="p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200/30 dark:border-neutral-800/30 space-y-1">
                                <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                    <UIcon name="material-symbols:phone-android-outline-rounded" /> 携帯電話
                                </span>
                                <a
v-if="patient.telecom?.phoneMobile" :href="`tel:${patient.telecom.phoneMobile}`" 
                                   class="text-sm font-semibold text-primary hover:underline block truncate">
                                    {{ patient.telecom.phoneMobile }}
                                </a>
                                <span v-else class="text-sm text-neutral-400">未設定</span>
                            </div>

                            <!-- Home Phone -->
                            <div class="p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200/30 dark:border-neutral-800/30 space-y-1">
                                <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                    <UIcon name="material-symbols:call-outline-rounded" /> 自宅電話
                                </span>
                                <a
v-if="patient.telecom?.phoneHome" :href="`tel:${patient.telecom.phoneHome}`" 
                                   class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:underline block truncate">
                                    {{ patient.telecom.phoneHome }}
                                </a>
                                <span v-else class="text-sm text-neutral-400">未設定</span>
                            </div>

                            <!-- Email -->
                            <div class="p-3 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20 border border-neutral-200/30 dark:border-neutral-800/30 space-y-1 sm:col-span-2">
                                <span class="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                                    <UIcon name="material-symbols:mail-outline-rounded" /> {{ $t('email') }}
                                </span>
                                <a
v-if="patient.telecom?.email" :href="`mailto:${patient.telecom.email}`" 
                                   class="text-sm font-semibold text-primary hover:underline block truncate">
                                    {{ patient.telecom.email }}
                                </a>
                                <span v-else class="text-sm text-neutral-400">未設定</span>
                            </div>
                        </div>
                    </div>
                </UCard>

                <!-- 3. Emergency Contact Card -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-1.5 text-rose-500">
                            <UIcon name="material-symbols:contact-emergency-outline-rounded" />
                            <h3 class="text-sm font-bold tracking-wider uppercase">
                                {{ $t('emergencyContact') }}
                            </h3>
                        </div>
                    </template>

                    <div v-if="patient.contact?.person" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="p-3 rounded-xl bg-rose-50/20 dark:bg-rose-950/5 border border-rose-200/20 dark:border-rose-900/10 space-y-1">
                            <span class="text-xs text-neutral-400 dark:text-neutral-500">氏名 (関係)</span>
                            <p class="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                                {{ patient.contact.person.name?.family || '' }} {{ patient.contact.person.name?.given || '' }}
                                <span v-if="patient.contact.relationship" class="text-xs font-normal text-neutral-500">
                                    ({{ patient.contact.relationship }})
                                </span>
                            </p>
                        </div>
                        <div class="p-3 rounded-xl bg-rose-50/20 dark:bg-rose-950/5 border border-rose-200/20 dark:border-rose-900/10 space-y-1">
                            <span class="text-xs text-neutral-400 dark:text-neutral-500">緊急連絡先電話番号</span>
                            <a
v-if="patient.contact.person.telecom?.phoneMobile" :href="`tel:${patient.contact.person.telecom.phoneMobile}`"
                               class="text-sm font-semibold text-primary hover:underline block truncate">
                                {{ patient.contact.person.telecom.phoneMobile }}
                            </a>
                            <p v-else-if="patient.contact.person.telecom?.phoneHome" class="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                {{ patient.contact.person.telecom.phoneHome }}
                            </p>
                            <span v-else class="text-sm text-neutral-400">未設定</span>
                        </div>
                    </div>
                    <div v-else class="text-center py-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 dark:text-neutral-500 text-sm">
                        緊急連絡先は登録されていません。
                    </div>
                </UCard>

            </div>

            <!-- Right Column: Visit History & Upcoming Reservations -->
            <div class="space-y-6">

                <!-- 1. Reservations (Next Visits) -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-1.5 text-amber-500">
                            <UIcon name="material-symbols:event-upcoming-outline-rounded" />
                            <h3 class="text-sm font-bold tracking-wider uppercase">
                                次回予約 ({{ nextVisits.length }}件)
                            </h3>
                        </div>
                    </template>

                    <div v-if="nextVisits.length > 0" class="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[300px] overflow-y-auto pr-1">
                        <div
v-for="visit in nextVisits" :key="visit._id" 
                             class="flex items-center justify-between py-3 hover:bg-neutral-50/40 dark:hover:bg-neutral-800/20 rounded-lg px-2 transition-colors">
                            <div class="space-y-1">
                                <p class="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                                    {{ dayjs(visit.date).format('YYYY年MM月DD日 (dd) HH:mm') }}
                                </p>
                                <div class="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                                    <span>{{ resolveDepartmentName(visit.department) }}</span>
                                    <span v-if="visit.doctor" class="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                                    <span v-if="visit.doctor">{{ visit.doctor.nameLast }}{{ visit.doctor.nameFirst }} 医師</span>
                                </div>
                            </div>
                            <UBadge size="sm" variant="outline" :color="getEncounterStatusColor(visit.status)">
                                {{ $t(getEncounterStatusLabel(visit.status)) }}
                            </UBadge>
                        </div>
                    </div>

                    <div v-else class="flex flex-col items-center justify-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 dark:text-neutral-500 text-center space-y-2">
                        <UIcon name="material-symbols:calendar-today-outline-rounded" class="text-3xl text-neutral-300 dark:text-neutral-700" />
                        <span class="text-sm">予定された次回予約はありません。</span>
                    </div>
                </UCard>

                <!-- 2. Past Visits (Visit History) -->
                <UCard>
                    <template #header>
                        <div class="flex items-center gap-1.5 text-indigo-500">
                            <UIcon name="material-symbols:history-rounded" />
                            <h3 class="text-sm font-bold tracking-wider uppercase">
                                来院履歴 ({{ pastVisits.length }}件)
                            </h3>
                        </div>
                    </template>

                    <div v-if="pastVisits.length > 0" class="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-[500px] overflow-y-auto pr-1">
                        <div
v-for="visit in pastVisits" :key="visit._id"
                             class="flex items-center justify-between py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 rounded-xl px-3 transition-all">
                            <div class="space-y-1">
                                <!-- Clicking a historical encounter updates query parameter to open the card -->
                                <UButton
                                    v-if="openEncounterInTabs"
                                    color="primary"
                                    variant="link"
                                    class="p-0 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 hover:underline block text-left"
                                    @click="openEncounterInTabs(visit._id)"
                                >
                                    {{ dayjs(visit.date).format('YYYY年MM月DD日 (dd) HH:mm') }}
                                </UButton>
                                <ULink
                                    v-else
                                    :to="`/patient/${patient.id}?encounterId=${visit._id}`" 
                                    class="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 hover:underline block"
                                >
                                    {{ dayjs(visit.date).format('YYYY年MM月DD日 (dd) HH:mm') }}
                                </ULink>
                                <div class="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                                    <span>{{ resolveDepartmentName(visit.department) }}</span>
                                    <span v-if="visit.doctor" class="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700"/>
                                    <span v-if="visit.doctor">{{ visit.doctor.nameLast }}{{ visit.doctor.nameFirst }} 医師</span>
                                </div>
                            </div>
                            
                            <UBadge size="sm" variant="outline" :color="getEncounterStatusColor(visit.status)">
                                {{ $t(getEncounterStatusLabel(visit.status)) }}
                            </UBadge>
                        </div>
                    </div>

                    <div v-else class="flex flex-col items-center justify-center py-8 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-400 dark:text-neutral-500 text-center space-y-2">
                        <UIcon name="material-symbols:history-rounded" class="text-3xl text-neutral-300 dark:text-neutral-700" />
                        <span class="text-sm">来院履歴はありません。</span>
                    </div>
                </UCard>

            </div>
        </div>
    </div>
</template>
