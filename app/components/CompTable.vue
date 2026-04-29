<script setup lang="ts">
import { ref, computed, h } from "vue";
import { UCheckbox } from "#components";

interface Props {
    data: any[];
    columns: any[];
    rowKey?: string;
    selectionEnabled?: boolean;
    multiSelect?: boolean;
    selectedBgClass?: string;
    hoveredBgClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    rowKey: "id",
    selectionEnabled: true,
    multiSelect: false,
    selectedBgClass: "bg-primary-50 dark:bg-primary-900",
    hoveredBgClass: "bg-gray-100 dark:bg-gray-800",
});

const emit = defineEmits<{
    "row-selected": [row: any];
    "rows-selected": [rows: any[]];
}>();

const selectedRowIndex = ref<number | null>(null);
const selectedRowIndices = ref<Set<number>>(new Set());
const hoveredRowIndex = ref<number | null>(null);

const getCellValue = (row: any, column: any) => {
    if (column.accessorFn) {
        return column.accessorFn(row);
    }
    if (column.accessorKey) {
        return row[column.accessorKey];
    }
    return "";
};

const columnsWithSelect = computed(() => {
    if (!props.selectionEnabled) {
        return props.columns;
    }
    return [
        {
            id: "select",
            header: props.multiSelect ? "" : "",
            cell: ({ row }: any) => {
                const isSelected = props.multiSelect
                    ? selectedRowIndices.value.has(row.index)
                    : selectedRowIndex.value === row.index;

                return h(UCheckbox, {
                    modelValue: isSelected,
                    "onUpdate:modelValue": (value) => {
                        if (props.multiSelect) {
                            if (value) {
                                selectedRowIndices.value.add(row.index);
                            } else {
                                selectedRowIndices.value.delete(row.index);
                            }
                            const selectedRows = Array.from(
                                selectedRowIndices.value,
                            ).map((idx) => props.data[idx]);
                            emit("rows-selected", selectedRows);
                        } else {
                            selectedRowIndex.value = row.index;
                            emit("row-selected", row.original);
                        }
                    },
                    "aria-label": "Select row",
                });
            },
        },
        ...props.columns,
    ];
});

const isRowSelected = (rowIndex: number) => {
    if (props.multiSelect) {
        return selectedRowIndices.value.has(rowIndex);
    }
    return selectedRowIndex.value === rowIndex;
};

const handleRowClick = (row: any, rowIndex: number) => {
    if (!props.selectionEnabled) return;

    if (props.multiSelect) {
        if (selectedRowIndices.value.has(rowIndex)) {
            selectedRowIndices.value.delete(rowIndex);
        } else {
            selectedRowIndices.value.add(rowIndex);
        }
        const selectedRows = Array.from(selectedRowIndices.value).map(
            (idx) => props.data[idx],
        );
        emit("rows-selected", selectedRows);
    } else {
        selectedRowIndex.value = rowIndex;
        emit("row-selected", row);
    }
};
</script>

<template>
    <div class="w-full overflow-x-auto">
        <table class="w-full border-collapse">
            <thead
                class="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700"
            >
                <tr>
                    <th
                        v-for="column in columnsWithSelect"
                        :key="column.id || column.accessorKey"
                        class="px-3 py-2 text-xs text-left font-semibold text-gray-600 dark:text-slate-300"
                    >
                        {{ column.header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(row, rowIndex) in data"
                    :key="rowIndex"
                    :class="[
                        'border-b border-gray-200 dark:border-slate-700 transition-colors duration-150',
                        selectionEnabled ? 'cursor-pointer' : '',
                        isRowSelected(rowIndex)
                            ? selectedBgClass
                            : rowIndex === hoveredRowIndex
                              ? hoveredBgClass
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800',
                    ]"
                    @mouseenter="hoveredRowIndex = rowIndex"
                    @mouseleave="hoveredRowIndex = null"
                    @click="handleRowClick(row, rowIndex)"
                >
                    <td
                        v-for="column in columnsWithSelect"
                        :key="column.id || column.accessorKey"
                        class="px-3 py-2 text-xs text-gray-600 dark:text-slate-400 whitespace-nowrap"
                    >
                        <component
                            v-if="column.id === 'select'"
                            :is="
                                column.cell({
                                    row: { index: rowIndex, original: row },
                                })
                            "
                        />
                        <template v-else-if="column.cell">
                            <component
                                :is="
                                    column.cell({
                                        getValue: () =>
                                            getCellValue(row, column),
                                        row: { index: rowIndex, original: row },
                                        column,
                                    })
                                "
                            />
                        </template>
                        <template v-else>
                            {{ getCellValue(row, column) }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
