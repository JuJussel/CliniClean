<template>
    <div>
        <cui-table :data="notifications?.length >0 ? notifications : emptyState" square style="margin: 5px -10px">
            <template v-slot:row="{ row }">
                <td style="min-width: 100px"> {{ row.text }} </td>
            </template>

        </cui-table>
    </div>
</template>

<script>
export default {
    props: {
        notifications: {
            default: null,
            type: Array
        }
    },
    data() {
        return {
            emptyState: [
                {text: "Empty"}
            ]
        }
    }
}
</script>

<style scoped>
    .notification-item {
        padding: 10px;
    }
     </style>