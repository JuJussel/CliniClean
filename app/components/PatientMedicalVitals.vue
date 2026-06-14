<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ModalPatientVitals } from '#components'

const props = defineProps({
    patientId: {
        type: String,
        required: true
    }
})

const toast = useToast()
const dayjs = useDayjs()
const { t } = useI18n()
const overlay = useOverlay()

const isLoading = ref(true)
const vitals = ref([])
const rowSelection = ref({})
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// Graph configuration
const graphCategories = [
    'temperature',
    'pulse',
    'bloodPreasureHigh',
    'bloodPreasureLow',
    'spo2',
    'weight',
    'bmi',
    'height'
]
const activeCategories = ref(['temperature', 'pulse']) // default plotted categories

// Fetch historical vitals
async function fetchVitals() {
    isLoading.value = true
    try {
        const response = await $fetch(`/api/patient/${props.patientId}/vitals`)
        if (response && response.success) {
            vitals.value = response.data
            // Auto select all rows initially for full graph visibility
            rowSelection.value = {}
            response.data.forEach((_, idx) => {
                rowSelection.value[idx.toString()] = true
            })
        } else {
            throw new Error('Failed to fetch vitals')
        }
    } catch (error) {
        console.error('Error fetching vitals:', error)
        toast.add({
            title: t('error') || 'Error',
            description: t('vitalsTab.fetchError'),
            color: 'error'
        })
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchVitals()
})

async function openAddVitalsModal() {
    const vitalsModal = overlay.create(ModalPatientVitals, {
        destroyOnClose: true
    })
    await vitalsModal.open({
        patientId: props.patientId
    })
    await fetchVitals()
}

// Table columns setup (fully localized reactively)
const columns = computed(() => [
    { id: 'select', class: 'w-12' },
    { accessorKey: 'date', header: t('vitalsTab.tableDate') },
    { accessorKey: 'bloodPreasure', header: t('bloodPreasure') },
    { accessorKey: 'pulse', header: `${t('vitalCategories.pulse')} (bpm)` },
    { accessorKey: 'temperature', header: `${t('vitalCategories.temperature')} (℃)` },
    { accessorKey: 'spo2', header: `${t('vitalCategories.spo2')} (%)` },
    { accessorKey: 'weight', header: `${t('vitalCategories.weight')} (kg)` },
    { accessorKey: 'bmi', header: t('vitalCategories.bmi') },
    { accessorKey: 'height', header: `${t('vitalCategories.height')} (cm)` },
    { accessorKey: 'recordedBy', header: t('vitalsTab.tableRecordedBy') }
])

// Filtered data to plot in the graph based on checked checkboxes in the table
const chartData = computed(() => {
    const selectedIndices = Object.keys(rowSelection.value).filter(k => !!rowSelection.value[k])
    let filtered = vitals.value.filter((_, idx) => selectedIndices.includes(idx.toString()))
    
    // Fallback: If no rows are checked, plot all rows
    if (filtered.length === 0) {
        filtered = vitals.value
    }
    
    // Sort chronological (oldest first)
    return filtered.slice().reverse()
})

// Color presets matching vitals
const getCategoryColor = (cat) => {
    const colors = {
        temperature: '#f43f5e',       // Rose
        pulse: '#f59e0b',             // Amber
        bloodPreasureHigh: '#3b82f6', // Blue
        bloodPreasureLow: '#6366f1',  // Indigo
        spo2: '#06b6d4',              // Cyan
        weight: '#10b981',            // Emerald
        bmi: '#8b5cf6',               // Purple
        height: '#0d9488'             // Teal
    }
    return colors[cat] || '#737373'
}

// Unit mapper for categories
const getUnitForCategory = (cat) => {
    const units = {
        temperature: '℃',
        pulse: ' bpm',
        bloodPreasureHigh: ' mmHg',
        bloodPreasureLow: ' mmHg',
        spo2: '%',
        weight: ' kg',
        bmi: '',
        height: ' cm'
    }
    return units[cat] || ''
}

// Chart Options for ECharts
const chartOption = computed(() => {
    const xAxisData = chartData.value.map(d => dayjs(d.date).format('LL'))
    
    const series = activeCategories.value.map(cat => {
        return {
            name: t(`vitalCategories.${cat}`),
            type: 'line',
            data: chartData.value.map(d => d[cat]),
            connectNulls: true,
            smooth: true,
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
                color: getCategoryColor(cat)
            },
            lineStyle: {
                width: 3,
                color: getCategoryColor(cat)
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: getCategoryColor(cat) + '1a' }, // 10% opacity
                        { offset: 1, color: getCategoryColor(cat) + '00' }  // 0% opacity
                    ]
                }
            }
        }
    })

    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'var(--ui-bg-elevated, rgba(255, 255, 255, 0.95))',
            borderColor: 'var(--ui-border, #e2e8f0)',
            borderWidth: 1,
            textStyle: {
                fontFamily: 'Inter, system-ui, sans-serif'
            },
            extraCssText: 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border-radius: 8px; padding: 10px;',
            formatter: (params) => {
                let html = `<div class="font-bold text-xs mb-1 text-neutral-800 dark:text-neutral-200">${params[0].axisValue}</div>`
                params.forEach(p => {
                    const cat = activeCategories.value.find(c => t(`vitalCategories.${c}`) === p.seriesName)
                    const unitStr = cat ? getUnitForCategory(cat) : ''
                    html += `
                        <div class="flex items-center justify-between gap-4 text-xs py-0.5">
                            <span class="flex items-center gap-1.5 font-medium text-neutral-500 dark:text-neutral-400">
                                <span class="inline-block w-2.5 h-2.5 rounded-full" style="background-color: ${p.color}"></span>
                                ${p.seriesName}
                            </span>
                            <span class="font-bold text-neutral-800 dark:text-neutral-100">${p.value !== null && p.value !== undefined ? p.value : '-'}${unitStr}</span>
                        </div>
                    `
                })
                return html
            }
        },
        legend: {
            show: false // using custom buttons
        },
        grid: {
            top: '8%',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLabel: {
                color: '#64748b',
                fontSize: 10,
                fontFamily: 'Inter, system-ui, sans-serif'
            },
            axisLine: {
                lineStyle: {
                    color: '#cbd5e1'
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
                color: '#64748b',
                fontSize: 10,
                fontFamily: 'Inter, system-ui, sans-serif'
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(226, 232, 240, 0.4)',
                    type: 'dashed'
                }
            }
        },
        series
    }
})

const toggleCategory = (cat) => {
    const index = activeCategories.value.indexOf(cat)
    if (index === -1) {
        activeCategories.value.push(cat)
    } else {
        if (activeCategories.value.length > 1) {
            activeCategories.value.splice(index, 1)
        }
    }
}
</script>

<template>
    <div class="h-full flex flex-col p-4 space-y-6 overflow-y-auto">
        <!-- Vitals Header and Add Record Action -->
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <UIcon name="material-symbols:vital-signs-rounded" class="text-2xl text-primary-500" />
                <h2 class="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                    {{ $t('vitalsTab.title') }}
                </h2>
            </div>
            <UButton 
                color="primary"
                icon="material-symbols:add"
                @click="openAddVitalsModal"
            >
                {{ $t('vitalsTab.recordButton') }}
            </UButton>
        </div>

        <!-- 1. Vitals Table Card -->
        <UCard>
            <UTable
                :loading="isLoading"
                :data="vitals"
                :columns="columns"
                v-model:row-selection="rowSelection"
                class="flex-1"
            >
                <!-- Select row template slots -->
                <template #select-header="{ table }">
                    <UCheckbox
                        :model-value="table.getIsAllPageRowsSelected()"
                        :indeterminate="table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()"
                        @update:model-value="(val) => table.toggleAllPageRowsSelected(!!val)"
                    />
                </template>
                <template #select-cell="{ row }">
                    <UCheckbox
                        :model-value="row.getIsSelected()"
                        @update:model-value="(val) => row.toggleSelected(!!val)"
                    />
                </template>

                <!-- Date display format -->
                <template #date-cell="{ row }">
                    <span class="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        {{ dayjs(row.original.date).format('LL') }}
                    </span>
                </template>

                <!-- BP High/Low cell format -->
                <template #bloodPreasure-cell="{ row }">
                    <span v-if="row.original.bloodPreasureHigh || row.original.bloodPreasureLow" class="font-semibold text-neutral-700 dark:text-neutral-200">
                        {{ row.original.bloodPreasureHigh || '-' }} {{ $t('vitalsTab.bpSeparator') }} {{ row.original.bloodPreasureLow || '-' }}
                    </span>
                    <span v-else class="text-neutral-400">-</span>
                </template>

                <!-- General cells fallback with units -->
                <template #pulse-cell="{ row }">
                    <span v-if="row.original.pulse !== null && row.original.pulse !== undefined" class="font-semibold text-neutral-700 dark:text-neutral-200">{{ row.original.pulse }}</span>
                    <span v-else class="text-neutral-400">-</span>
                </template>
                <template #temperature-cell="{ row }">
                    <span v-if="row.original.temperature !== null && row.original.temperature !== undefined" class="font-semibold text-neutral-700 dark:text-neutral-200">{{ row.original.temperature }}</span>
                    <span v-else class="text-neutral-400">-</span>
                </template>
                <template #spo2-cell="{ row }">
                    <span v-if="row.original.spo2 !== null && row.original.spo2 !== undefined" class="font-semibold text-neutral-700 dark:text-neutral-200">{{ row.original.spo2 }}</span>
                    <span v-else class="text-neutral-400">-</span>
                </template>
                <template #weight-cell="{ row }">
                    <span v-if="row.original.weight !== null && row.original.weight !== undefined" class="font-semibold text-neutral-700 dark:text-neutral-200">{{ row.original.weight }}</span>
                    <span v-else class="text-neutral-400">-</span>
                </template>
                <template #bmi-cell="{ row }">
                    <span v-if="row.original.bmi !== null && row.original.bmi !== undefined" class="font-semibold text-neutral-600 dark:text-neutral-300">{{ row.original.bmi }}</span>
                    <span v-else class="text-neutral-400">-</span>
                </template>
                <template #height-cell="{ row }">
                    <span v-if="row.original.height !== null && row.original.height !== undefined" class="font-semibold text-neutral-700 dark:text-neutral-200">{{ row.original.height }}</span>
                    <span v-else class="text-neutral-400">-</span>
                </template>

                <!-- Recorded by doctor -->
                <template #recordedBy-cell="{ row }">
                    <span class="text-xs text-neutral-500">
                        {{ row.original.recordedBy ? `${row.original.recordedBy.nameLast} ${row.original.recordedBy.nameFirst}` : $t('vitalsTab.unknownDoctor') }}
                    </span>
                </template>

                <template #empty>
                    <div class="flex flex-col items-center justify-center py-10 text-neutral-400 dark:text-neutral-500 space-y-2">
                        <UIcon name="material-symbols:history-rounded" class="text-3xl text-neutral-300 dark:text-neutral-700" />
                        <span>{{ $t('vitalsTab.noHistory') }}</span>
                    </div>
                </template>
            </UTable>
        </UCard>

        <!-- 2. Vitals Line Chart Graph -->
        <UCard v-if="vitals.length > 0 && chartData.length > 0">
            <template #header>
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div class="flex items-center gap-1.5 text-primary-500">
                        <UIcon name="material-symbols:query-stats-rounded" />
                        <h3 class="text-sm font-bold tracking-wider uppercase">
                            {{ $t('vitalsTab.chartTitle') }}
                        </h3>
                    </div>
                    
                    <!-- Selection filters for vital Categories -->
                    <div class="flex flex-wrap gap-2 items-center">
                        <span class="text-xs text-neutral-400 dark:text-neutral-500 mr-2">{{ $t('vitalsTab.chartCategorySelect') }}:</span>
                        <UButton 
                            v-for="cat in graphCategories" 
                            :key="cat"
                            size="xs"
                            :variant="activeCategories.includes(cat) ? 'solid' : 'outline'"
                            :style="activeCategories.includes(cat) ? { backgroundColor: getCategoryColor(cat), borderColor: getCategoryColor(cat), color: 'white' } : { color: getCategoryColor(cat), borderColor: getCategoryColor(cat) }"
                            class="font-medium"
                            @click="toggleCategory(cat)"
                        >
                            {{ $t('vitalCategories.' + cat) }}
                        </UButton>
                    </div>
                </div>
            </template>

            <!-- Interactive ECharts line chart wrapper -->
            <div class="relative w-full h-80 overflow-hidden p-2">
                <VChart :option="chartOption" autoresize class="w-full h-full" />
            </div>
        </UCard>
    </div>
</template>
