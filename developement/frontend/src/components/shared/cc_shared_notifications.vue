<template>
    <div>
        <div v-if="notifications?.length < 1" class="wrapper">
            <img src="/img/empty2.8ccd6968.jpg" style="width: 200px;">
            <b> {{ $lang.noNotifications }} </b>
        </div>

        <cui-table v-else :data="notifications" square style="margin: 5px -10px">
            <template v-slot:row="{ row }">
                <td class="not-cell">
                    <div v-if="row.content.meta.type === 'examResultsAvailable'">
                        <i class="fas fa-microscope" style="margin-right: 10px; font-size: 20px" />
                        <span> {{ $lang.examResultsAvailable }} </span>
                    </div>
                </td>
            </template>

        </cui-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            notifications: this.$store.getters.notifications
        }
    }
}
</script>

<style scoped>
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .not-cell {
        min-width: 100px;
        padding: 30px;
    }
     </style>